type ConfirmOptions = {
    title: string
    text?: string
    confirmText?: string
    cancelText?: string
    danger?: boolean
}

type ConfirmState = ConfirmOptions & {
    open: boolean
    resolve?: (v: boolean) => void
}

export function useConfirm() {
    return useState<ConfirmState>('confirm', () => ({
        open: false,
        title: '',
        text: '',
        confirmText: 'Подтвердить',
        cancelText: 'Отмена',
        danger: false,
    }))
}
