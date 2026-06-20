import { readdir, stat, mkdir, rename, access } from 'fs/promises'
import { join, extname, dirname, basename } from 'path'
import { MediaRepository } from '../../domain/repositories/MediaRepository'
import { MediaFile } from '../../../shared/types'

const SUPPORTED_EXTENSIONS = {
  image: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  video: ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
  audio: ['.mp3', '.flac', '.wav', '.ogg']
}

export class ElectronMediaRepository implements MediaRepository {
  async moveFile(filePath: string, targetPath: string): Promise<void> {
    await mkdir(dirname(targetPath), { recursive: true })
    await rename(filePath, targetPath)
  }

  async deleteFile(filePath: string): Promise<string> {
    const trashDir = join(dirname(filePath), '.trash')
    await mkdir(trashDir, { recursive: true })
    const targetPath = await this.nonCollidingPath(join(trashDir, basename(filePath)))
    await rename(filePath, targetPath)
    return targetPath
  }

  async undoAction(originalPath: string, currentPath: string): Promise<void> {
    await rename(currentPath, originalPath)
  }

  async renameFile(filePath: string, newBaseName: string): Promise<string> {
    const dir = dirname(filePath)
    const ext = extname(filePath)
    const targetPath = join(dir, newBaseName + ext)
    await rename(filePath, targetPath)
    return targetPath
  }

  async fileExists(path: string): Promise<boolean> {
    try {
      await access(path)
      return true
    } catch {
      return false
    }
  }

  async getMediaFiles(folderPath: string): Promise<MediaFile[]> {
    const entries = await readdir(folderPath, { withFileTypes: true })
    const files: MediaFile[] = []

    for (const entry of entries) {
      if (entry.isFile()) {
        const fullPath = join(folderPath, entry.name)
        const ext = extname(entry.name).toLowerCase()

        const type = this.getMediaType(ext)
        if (type) {
          const stats = await stat(fullPath)
          files.push({
            id: fullPath,
            name: entry.name,
            path: fullPath,
            type,
            stats: {
              ctime: stats.birthtimeMs,
              size: stats.size
            }
          })
        }
      }
    }

    return files
  }

  async nonCollidingPath(targetPath: string): Promise<string> {
    if (!(await this.fileExists(targetPath))) return targetPath
    const dir = dirname(targetPath)
    const ext = extname(targetPath)
    const base = basename(targetPath, ext)
    let n = 1
    while (await this.fileExists(join(dir, `${base} (${n})${ext}`))) n++
    return join(dir, `${base} (${n})${ext}`)
  }

  private getMediaType(ext: string): 'image' | 'video' | 'audio' | null {
    if (SUPPORTED_EXTENSIONS.image.includes(ext)) return 'image'
    if (SUPPORTED_EXTENSIONS.video.includes(ext)) return 'video'
    if (SUPPORTED_EXTENSIONS.audio.includes(ext)) return 'audio'
    return null
  }
}
