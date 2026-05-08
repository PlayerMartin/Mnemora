import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';
import { MediaRepository } from '../../domain/repositories/MediaRepository';
import { MediaFile } from '../../../shared/types';

const SUPPORTED_EXTENSIONS = {
  image: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  video: ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
  audio: ['.mp3', '.flac', '.wav', '.ogg']
};

export class ElectronMediaRepository implements MediaRepository {

  async getMediaFiles(folderPath: string): Promise<MediaFile[]> {
    const entries = await readdir(folderPath, { withFileTypes: true });
    const files: MediaFile[] = [];

    for (const entry of entries) {
      if (entry.isFile()) {
        const fullPath = join(folderPath, entry.name);
        const ext = extname(entry.name).toLowerCase();
        
        const type = this.getMediaType(ext);
        if (type) {
          const stats = await stat(fullPath);
          files.push({
            id: entry.name, // Using name as ID for simplicity now
            name: entry.name,
            path: fullPath,
            type,
            stats: {
              ctime: stats.birthtimeMs,
              size: stats.size
            }
          });
        }
      }
    }

    return files;
  }

  private getMediaType(ext: string): 'image' | 'video' | 'audio' | null {
    if (SUPPORTED_EXTENSIONS.image.includes(ext)) return 'image';
    if (SUPPORTED_EXTENSIONS.video.includes(ext)) return 'video';
    if (SUPPORTED_EXTENSIONS.audio.includes(ext)) return 'audio';
    return null;
  }
}
