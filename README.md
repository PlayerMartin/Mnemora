# Mnemora

**Mnemora** is a keyboard-driven desktop application for sorting media galleries. Load a folder, assign keys to destinations, and tear through your backlog one keypress at a time.

Built for photographers, videographers, and anyone sitting on years of unsorted media.

## Features

- **Keyboard-first** — sort, rename, delete, and undo without touching the mouse
- **Mouse-friendly** — add, edit, and remove keybinds via clickable controls
- **Instant moves** — files are moved the moment you press a key
- **File rename** — rename files inline with `F2`, with undo support
- **Undo stack** — step back up to 200 actions (moves, deletes, and renames)
- **Session persistence** — folder, position, and keybinds survive restarts
- **Keybind templates** — save and load named keybind sets across sessions
- **Auto-update** — Windows and Linux check for updates on launch (macOS: manual download)
- **Supports images, video, and audio** — inline playback for all media types

## How It Works

1. Launch Mnemora and select a folder (or resume a previous session).
2. Map keys to folder names — for example `f` → `family`, `h` → `holiday`.
3. Mnemora displays your files one by one, ordered by creation date.
4. Press a key to sort the current file, or use the controls below.
5. When every file has been handled, a summary screen shows the results.

## Controls

| Key                | Action                                    |
| ------------------ | ----------------------------------------- |
| _your key_         | Move current file to the mapped subfolder |
| `→`                | Skip current file                         |
| `←`                | Go back to the previous file              |
| `Delete`           | Send current file to `.trash`             |
| `F2`               | Rename current file                       |
| `Ctrl+Z`           | Undo the last action                      |
| `Ctrl+O`           | Select source folder                      |
| `Ctrl+T`           | Open keybind template manager             |
| `Ctrl+Shift+C`     | Reset all keybinds                        |
| `Ctrl+<key>`       | Edit a custom keybind                     |
| `Ctrl+Shift+<key>` | Remove a custom keybind                   |
| `?`                | Toggle keybind overlay                    |

## Supported Formats

| Type  | Formats                              |
| ----- | ------------------------------------ |
| Image | `.jpg` `.jpeg` `.png` `.gif` `.webp` |
| Video | `.mp4` `.mov` `.avi` `.mkv` `.webm`  |
| Audio | `.mp3` `.flac` `.wav` `.ogg`         |

## Platforms

- Windows (NSIS installer, auto-update)
- Linux (AppImage, auto-update)
- macOS (DMG, manual update)

## Known Limitations

- Deleted files are moved to a `.trash` subfolder and are not automatically cleaned up.
- Auto-update is not available on macOS (unsigned builds).

## License

Mnemora is open source. Commercial use is restricted.
