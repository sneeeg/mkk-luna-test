<script setup lang="ts">
import type { Note } from '~/shared/types/notes'
import BaseButton from "~/components/ui/BaseButton.vue";
import BaseInput from "~/components/ui/BaseInput.vue";
import TodoEditor from "~/components/notes/TodoEditor.vue";

const store = useNotesStore()
const route = useRoute()
const router = useRouter()
const api = useNotesApi()
const { $confirm } = useNuxtApp()

const id = computed(() => String(route.params.id))
const isNew = computed(() => id.value === 'new')

const saving = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const notFound = ref(false)

type Draft = Pick<Note, 'title' | 'todos'>
const draft = ref<Draft>({ title: '', todos: [] })

const history = useHistory<Draft>({
  get: () => draft.value,
  set: (v) => { draft.value = v },
})

const initialSnapshot = ref('')

const dirty = computed(() => history.snapshot() !== initialSnapshot.value)

function normalizeDraftForSave(d: Draft): Draft {
  const title = d.title.trim() || 'Без названия'
  const todos = d.todos
      .map(t => ({ ...t, text: t.text.trim() }))
      .filter(t => t.id && t.text)
  return { title, todos }
}

function onMutate() {
  history.push()
}

async function load() {
  error.value = null
  notFound.value = false
  history.clear()
  loading.value = true
  try {
    if (isNew.value) {
      draft.value = { title: '', todos: [] }
    } else {
      const note = await store.fetchOne(id.value)
      draft.value = { title: note.title, todos: note.todos }
    }
    initialSnapshot.value = history.snapshot()
  } catch (e) {
    const msg = api.getMessage(e)
    error.value = msg
    const anyErr = e as any
    if (anyErr?.statusCode === 404) notFound.value = true
  } finally {
    loading.value = false
  }
}

const onKey = (e: KeyboardEvent) => {
  const isMac = navigator.platform.toLowerCase().includes('mac')
  const mod = isMac ? e.metaKey : e.ctrlKey
  if (!mod) return

  if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
    e.preventDefault()
    history.undo()
  }
  if (e.key.toLowerCase() === 'z' && e.shiftKey) {
    e.preventDefault()
    history.redo()
  }
}

onMounted(async () => {
  await load()
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
})

async function save() {
  saving.value = true
  error.value = null
  try {
    const normalized = normalizeDraftForSave(draft.value)

    if (isNew.value) {
      const created = await store.createNote({
        title: normalized.title,
        todos: normalized.todos.map(t => ({ text: t.text, done: t.done })),
      })
      router.replace(`/note/${created.id}`)
      return
    }

    await store.updateNote(id.value, normalized)
    initialSnapshot.value = history.snapshot()
    history.clear()
  } catch (e) {
    error.value = api.getMessage(e)
  } finally {
    saving.value = false
  }
}

async function cancelEdit() {
  if (!dirty.value) return router.push('/')

  const ok = await $confirm({
    title: 'Отменить редактирование?',
    text: 'Несохранённые изменения будут потеряны.',
    confirmText: 'Да, отменить',
    cancelText: 'Продолжить',
    danger: true,
  })
  if (ok) router.push('/')
}

async function deleteOrClose() {
  if (isNew.value) {
    if (!dirty.value) return router.push('/')
    const ok = await $confirm({
      title: 'Закрыть без сохранения?',
      text: 'Данные не будут сохранены.',
      confirmText: 'Закрыть',
      cancelText: 'Отмена',
      danger: true,
    })
    if (ok) router.push('/')
    return
  }

  const ok = await $confirm({
    title: 'Удалить заметку?',
    text: 'Это действие нельзя отменить.',
    confirmText: 'Удалить',
    cancelText: 'Отмена',
    danger: true,
  })
  if (!ok) return
  await store.deleteNote(id.value)
  router.push('/')
}
</script>

<template>
  <div>
    <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap;">
      <div>
        <h1 class="h1">{{ isNew ? 'Новая заметка' : 'Редактирование' }}</h1>
        <p class="sub">Undo: Ctrl+Z • Redo: Ctrl+Shift+Z</p>
      </div>

      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <BaseButton
            variant="ghost"
            @click="dirty ? cancelEdit() : router.push('/')"
        >
          ← На главную
        </BaseButton>
        <BaseButton variant="ghost" :disabled="!history.canUndo()" @click="history.undo">
          Отменить
        </BaseButton>
        <BaseButton variant="ghost" :disabled="!history.canRedo()" @click="history.redo">
          Повторить
        </BaseButton>
        <BaseButton variant="danger" @click="deleteOrClose">
          {{ isNew ? 'Закрыть' : 'Удалить' }}
        </BaseButton>
      </div>
    </div>

    <div v-if="loading" style="color:rgba(233,236,255,.7);">Загрузка…</div>

    <div v-else>
      <div v-if="error" style="color: rgba(255, 206, 109, .95); margin-bottom: 12px;">
        {{ error }}
      </div>

      <div v-if="notFound" style="color:rgba(233,236,255,.7);">
        Заметка не найдена. <NuxtLink to="/" style="text-decoration: underline;">На главную</NuxtLink>
      </div>

      <div v-else class="panel">
        <label class="lbl">Название</label>

        <BaseInput
            v-model="draft.title"
            placeholder="Например: Покупки"
            @update:modelValue="onMutate"
        />

        <TodoEditor v-model="draft.todos" :on-mutate="onMutate" />

        <div class="actions">
          <BaseButton variant="ghost" @click="cancelEdit">Отмена</BaseButton>
          <BaseButton variant="primary" :loading="saving" :disabled="!dirty" @click="save">
            Сохранить
          </BaseButton>
        </div>

        <div v-if="dirty" class="hint">Есть несохранённые изменения</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/vars" as *;

.panel {
  margin-top: 12px;
  background: rgba(23,26,43,.75);
  border: 1px solid $border;
  border-radius: $radius;
  box-shadow: $shadow;
  padding: 14px;
}

.lbl {
  display: block;
  font-size: 13px;
  color: $muted;
  margin: 0 0 8px;
}

.actions {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.hint {
  margin-top: 10px;
  color: rgba(255, 206, 109, .95);
  font-size: 13px;
}
</style>
