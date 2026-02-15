import { readNotes } from '../../utils/storage'

export default defineEventHandler(async () => {
    const notes = await readNotes()
    notes.sort((a, b) => b.updatedAt - a.updatedAt)
    return notes
})
