import { readNotes } from '../../utils/storage'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')!
    const notes = await readNotes()
    const filtered = notes.filter(n => n.id !== id)
    await writeNotes(filtered)
    return { ok: true }
})
