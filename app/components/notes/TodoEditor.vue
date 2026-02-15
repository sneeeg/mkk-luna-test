<script setup lang="ts">
import type { Todo } from '~/shared/types/notes'
import BaseCheckbox from "~/components/ui/BaseCheckbox.vue";
import BaseButton from "~/components/ui/BaseButton.vue";

const props = defineProps<{
  modelValue: Todo[]
  onMutate?: () => void
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: Todo[]): void }>()

function update(next: Todo[]) {
  emit('update:modelValue', next)
}

function uid() {
  return 't_' + Math.random().toString(16).slice(2) + Date.now().toString(16)
}

function addTodo() {
  props.onMutate?.()
  update([{ id: uid(), text: 'Новая задача', done: false }, ...props.modelValue])
}

function removeTodo(id: string) {
  props.onMutate?.()
  update(props.modelValue.filter(t => t.id !== id))
}

function setText(id: string, text: string) {
  props.onMutate?.()
  update(props.modelValue.map(t => (t.id === id ? { ...t, text } : t)))
}

function toggleDone(id: string, done: boolean) {
  props.onMutate?.()
  update(props.modelValue.map(t => (t.id === id ? { ...t, done } : t)))
}
</script>

<template>
  <section class="todo">
    <div class="todo__head">
      <h4 class="todo__title">Задачи</h4>
      <BaseButton variant="primary" @click="addTodo">Добавить</BaseButton>
    </div>

    <ul class="todo__list" v-if="modelValue.length">
      <li v-for="t in modelValue" :key="t.id" class="todo__item">
        <BaseCheckbox :model-value="t.done" @update:model-value="v => toggleDone(t.id, v)" />
        <input
            class="todo__input"
            :value="t.text"
            @input="e => setText(t.id, (e.target as HTMLInputElement).value)"
            placeholder="Текст задачи"
        />
        <BaseButton variant="danger" @click="removeTodo(t.id)">Удалить</BaseButton>
      </li>
    </ul>

    <p v-else class="todo__empty">Добавьте первую задачу</p>
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/scss/vars" as *;

.todo {
  margin-top: 14px;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
  }
  &__title {
    margin: 0;
    font-size: 15px;
  }

  &__list {
    margin: 12px 0 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 10px;
  }
  &__item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 10px;
    align-items: center;
    padding: 10px;
    border: 1px solid $border;
    border-radius: $radius;
    background: rgba(23,26,43,.55);
  }

  &__input {
    width: 100%;
    padding: 10px 10px;
    border-radius: 12px;
    border: 1px solid $border;
    background: rgba(23,26,43,.65);
    color: $text;
    &:focus { @include focusRing; }
  }

  &__empty {
    margin: 12px 0 0;
    color: $muted;
  }
}

@media (max-width: 640px) {
  .todo__item {
    grid-template-columns: 1fr;
  }
}
</style>
