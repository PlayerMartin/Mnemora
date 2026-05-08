import { MediaFile } from '../../../shared/types'

export interface MediaRepository {
  getMediaFiles(folderPath: string): Promise<MediaFile[]>
  moveFile(filePath: string, targetPath: string): Promise<void>
  deleteFile(filePath: string): Promise<void>
}
