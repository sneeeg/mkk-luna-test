import { defineStore } from 'pinia'
import type { CreateNoteDto, Note, UpdateNoteDto } from '~/shared/types/notes'

export const useNotesStore = defineStore('notes', () => {
    const api = useNotesApi()

    const notes = ref<Note[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchAll() {
        loading.value = true
        error.value = null
        try {
            notes.value = await api.list()
        } catch (e) {
            error.value = api.getMessage(e)
        } finally {
            loading.value = false
        }
    }

    async function fetchOne(id: string) {
        return await api.getOne(id)
    }

    async function createNote(dto: CreateNoteDto) {
        const created = await api.create(dto)
        notes.value = [created, ...notes.value]
        return created
    }

    async function updateNote(id: string, dto: UpdateNoteDto) {
        const updated = await api.update(id, dto)
        const idx = notes.value.findIndex(n => n.id === id)
        if (idx !== -1) notes.value[idx] = updated
        else notes.value.unshift(updated)
        notes.value.sort((a, b) => b.updatedAt - a.updatedAt)
        return updated
    }

    async function deleteNote(id: string) {
        await api.remove(id)
        notes.value = notes.value.filter(n => n.id !== id)
    }

    return { notes, loading, error, fetchAll, fetchOne, createNote, updateNote, deleteNote }
})
