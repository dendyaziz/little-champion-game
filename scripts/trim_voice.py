#!/usr/bin/env python3
"""
Voice Activity Detection & Precise Silence Trimming Tool.

Detects where actual human speech begins and ends in an audio file using
short-time RMS energy analysis, and tightly trims all leading and trailing
silence with a smooth micro-fade (5ms in, 10ms out) to prevent clicks.
"""

import os
import sys
import glob
import math
import struct
import subprocess

FFMPEG_BIN = "/opt/homebrew/bin/ffmpeg"

def trim_audio_file(file_path: str, threshold_ratio: float = 0.025, min_threshold: float = 250.0):
    """
    Detects the speech start and end boundaries in file_path and trims
    leading and trailing silence cleanly in-place.
    """
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    # Decode audio to 24kHz 16-bit mono PCM via ffmpeg
    cmd = [FFMPEG_BIN, "-y", "-i", file_path, "-f", "s16le", "-ac", "1", "-ar", "24000", "-"]
    raw = subprocess.check_output(cmd, stderr=subprocess.DEVNULL)
    samples = list(struct.unpack(f"<{len(raw)//2}h", raw))
    if not samples:
        return

    sr = 24000
    frame_ms = 5
    frame_size = sr * frame_ms // 1000  # 120 samples per 5ms window

    # Calculate short-time RMS energy per frame
    num_frames = len(samples) // frame_size
    rms_list = []
    for i in range(num_frames):
        chunk = samples[i * frame_size : (i + 1) * frame_size]
        rms = math.sqrt(sum(s * s for s in chunk) / len(chunk))
        rms_list.append(rms)

    peak_rms = max(rms_list) if rms_list else 1
    thresh = max(peak_rms * threshold_ratio, min_threshold)

    # Detect speech start (first frame exceeding threshold)
    start_frame = 0
    for idx, r in enumerate(rms_list):
        if r > thresh:
            start_frame = idx
            break

    # Detect speech end (last frame exceeding threshold)
    end_frame = num_frames - 1
    for idx in range(num_frames - 1, -1, -1):
        if rms_list[idx] > thresh:
            end_frame = idx
            break

    # Keep a small, clean safety margin (10ms before start, 15ms after end)
    # to avoid clipping plosives ('p', 't', 'k') or soft fricatives ('s', 'th')
    buffer_pre = sr * 10 // 1000   # 10ms
    buffer_post = sr * 15 // 1000  # 15ms

    cut_start = max(0, start_frame * frame_size - buffer_pre)
    cut_end = min(len(samples), (end_frame + 1) * frame_size + buffer_post)

    trimmed = samples[cut_start:cut_end]

    # Apply 5ms fade-in and 10ms fade-out at the exact cut boundaries
    fade_in_len = min(len(trimmed), sr * 5 // 1000)
    for i in range(fade_in_len):
        trimmed[i] = int(trimmed[i] * (i / fade_in_len))

    fade_out_len = min(len(trimmed), sr * 10 // 1000)
    for i in range(fade_out_len):
        idx = len(trimmed) - 1 - i
        trimmed[idx] = int(trimmed[idx] * (i / fade_out_len))

    # Re-encode to MP3 at 128k
    out_raw = struct.pack(f"<{len(trimmed)}h", *trimmed)
    proc = subprocess.Popen([
        FFMPEG_BIN, "-y",
        "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", "-",
        "-b:a", "128k", file_path
    ], stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    proc.communicate(input=out_raw)

    orig_dur = len(samples) / sr
    new_dur = len(trimmed) / sr
    lead_ms = (cut_start / sr) * 1000
    trail_ms = ((len(samples) - cut_end) / sr) * 1000
    print(f"✓ {os.path.basename(file_path):<28}: {orig_dur:.3f}s -> {new_dur:.3f}s (trimmed {lead_ms:.0f}ms lead, {trail_ms:.0f}ms trail)")

def main():
    targets = []
    if len(sys.argv) > 1:
        for arg in sys.argv[1:]:
            if os.path.isdir(arg):
                targets.extend(glob.glob(os.path.join(arg, "*.mp3")))
            elif os.path.isfile(arg):
                targets.append(arg)
    else:
        # Default: process all audio files in public/audio/
        targets.extend(sorted(glob.glob("public/audio/numbers/*.mp3")))
        targets.extend(sorted(glob.glob("public/audio/letters/*.mp3")))
        targets.extend(sorted(glob.glob("public/audio/shapes/*.mp3")))
        targets.extend(sorted(glob.glob("public/audio/colors/*.mp3")))
        targets.extend(sorted(glob.glob("public/audio/narrations/*.mp3")))

    print(f"Trimming silence on {len(targets)} audio files...")
    for t in targets:
        trim_audio_file(t)
    print("Done!")

if __name__ == "__main__":
    main()
