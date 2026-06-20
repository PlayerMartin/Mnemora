import { MediaRepository } from '../domain/repositories/MediaRepository'
import { join, dirname, basename } from 'path'
import { retryOnBusy } from './retryOnBusy'

export class MoveFileUseCase {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async execute(filePath: string, targetFolderName: string): Promise<string> {
    const fileName = basename(filePath)
    const parentDir = dirname(filePath)
    const targetPath = await this.mediaRepository.nonCollidingPath(
      join(parentDir, targetFolderName, fileName)
    )

    return retryOnBusy(() =>
      this.mediaRepository.moveFile(filePath, targetPath).then(() => targetPath)
    )
  }
}
