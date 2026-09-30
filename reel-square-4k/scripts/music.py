"""
Cut both songs to reel length on their own bar grids and export everything the
picture needs to stay locked to them.

  Thunderstruck (AC/DC)                 ~133.3 BPM, bar 1.80 s, live drummer
    A  song 24.06 -> 74.48   28 bars    riff + chants, drums in (bar 3),
                                        full band (bar 7), verse (bar 15)
    B  song 280.23 -> end    ending     the record's own final chord stabs
                                        carry the 10 s outro
  Lost Sky - Where We Started (NCS)     150 BPM, bar 1.60 s, on a grid
    A  song 59.26 -> 89.66   19 bars    3-bar build, drop 1 (16 bars)
    B  song 160.06 -> 189.66 18.5 bars  drop 2 from bar 5 (bar-matched to
                                        drop 1 by chroma+MFCC, sim 0.994),
                                        post-drop melody carries the outro

Splices land on refined downbeat transients with a 40 ms equal-power
crossfade that ends exactly on the downbeat, so B's attack is untouched.

Outputs
  public/audio/<id>.wav        48 kHz / 16-bit stereo edit (gitignored)
  src/music/<id>.json          fps, frames, beats[], downbeats[], sections,
                               per-frame envelopes (low / high / rms) and
                               kick + snare onset frames.

Inputs: the two MP3s. Pass their directory as MUSIC_DIR (default: the upload
folder used when this was built). Downbeats come from madmom's
RNNDownBeatProcessor + DBN tracker, cached in scripts/cache/<id>_db.json.
"""
import json, os, subprocess, sys
import numpy as np
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
FPS = 30
SR = 48000
MUSIC_DIR = os.environ.get('MUSIC_DIR', '/root/.claude/uploads/a8383684-3877-5058-a47f-cd76216c6d5e')
FFMPEG = os.environ.get('FFMPEG', 'ffmpeg')
MADMOM_PY = os.environ.get('MADMOM_PY', '/opt/mm/bin/python')

SONGS = {
    'thunderstruck': {
        'match': 'Thunderstruck',
        'title': 'AC/DC — Thunderstruck',
        'segments': [(24.06, 74.48), (280.23, 290.64)],
        'fade_out': 0.34,          # the final stab at 289.45 rings out by ~290.6
        'sections': [              # reel bars (from 0) where the music changes
            {'bar': 0, 'name': 'riff'},
            {'bar': 3, 'name': 'drums'},
            {'bar': 7, 'name': 'band'},
            {'bar': 15, 'name': 'verse'},
            {'bar': 28, 'name': 'ending'},
        ],
        'grid': False,
    },
    'lostsky': {
        'match': 'Lost_Sky',
        'title': 'Lost Sky — Where We Started (feat. Jex) [NCS Release]',
        'segments': [(59.26, 89.66), (160.06, 189.66)],
        'fade_out': 3.2,
        'sections': [
            {'bar': 0, 'name': 'build'},
            {'bar': 3, 'name': 'drop'},
            {'bar': 19, 'name': 'drop2'},
            {'bar': 31, 'name': 'outro'},
        ],
        'grid': True,
    },
}


def decode(path):
    raw = subprocess.run([FFMPEG, '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'],
                         check=True, capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


def downbeats(song_id, wav_path):
    os.makedirs(os.path.join(HERE, 'cache'), exist_ok=True)
    cache = os.path.join(HERE, 'cache', f'{song_id}_db.json')
    if not os.path.exists(cache):
        code = ("import sys,json;from madmom.features.downbeats import RNNDownBeatProcessor as R,"
                "DBNDownBeatTrackingProcessor as D;a=R()(sys.argv[1]);"
                "b=D(beats_per_bar=[4],fps=100,min_bpm=60,max_bpm=190)(a);"
                "json.dump({'beats':b[:,0].tolist(),'pos':b[:,1].astype(int).tolist()},open(sys.argv[2],'w'))")
        subprocess.run([MADMOM_PY, '-c', code, wav_path, cache], check=True)
    d = json.load(open(cache))
    return np.array(d['beats']), np.array(d['pos'])


def onset_env(x_mono, sr, lo, hi, hop=128):
    sos = signal.butter(4, [lo, hi], btype='band', fs=sr, output='sos') if hi < sr / 2 else \
        signal.butter(4, lo, btype='high', fs=sr, output='sos')
    y = signal.sosfilt(sos, x_mono)
    e = np.sqrt(np.convolve(y ** 2, np.ones(hop) / hop, mode='same'))[::hop]
    le = np.log1p(e * 200)
    d = np.maximum(0, np.diff(le, prepend=le[0]))
    return d, hop


def refine(t, x_mono):
    """Snap a tracked downbeat to the strongest broadband transient within +-35 ms."""
    d, hop = onset_env(x_mono, SR, 40, 12000)
    i0, i1 = int((t - 0.035) * SR / hop), int((t + 0.035) * SR / hop)
    k = i0 + int(np.argmax(d[i0:i1]))
    return k * hop / SR


def envelopes(y, frames):
    mono = y.mean(1)
    spf = SR / FPS
    out = {}
    bands = {'low': (30, 150), 'mid': (150, 2000), 'high': (5000, 16000)}
    for name, (lo, hi) in bands.items():
        sos = signal.butter(4, [lo, min(hi, SR / 2 - 100)], btype='band', fs=SR, output='sos')
        b = signal.sosfilt(sos, mono)
        v = np.array([np.sqrt(np.mean(b[int(i * spf):int((i + 1) * spf)] ** 2) + 1e-12) for i in range(frames)])
        v = v / (np.percentile(v, 98) + 1e-9)
        out[name] = np.clip(v, 0, 1.25)
    v = np.array([np.sqrt(np.mean(mono[int(i * spf):int((i + 1) * spf)] ** 2) + 1e-12) for i in range(frames)])
    out['rms'] = np.clip(v / (np.percentile(v, 98) + 1e-9), 0, 1.25)
    return out


def peaks(d, hop, thr_pct, min_gap_s):
    thr = np.percentile(d, thr_pct)
    idx, _ = signal.find_peaks(d, height=thr, distance=max(1, int(min_gap_s * SR / hop)))
    return [(i * hop / SR, float(d[i])) for i in idx]


def build(song_id, cfg):
    src = [f for f in os.listdir(MUSIC_DIR) if cfg['match'] in f and f.endswith('.mp3')][0]
    src = os.path.join(MUSIC_DIR, src)
    x = decode(src)
    mono = x.mean(1)
    dur = len(x) / SR
    tmp_wav = os.path.join(HERE, 'cache', f'{song_id}_full.wav')
    os.makedirs(os.path.dirname(tmp_wav), exist_ok=True)
    if not os.path.exists(tmp_wav):
        subprocess.run([FFMPEG, '-v', 'error', '-y', '-i', src, '-ac', '2', '-ar', '44100', tmp_wav], check=True)
    beats, pos = downbeats(song_id, tmp_wav)

    if cfg['grid']:
        # Electronic, fixed tempo: fit one straight line through every downbeat.
        db = beats[pos == 1]
        k = np.arange(len(db))
        per, t0 = np.polyfit(k, db, 1)
        beat_times = t0 + np.arange(-4, int(dur / (per / 4)) + 8) * per / 4
        beat_times = beat_times[(beat_times >= 0) & (beat_times < dur)]
        beat_pos = (np.round((beat_times - t0) / (per / 4)).astype(int) % 4) + 1
        snap = lambda t: t0 + round((t - t0) / per) * per
        print(f'{song_id}: grid bar {per:.5f} s = {240 / per:.3f} BPM, t0 {t0:.4f}')
    else:
        beat_times, beat_pos = beats, pos
        snap = lambda t: refine(beat_times[np.argmin(np.abs(beat_times - t))], mono)

    # Every splice point snaps to its downbeat; the very end is a fade point
    # and is left exactly where the config puts it.
    segs = []
    n = len(cfg['segments'])
    for i, (a, b) in enumerate(cfg['segments']):
        segs.append([snap(a), b if i == n - 1 else snap(b)])

    # ---- splice with a 40 ms equal-power crossfade ending on each downbeat
    XF = int(0.040 * SR)
    out = x[int(segs[0][0] * SR):int(segs[0][1] * SR)].copy()
    edl = [{'src': [round(segs[0][0], 4), round(segs[0][1], 4)], 'at': 0.0}]
    for a, b in segs[1:]:
        ia, ib = int(a * SR), int(b * SR)
        pre = x[ia - XF:ia]
        tail = out[-XF:]
        t = np.linspace(0, np.pi / 2, XF)[:, None]
        out[-XF:] = tail * np.cos(t) + pre * np.sin(t)
        edl.append({'src': [round(a, 4), round(b, 4)], 'at': round(len(out) / SR, 4)})
        out = np.concatenate([out, x[ia:ib]])
    # 8 ms fade-in so frame 0 does not click, and the configured fade-out
    fi = int(0.008 * SR)
    out[:fi] *= np.linspace(0, 1, fi)[:, None]
    fo = int(cfg['fade_out'] * SR)
    curve = np.cos(np.linspace(0, np.pi / 2, fo)) ** 1.6
    out[-fo:] *= curve[:, None]
    frames = int(np.ceil(len(out) / SR * FPS))
    out = np.concatenate([out, np.zeros((int(frames / FPS * SR) - len(out), 2), np.float32)])
    peak = np.abs(out).max()
    if peak > 0.891:  # -1 dBFS ceiling
        out *= 0.891 / peak
    os.makedirs(os.path.join(PUB := os.path.join(PROJ, 'public'), 'audio'), exist_ok=True)
    pcm = (np.clip(out, -1, 1) * 32767).astype('<i2')
    wav_path = os.path.join(PUB, 'audio', f'{song_id}.wav')
    import wave
    with wave.open(wav_path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())

    # ---- map beats into reel time
    def to_reel(t):
        for e in edl:
            a, b = e['src']
            if a - 0.05 <= t < b - 0.05:     # tracked beat may sit a hair before the refined splice
                return e['at'] + max(0.0, t - a)
        return None
    rb = []
    for t, p in zip(beat_times, beat_pos):
        r = to_reel(float(t))
        if r is not None and r < len(out) / SR:
            rb.append({'t': round(r, 4), 'f': int(np.floor(r * FPS + 1e-6)), 'pos': int(p)})
    # de-duplicate beats that straddle a splice
    clean = []
    for b in rb:
        if clean and b['t'] - clean[-1]['t'] < 0.2:
            continue
        clean.append(b)
    rb = clean
    db = [b for b in rb if b['pos'] == 1]

    env = envelopes(out, frames)
    kick_d, hop = onset_env(out.mean(1), SR, 35, 120)
    snare_d, _ = onset_env(out.mean(1), SR, 1500, 6000)
    kicks = [{'t': round(t, 4), 'f': int(t * FPS), 'v': round(v, 3)} for t, v in peaks(kick_d, hop, 97.5, 0.18)]
    snares = [{'t': round(t, 4), 'f': int(t * FPS), 'v': round(v, 3)} for t, v in peaks(snare_d, hop, 97.5, 0.18)]

    data = {
        'id': song_id, 'title': cfg['title'], 'fps': FPS, 'frames': frames,
        'duration': round(frames / FPS, 4), 'edl': edl, 'sections': cfg['sections'],
        'beats': rb, 'downbeats': db, 'kicks': kicks, 'snares': snares,
        'env': {k: [round(float(v), 3) for v in a] for k, a in env.items()},
    }
    os.makedirs(os.path.join(PROJ, 'src', 'music'), exist_ok=True)
    json.dump(data, open(os.path.join(PROJ, 'src', 'music', f'{song_id}.json'), 'w'))
    bars = np.diff([d['t'] for d in db])
    print(f"{song_id}: {frames} frames ({frames / FPS:.3f} s), {len(rb)} beats, {len(db)} downbeats, "
          f"bar {np.median(bars):.3f}s [{bars.min():.3f}..{bars.max():.3f}], kicks {len(kicks)}, snares {len(snares)}")
    print('  edl', edl)
    print('  downbeats', [d['t'] for d in db][:40])


if __name__ == '__main__':
    for sid, cfg in SONGS.items():
        if len(sys.argv) > 1 and sid not in sys.argv[1:]:
            continue
        build(sid, cfg)
