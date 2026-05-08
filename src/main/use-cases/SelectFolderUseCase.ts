import { MediaRepository } from '../domain/repositories/MediaRepository';
import { DialogGateway } from '../domain/gateways/DialogGateway';
import { FolderContent } from '../../shared/types';

export class SelectFolderUseCase {
  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly dialogGateway: DialogGateway
  ) { }

  async execute(): Promise<FolderContent | null> {
    const path = await this.dialogGateway.selectDirectory();
    if (!path) return null;

    const files = await this.mediaRepository.getMediaFiles(path);

    files.sort((a, b) => b.stats.ctime - a.stats.ctime);

    return { path, files };
  }
}
