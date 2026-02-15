import { readNotes } from '../../utils/storage'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')!
    const notes = await readNotes()
    const note = notes.find(n => n.id === id)
    if (!note) throw createError({ statusCode: 404, statusMessage: 'Note not found' })
    return note
})
