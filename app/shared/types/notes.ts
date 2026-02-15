export type Todo = {
    id: string
    text: string
    done: boolean
}

export type Note = {
    id: string
    title: string
    todos: Todo[]
    updatedAt: number
}

export type CreateNoteDto = {
    title: string
    todos: Array<{ text: string; done?: boolean }>
}

export type UpdateNoteDto = {
    title: string
    todos: Todo[]
}
