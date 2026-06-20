export function expandRenameTemplate(template: string, ctimeMs: number): string {
  const d = new Date(ctimeMs)
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  return template.replace(/\{date\}/g, date)
}
