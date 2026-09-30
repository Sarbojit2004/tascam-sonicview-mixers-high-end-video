"""
Check every finished reel against its contract.

  python3 scripts/verify.py

For each cut: resolution (3840 / 1080 square), frame count and duration equal
to the beat map's, H.264 + AAC present, BT.709 tags, file size under GitHub's
100 MB limit, and the audio carrying signal across the whole runtime (no
silent stretch longer than a second before the planned ending).
"""
import json, os, re, subprocess, sys
import numpy as np

PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FF = os.environ.get('FFMPEG', 'ffmpeg')
ok = True


def probe(path):
    err = subprocess.run([FF, '-hide_banner', '-i', path], capture_output=True, text=True).stderr
    dur = re.search(r'Duration: (\d+):(\d+):([\d.]+)', err)
    d = int(dur[1]) * 3600 + int(dur[2]) * 60 + float(dur[3])
    v = re.search(r'Video: (\w+).*?, (\d+)x(\d+)', err)
    a = re.search(r'Audio: (\w+), (\d+) Hz', err)
    return err, d, v, a


def frames(path):
    out = subprocess.run([FF, '-hide_banner', '-i', path, '-map', '0:v:0', '-c', 'copy', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    m = re.findall(r'frame=\s*(\d+)', out)
    return int(m[-1]) if m else -1


def audio_contour(path, sr=8000):
    raw = subprocess.run([FF, '-v', 'error', '-i', path, '-map', '0:a:0', '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'],
                         capture_output=True).stdout
    x = np.frombuffer(raw, np.float32)
    win = sr // 10
    n = len(x) // win
    return np.sqrt((x[: n * win].reshape(n, win) ** 2).mean(1))


for v in ['thunderstruck', 'lostsky']:
    beat = json.load(open(os.path.join(PROJ, 'src', 'music', f'{v}.json')))
    for suffix, side in [('', 3840), ('-1080', 1080)]:
        path = os.path.join(PROJ, 'out', f'sonicview-square-4k-{v}{suffix}.mp4')
        if not os.path.exists(path):
            print(f'MISSING {path}')
            ok = False
            continue
        err, d, vs, a = probe(path)
        size = os.path.getsize(path) / 1e6
        n = frames(path)
        rms = audio_contour(path)
        loud = rms > 0.004
        # longest silent run before the last second
        body = loud[: max(1, len(loud) - 10)]
        run = best = 0
        for s in body:
            run = 0 if s else run + 1
            best = max(best, run)
        checks = {
            'h264': vs is not None and vs[1] == 'h264',
            f'{side}x{side}': vs is not None and int(vs[2]) == side and int(vs[3]) == side,
            f'frames=={beat["frames"]}': n == beat['frames'],
            'duration': abs(d - beat['frames'] / 30) < 0.05,
            'aac': a is not None and a[1] == 'aac',
            'bt709': 'bt709' in err,
            '<100MB': size < 100,
            'audio': best < 10,
        }
        bad = [k for k, c in checks.items() if not c]
        ok &= not bad
        print(f"{'PASS' if not bad else 'FAIL'}  {os.path.basename(path):48s} {size:6.1f} MB  {n} f  {d:.3f} s  "
              f"longest quiet {best / 10:.1f}s" + (f'  -> {bad}' if bad else ''))

sys.exit(0 if ok else 1)
