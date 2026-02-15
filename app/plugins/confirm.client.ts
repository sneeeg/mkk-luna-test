export default defineNuxtPlugin(() => {
    const state = useConfirm()

    function confirm(opts: {
        title: string
        text?: string
        confirmText?: string
        cancelText?: string
        danger?: boolean
    }) {
        return new Promise<boolean>((resolve) => {
            state.value = {
                open: true,
                title: opts.title,
                text: opts.text ?? '',
                confirmText: opts.confirmText ?? 'Подтвердить',
                cancelText: opts.cancelText ?? 'Отмена',
                danger: !!opts.danger,
                resolve,
            }
        })
    }

    return {
        provide: { confirm },
    }
})

declare module '#app' {
    interface NuxtApp {
        $confirm: (opts: {
            title: string
            text?: string
            confirmText?: string
            cancelText?: string
            danger?: boolean
        }) => Promise<boolean>
    }
}
