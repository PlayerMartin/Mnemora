import { stat } from 'fs/promises'

export type ByteRangeResult =
  | { ok: true; start: number; end: number; fileSize: number }
  | { ok: false; fileSize: number }

export async function resolveByteRange(
  path: string,
  rangeHeader: string
): Promise<ByteRangeResult> {
  const fileSize = (await stat(path)).size
  const match = rangeHeader.match(/bytes=(\d+)-(\d*)/)

  if (!match || !match[1]) {
    return { ok: false, fileSize }
  }

  const start = parseInt(match[1], 10)
  if (Number.isNaN(start)) {
    return { ok: false, fileSize }
  }

  const end = match[2] ? Math.min(parseInt(match[2], 10), fileSize - 1) : fileSize - 1

  if (start >= fileSize || start > end) {
    return { ok: false, fileSize }
  }

  return { ok: true, start, end, fileSize }
}
