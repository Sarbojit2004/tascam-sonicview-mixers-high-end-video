#!/usr/bin/env python3
"""
ITU-R BS.1770-4 integrated loudness, in numpy.

Written because the ffmpeg bundled with Remotion's compositor is a stripped
build: it lists `loudnorm` as "(null)" and has no `ebur128` at all. The TASCAM
Recording Series production calibrates every deliverable to -28 LUFS measured
with `ffmpeg -af ebur128`, and matching that target is the whole point of this
work, so the meter has to exist one way or another.

The implementation is the standard, in full:

  1. K-weighting  — a high-shelf "head" filter then an RLB high-pass, both at
                    the coefficients the spec fixes for 48 kHz.
  2. Blocks       — 400 ms, 75 % overlap.
  3. Channel sum  — G = 1.0 for L and R (no surround here).
  4. Absolute gate at -70 LKFS.
  5. Relative gate at (ungated loudness - 10 LU).
  6. Integrated   = -0.691 + 10*log10(mean of the surviving block powers).

Validated against the Recording Series' own shipped beds, which were measured
with ebur128 and calibrated to -28: if this meter agrees with those files, it
agrees with the tool their numbers came from.
"""
import numpy as np
from scipy.signal import lfilter

SR = 48000


def _biquad(x, b, a):
    """
    Both K-weighting stages, over all channels at once.

    Uses scipy's lfilter rather than a hand-written sample loop: a 298-second
    stereo bed is 28.6 million samples per channel, and the loop version took
    over ten minutes for a single file. Same filter, same coefficients, three
    orders of magnitude faster.
    """
    return lfilter(np.asarray(b), np.asarray(a), x, axis=0)


# BS.1770-4 Tables 1 and 2 — the 48 kHz coefficients, verbatim.
_HEAD_B = (1.53512485958697, -2.69169618940638, 1.19839281085285)
_HEAD_A = (1.0, -1.69065929318241, 0.73248077421585)
_RLB_B = (1.0, -2.0, 1.0)
_RLB_A = (1.0, -1.99004745483398, 0.99007225036621)


def k_weight(x):
    return _biquad(_biquad(x, _HEAD_B, _HEAD_A), _RLB_B, _RLB_A)


def integrated_lufs(x, sr=SR):
    """x: float array, shape (n, channels), range -1..1."""
    if x.ndim == 1:
        x = x[:, None]
    y = k_weight(np.asarray(x, dtype=np.float64))

    block = int(0.400 * sr)
    hop = block // 4  # 75 % overlap
    if len(y) < block:
        return -np.inf

    # Mean square per block, summed over channels with G = 1.0.
    starts = range(0, len(y) - block + 1, hop)
    z = np.array([np.sum(np.mean(y[s:s + block] ** 2, axis=0)) for s in starts])
    with np.errstate(divide="ignore"):
        loud = -0.691 + 10.0 * np.log10(z + 1e-30)

    # Absolute gate.
    keep = loud > -70.0
    if not keep.any():
        return -np.inf

    # Relative gate, 10 LU below the absolutely-gated loudness.
    ungated = -0.691 + 10.0 * np.log10(np.mean(z[keep]) + 1e-30)
    keep &= loud > (ungated - 10.0)
    if not keep.any():
        return -np.inf

    return float(-0.691 + 10.0 * np.log10(np.mean(z[keep]) + 1e-30))


def true_peak_db(x):
    """Sample peak in dBFS. Not true-peak, and not claimed to be."""
    p = float(np.max(np.abs(x))) if len(x) else 0.0
    return 20.0 * np.log10(p + 1e-12)


def gain_to_reach(x, target_lufs, sr=SR):
    """Linear gain that would put x at target_lufs."""
    cur = integrated_lufs(x, sr)
    if not np.isfinite(cur):
        return 1.0
    return float(10.0 ** ((target_lufs - cur) / 20.0))
