# Mnemora

**Mnemora** is a keyboard-driven desktop application for sorting media galleries. Load a folder, assign keys to destinations, and tear through your backlog one keypress at a time.

Built for photographers, videographers, and anyone sitting on years of unsorted media.

## Features

- **Keyboard-first** — the entire sorting workflow is operable without a mouse
- **Instant moves** — files are moved the moment you press a key, no confirmation dialogs
- **Undo support** — step back up to 200 actions, including files moved to trash
- **Auto-creates subfolders** — target folders are created automatically if they don't exist
- **Supports images, video, and audio** — inline playback for video, player bar for audio
- **Completion summary** — see exactly what was sorted, deleted, and skipped when you're done

## Supported Formats

| Type  | Formats                                                     |
| ----- | ----------------------------------------------------------- |
| Image | `.jpg` `.jpeg` `.png` and other common image formats        |
| Video | `.mp4` `.mov` `.avi` `.mkv` and other common video formats  |
| Audio | `.mp3` `.flac` `.wav` `.ogg` and other common audio formats |

## How It Works

1. Launch Mnemora and select a folder.
2. Map keys to folder names — for example `f` → `family`, `h` → `holiday`, `m` → `misc`.
3. Mnemora displays your files one by one, ordered by creation date.
4. Press a key to sort the current file, or use the built-in controls below.
5. When every file has been handled, a summary screen shows the results.

## Controls

| Key               | Action                                    |
| ----------------- | ----------------------------------------- |
| _your key_        | Move current file to the mapped subfolder |
| `→`               | Skip current file                         |
| `←`               | Go back to the previous file              |
| `Delete`          | Send current file to trash                |
| `Ctrl+Z`          | Undo the last action                      |
| `Ctrl+O`          | Select source folder                      |
| `Ctrl+Shift+C`    | Reset all keybinds                        |
| `Ctrl+<key>`      | Edit a custom keybind                     |
| `Ctrl+Shift+<key>`| Remove a custom keybind                   |
| `?`               | Toggle keybind overlay                    |

The keybind overlay shows all active controls — both built-in and your custom mappings — in a toggleable HUD over the main view.

## Keybind Configuration

Keybinds are configured at the start of each session and forgotten when the app is closed. The configuration interface is fully keyboard-operable — no mouse required.

## Platforms

- Windows
- Linux
- MacOS

## Roadmap

Mnemora is functional but not yet feature-complete.

- [x] Core sorting workflow
- [x] Undo support
- [x] Image, video, and audio support
- [x] HUD overlay
- [x] Completion screen
- [x] Custom keybind configuration
- [ ] Session persistence
- [ ] ...and more

## License

Mnemora is open source. Commercial use is restricted.
