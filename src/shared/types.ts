export interface MediaFile {
  id: string
  name: string
  path: string
  type: 'image' | 'video' | 'audio'
  stats: {
    ctime: number
    size: number
  }
}

export interface FolderContent {
  path: string
  files: MediaFile[]
}
