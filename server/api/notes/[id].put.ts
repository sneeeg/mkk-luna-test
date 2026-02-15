import type { Note } from '~/shared/types/notes'
import { readNotes, writeNotes } from '../../utils/storage'
import { normalizeUpdateDto } from '../../utils/notes-guards'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const notes = await readNotes()

    const idx = notes.findIndex(n => n.id === id)
    if (idx < 0) {
        throw createError({ statusCode: 404, statusMessage: 'Note not found' })
    }

    const existing = notes[idx]!

    const dto = normalizeUpdateDto(body)

    const updated: Note = {
        id: existing.id,
        title: dto.title,
        todos: dto.todos,
        updatedAt: Date.now(),
    }

    notes[idx] = updated
    await writeNotes(notes)

    return updated
})
