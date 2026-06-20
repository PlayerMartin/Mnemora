export type KeybindSection = 'navigation' | 'actions'

export type StaticKeybindDef = {
  id: string
  section: KeybindSection
  description: string
  display: string[]
  keys: string[]
  preventDefault: boolean
  blockedByHUD: boolean
}

export const STATIC_KEYBINDS: StaticKeybindDef[] = [
  {
    id: 'next',
    section: 'navigation',
    description: 'Skip current file',
    display: ['→'],
    keys: ['ArrowRight'],
    preventDefault: true,
    blockedByHUD: true
  },
  {
    id: 'prev',
    section: 'navigation',
    description: 'Previous file',
    display: ['←'],
    keys: ['ArrowLeft'],
    preventDefault: true,
    blockedByHUD: true
  },
  {
    id: 'toggle-hud',
    section: 'navigation',
    description: 'Toggle this HUD',
    display: ['?'],
    keys: ['?'],
    preventDefault: false,
    blockedByHUD: false
  },
  {
    id: 'delete',
    section: 'actions',
    description: 'Move to Trash',
    display: ['Del'],
    keys: ['Delete'],
    preventDefault: false,
    blockedByHUD: true
  },
  {
    id: 'undo',
    section: 'actions',
    description: 'Undo last action',
    display: ['Ctrl', 'Z'],
    keys: ['Ctrl+z'],
    preventDefault: false,
    blockedByHUD: true
  },
  {
    id: 'select-folder',
    section: 'actions',
    description: 'Select source folder',
    display: ['Ctrl', 'O'],
    keys: ['Ctrl+o'],
    preventDefault: false,
    blockedByHUD: false
  },
  {
    id: 'clear-keybinds',
    section: 'actions',
    description: 'Reset all keybinds',
    display: ['Ctrl', 'Shift', 'C'],
    keys: ['Ctrl+Shift+c'],
    preventDefault: false,
    blockedByHUD: false
  },
  {
    id: 'templates',
    section: 'actions',
    description: 'Manage templates',
    display: ['Ctrl', 'T'],
    keys: ['Ctrl+t'],
    preventDefault: false,
    blockedByHUD: false
  },
  {
    id: 'edit-keybind',
    section: 'actions',
    description: 'Edit a custom keybind',
    display: ['Ctrl', '<key>'],
    keys: [],
    preventDefault: false,
    blockedByHUD: false
  },
  {
    id: 'remove-keybind',
    section: 'actions',
    description: 'Remove a custom keybind',
    display: ['Ctrl', 'Shift', '<key>'],
    keys: [],
    preventDefault: false,
    blockedByHUD: false
  }
]

export const SECTION_LABELS: Record<KeybindSection, string> = {
  navigation: 'Navigation',
  actions: 'Actions'
}

export const SECTION_ORDER: KeybindSection[] = ['navigation', 'actions']
