import { MediaRepository } from '../domain/repositories/MediaRepository'
import { retryOnBusy } from './retryOnBusy'

export class DeleteFileUseCase {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async execute(filePath: string): Promise<string> {
    return retryOnBusy(() => this.mediaRepository.deleteFile(filePath))
  }
}
