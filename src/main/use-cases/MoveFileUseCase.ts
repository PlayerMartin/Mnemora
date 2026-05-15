import { MediaRepository } from '../domain/repositories/MediaRepository'
import { join } from 'path'

export class MoveFileUseCase {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async execute(filePath: string, targetFolderName: string): Promise<string> {
    const fileName = filePath.split(/[\\/]/).pop()!
    const parentDir = filePath.substring(0, filePath.lastIndexOf(fileName) - 1)
    const targetPath = join(parentDir, targetFolderName, fileName)

    let retries = 5
    while (retries > 0) {
      try {
        await this.mediaRepository.moveFile(filePath, targetPath)
        return targetPath
      } catch (error: unknown) {
        if (
          error &&
          typeof error === 'object' &&
          'code' in error &&
          error.code === 'EBUSY' &&
          retries > 1
        ) {
          retries--
          await new Promise((resolve) => setTimeout(resolve, 200))
          continue
        }
        throw error
      }
    }
    return targetPath
  }
}
