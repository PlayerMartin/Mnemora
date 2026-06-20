import { MediaRepository } from '../domain/repositories/MediaRepository'
import { extname, dirname, join } from 'path'
import { retryOnBusy } from './retryOnBusy'

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

    return retryOnBusy(() => this.mediaRepository.renameFile(filePath, candidate))
  }
}
