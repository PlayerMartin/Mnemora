import { MediaRepository } from '../domain/repositories/MediaRepository'
import { extname, dirname, join } from 'path'

export class RenameFileUseCase {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async execute(filePath: string, newBaseName: string): Promise<string> {
    const dir = dirname(filePath)
    const ext = extname(filePath)

    let candidate = newBaseName
    let suffix = 0
    while (await this.mediaRepository.fileExists(join(dir, candidate + ext))) {
      suffix++
      candidate = `${newBaseName}-${suffix}`
    }

    let retries = 5
    while (retries > 0) {
      try {
        return await this.mediaRepository.renameFile(filePath, candidate)
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
    return join(dir, candidate + ext)
  }
}
