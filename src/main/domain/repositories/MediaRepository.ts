import { MediaFile } from '../../../shared/types'

export interface MediaRepository {
  getMediaFiles(folderPath: string): Promise<MediaFile[]>
  moveFile(filePath: string, targetPath: string): Promise<void>
  deleteFile(filePath: string): Promise<string>
  undoAction(originalPath: string, currentPath: string): Promise<void>
  renameFile(filePath: string, newBaseName: string): Promise<string>
  fileExists(path: string): Promise<boolean>
  nonCollidingPath(targetPath: string): Promise<string>
}
