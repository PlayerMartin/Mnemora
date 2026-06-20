export type KeybindSection = 'navigation' | 'actions'

export type StaticKeybindDef = {
  id: string
  section: KeybindSection
  order: number
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
    order: 0,
    description: 'Skip current file',
    display: ['→'],
    keys: ['ArrowRight'],
    preventDefault: true,
    blockedByHUD: true
  },
  {
    id: 'prev',
    section: 'navigation',
    order: 1,
    description: 'Previous file',
    display: ['←'],
    keys: ['ArrowLeft'],
    preventDefault: true,
    blockedByHUD: true
  },
  {
    id: 'toggle-hud',
    section: 'navigation',
    order: 2,
    description: 'Toggle this HUD',
    display: ['?'],
    keys: ['?'],
    preventDefault: false,
    blockedByHUD: false
  },
  {
    id: 'delete',
    section: 'actions',
    order: 1,
    description: 'Move to Trash',
    display: ['Del'],
    keys: ['Delete'],
    preventDefault: false,
    blockedByHUD: true
  },
  {
    id: 'undo',
    section: 'actions',
    order: 2,
    description: 'Undo last action',
    display: ['Ctrl', 'Z'],
    keys: ['Ctrl+z'],
    preventDefault: false,
    blockedByHUD: true
  },
  {
    id: 'select-folder',
    section: 'actions',
    order: 3,
    description: 'Select source folder',
    display: ['Ctrl', 'O'],
    keys: ['Ctrl+o'],
    preventDefault: false,
    blockedByHUD: false
  },
  {
    id: 'clear-keybinds',
    section: 'actions',
    order: 6,
    description: 'Reset all keybinds',
    display: ['Ctrl', 'Shift', 'C'],
    keys: ['Ctrl+Shift+c'],
    preventDefault: false,
    blockedByHUD: false
  },
  {
    id: 'rename',
    section: 'actions',
    order: 0,
    description: 'Rename current file',
    display: ['F2'],
    keys: ['F2'],
    preventDefault: false,
    blockedByHUD: true
  },
  {
    id: 'templates',
    section: 'actions',
    order: 4,
    description: 'Manage templates',
    display: ['Ctrl', 'T'],
    keys: ['Ctrl+t'],
    preventDefault: false,
    blockedByHUD: false
  },
  {
    id: 'edit-keybind',
    section: 'actions',
    order: 5,
    description: 'Edit a custom keybind',
    display: ['Ctrl', '<key>'],
    keys: [],
    preventDefault: false,
    blockedByHUD: false
  },
  {
    id: 'remove-keybind',
    section: 'actions',
    order: 7,
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
