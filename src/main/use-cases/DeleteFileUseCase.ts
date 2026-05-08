import { MediaRepository } from '../domain/repositories/MediaRepository'

export class DeleteFileUseCase {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async execute(filePath: string): Promise<string> {
    return await this.mediaRepository.deleteFile(filePath)
  }
}
