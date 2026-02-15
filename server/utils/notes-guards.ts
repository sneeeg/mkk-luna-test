import type { CreateNoteDto, Note, Todo, UpdateNoteDto } from '~/shared/types/notes'
import { uid } from './storage'

function isObject(v: unknown): v is Record<string, unknown> {
    return typeof v === 'object' && v !== null
}

function cleanText(v: unknown, fallback = ''): string {
    const s = typeof v === 'string' ? v : fallback
    return s.trim()
}

function cleanBool(v: unknown): boolean {
    return v === true
}

export function normalizeCreateDto(input: unknown): CreateNoteDto {
    if (!isObject(input)) return { title: 'Без названия', todos: [] }

    const title = cleanText(input.title, 'Без названия') || 'Без названия'

    const todosRaw = Array.isArray(input.todos) ? input.todos : []

    const todos: CreateNoteDto['todos'] = todosRaw.flatMap((t) => {
        if (!isObject(t)) return []
        const text = cleanText(t.text)
        if (!text) return []
        const done = cleanBool(t.done)
        return [{ text, done }]
    })

    return { title, todos }
}

export function normalizeUpdateDto(input: unknown): UpdateNoteDto {
    if (!isObject(input)) return { title: 'Без названия', todos: [] }

    const title = cleanText(input.title, 'Без названия') || 'Без названия'
    const todosRaw = Array.isArray(input.todos) ? input.todos : []

    const todos: Todo[] = todosRaw
        .map((t) => {
            if (!isObject(t)) return null
            const id = cleanText(t.id)
            const text = cleanText(t.text)
            const done = cleanBool(t.done)
            if (!id || !text) return null
            return { id, text, done }
        })
        .filter((t): t is Todo => !!t)

    return { title, todos }
}

export function createNoteFromDto(dto: CreateNoteDto): Note {
    return {
        id: uid('n_'),
        title: dto.title,
        todos: dto.todos.map((t) => ({ id: uid('t_'), text: t.text, done: !!t.done })),
        updatedAt: Date.now(),
    }
}
