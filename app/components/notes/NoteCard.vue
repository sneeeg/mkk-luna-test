<script setup lang="ts">
import type { Note } from '~/shared/types/notes'
import BaseButton from "~/components/ui/BaseButton.vue";

const props = defineProps<{ note: Note }>()
const emit = defineEmits<{ (e: 'edit'): void; (e: 'delete'): void }>()

const previewTodos = computed(() => props.note.todos.slice(0, 3))
const moreCount = computed(() => Math.max(0, props.note.todos.length - previewTodos.value.length))
</script>

<template>
  <article class="card">
    <div class="card__top">
      <h3 class="card__title">{{ note.title }}</h3>
      <div class="card__btns">
        <BaseButton variant="ghost" @click="emit('edit')">Изменить</BaseButton>
        <BaseButton variant="danger" @click="emit('delete')">Удалить</BaseButton>
      </div>
    </div>

    <ul class="card__list" v-if="note.todos.length">
      <li v-for="t in previewTodos" :key="t.id" class="card__todo">
        <span class="dot" :class="{ 'dot--done': t.done }" />
        <span class="txt" :class="{ 'txt--done': t.done }">{{ t.text }}</span>
      </li>
      <li v-if="moreCount" class="card__more">+ ещё {{ moreCount }}</li>
    </ul>

    <p v-else class="card__empty">Нет задач</p>
  </article>
</template>

<style scoped lang="scss">
@use "@/assets/scss/vars" as *;

.card {
  background: rgba(23,26,43,.75);
  border: 1px solid $border;
  border-radius: $radius;
  box-shadow: $shadow;
  padding: 14px;

  &__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
  }
  &__title {
    margin: 0;
    font-size: 16px;
    letter-spacing: .2px;
  }
  &__btns {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  &__list {
    margin: 12px 0 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 8px;
  }
  &__todo {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  &__more {
    color: $muted;
    font-size: 13px;
  }
  &__empty {
    margin: 12px 0 0;
    color: $muted;
  }
}

.dot {
  width: 10px; height: 10px; border-radius: 999px;
  border: 1px solid $border;
  background: transparent;
}
.dot--done {
  background: rgba(124,92,255,.85);
  border-color: rgba(124,92,255,.9);
}
.txt--done {
  text-decoration: line-through;
  color: $muted;
}
</style>
