import { stat } from 'fs/promises'

export async function resolveByteRange(path: string, rangeHeader: string) {
  const fileSize = (await stat(path)).size
  const [, startStr, endStr] = rangeHeader.match(/bytes=(\d+)-(\d*)/) ?? []
  const start = parseInt(startStr, 10)
  const end = endStr ? parseInt(endStr, 10) : fileSize - 1
  return { start, end, fileSize }
}
