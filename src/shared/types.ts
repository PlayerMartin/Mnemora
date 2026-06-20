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

export interface PersistedState {
  session: { folderPath: string | null; currentIndex: number }
  keybinds: Record<string, string>
  keybindTemplates: Record<string, Record<string, string>>
}
