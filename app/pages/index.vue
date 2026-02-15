<script setup lang="ts">
import BaseButton from "~/components/ui/BaseButton.vue";
import NoteCard from "~/components/notes/NoteCard.vue";

const store = useNotesStore()
const router = useRouter()
const { $confirm } = useNuxtApp()

onMounted(() => store.fetchAll())

function goCreate() {
  router.push('/note/new')
}

function goEdit(id: string) {
  router.push(`/note/${id}`)
}

async function onDelete(id: string) {
  const ok = await $confirm({
    title: 'Удалить заметку?',
    text: 'Это действие нельзя отменить.',
    confirmText: 'Удалить',
    cancelText: 'Отмена',
    danger: true,
  })
  if (!ok) return
  await store.deleteNote(id)
}
</script>

<template>
  <div>
    <h1 class="h1">Заметки</h1>
    <p class="sub">Создавайте заметки и управляйте задачами внутри. Данные сохраняются после перезагрузки.</p>

    <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:14px;">
      <BaseButton variant="primary" @click="goCreate">Новая заметка</BaseButton>
      <BaseButton variant="ghost" :loading="store.loading" @click="store.fetchAll">Обновить</BaseButton>
    </div>

    <div v-if="store.error" style="color: rgba(255, 206, 109, .95); margin-bottom: 12px;">
      {{ store.error }}
    </div>

    <div v-if="!store.loading && store.notes.length === 0" style="color:rgba(233,236,255,.7);">
      Пока нет заметок. Создайте первую.
    </div>

    <div class="grid" v-else>
      <NoteCard
          v-for="n in store.notes"
          :key="n.id"
          :note="n"
          @edit="goEdit(n.id)"
          @delete="onDelete(n.id)"
      />
    </div>
  </div>
</template>
