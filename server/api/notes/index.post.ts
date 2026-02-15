import { readNotes, writeNotes } from '../../utils/storage'
import { createNoteFromDto, normalizeCreateDto } from '../../utils/notes-guards'


export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const dto = normalizeCreateDto(body)

    const notes = await readNotes()
    const created = createNoteFromDto(dto)

    notes.unshift(created)
    await writeNotes(notes)

    return created
})
