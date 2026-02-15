export function useHistory<T>(options: {
    get: () => T
    set: (v: T) => void
    serialize?: (v: T) => string
    deserialize?: (s: string) => T
}) {
    const serialize = options.serialize ?? ((v: T) => JSON.stringify(v))
    const deserialize = options.deserialize ?? ((s: string) => JSON.parse(s) as T)

    const past = ref<string[]>([])
    const future = ref<string[]>([])

    const snapshot = () => serialize(options.get())

    function clear() {
        past.value = []
        future.value = []
    }

    function push() {
        past.value.push(snapshot())
        future.value = []
    }

    function canUndo() {
        return past.value.length > 0
    }

    function canRedo() {
        return future.value.length > 0
    }

    function undo() {
        if (!canUndo()) return
        const current = snapshot()
        const prev = past.value.pop()!
        future.value.push(current)
        options.set(deserialize(prev))
    }

    function redo() {
        if (!canRedo()) return
        const current = snapshot()
        const next = future.value.pop()!
        past.value.push(current)
        options.set(deserialize(next))
    }

    return { past, future, clear, push, canUndo, canRedo, undo, redo, snapshot }
}
