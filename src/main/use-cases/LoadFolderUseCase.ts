import { MediaRepository } from '../domain/repositories/MediaRepository'
import { FolderContent } from '../../shared/types'

export class LoadFolderUseCase {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async execute(path: string): Promise<FolderContent | null> {
    try {
      const files = await this.mediaRepository.getMediaFiles(path)
      files.sort((a, b) => b.stats.ctime - a.stats.ctime)
      return { path, files }
    } catch {
      return null
    }
  }
}
