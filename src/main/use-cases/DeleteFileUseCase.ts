import { MediaRepository } from '../domain/repositories/MediaRepository'

export class DeleteFileUseCase {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async execute(filePath: string): Promise<void> {
    await this.mediaRepository.deleteFile(filePath)
  }
}
