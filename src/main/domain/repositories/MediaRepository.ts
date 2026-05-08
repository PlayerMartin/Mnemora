import { MediaFile } from '../../../shared/types';

export interface MediaRepository {
  getMediaFiles(folderPath: string): Promise<MediaFile[]>;
}
