import type { CreateNoteDto, Note, UpdateNoteDto } from '~/shared/types/notes'

type ApiError = { statusCode?: number; statusMessage?: string; message?: string }

function getMessage(e: unknown) {
    const err = e as ApiError
    return err?.statusMessage || err?.message || 'Ошибка запроса'
}

export function useNotesApi() {
    const list = () => $fetch<Note[]>('/api/notes')

    const getOne = (id: string) => $fetch<Note>(`/api/notes/${id}`)

    const create = (body: CreateNoteDto) =>
        $fetch<Note>('/api/notes', { method: 'POST', body })

    const update = (id: string, body: UpdateNoteDto) =>
        $fetch<Note>(`/api/notes/${id}`, { method: 'PUT', body })

    const remove = (id: string) =>
        $fetch<{ ok: true }>(`/api/notes/${id}`, { method: 'DELETE' })

    return { list, getOne, create, update, remove, getMessage }
}
