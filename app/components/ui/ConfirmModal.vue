<script setup lang="ts">
import BaseButton from "~/components/ui/BaseButton.vue";

defineProps<{
  open: boolean
  title: string
  text?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}>()

const emit = defineEmits<{ (e: 'confirm'): void; (e: 'close'): void }>()
const attrs = useAttrs()
</script>

<template>
  <Teleport to="body">
    <div
        v-if="open"
        class="m"
        role="dialog"
        aria-modal="true"
        v-bind="attrs"
        @keydown.esc="emit('close')"
    >
      <div class="m__backdrop" @click="emit('close')" />
      <div class="m__card">
        <div class="m__head">
          <div class="m__title">{{ title }}</div>
          <button class="m__x" @click="emit('close')" aria-label="Close">✕</button>
        </div>

        <div class="m__body" v-if="text">{{ text }}</div>

        <div class="m__actions">
          <BaseButton variant="ghost" @click="emit('close')">{{ cancelText ?? 'Отмена' }}</BaseButton>
          <BaseButton :variant="danger ? 'danger' : 'primary'" @click="emit('confirm')">
            {{ confirmText ?? 'Подтвердить' }}
          </BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
@use "@/assets/scss/vars" as *;

.m {
  position: fixed; inset: 0;
  display: grid; place-items: center;
  z-index: 50;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,.55);
  }
  &__card {
    position: relative;
    width: min(520px, calc(100% - 28px));
    background: $card;
    border: 1px solid $border;
    border-radius: $radius;
    box-shadow: $shadow;
    padding: 14px;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  &__title {
    font-size: 16px;
    font-weight: 700;
  }
  &__x {
    border: 1px solid $border;
    background: transparent;
    color: $text;
    border-radius: 10px;
    padding: 6px 10px;
    cursor: pointer;
  }
  &__body {
    margin-top: 10px;
    color: $muted;
    line-height: 1.4;
  }
  &__actions {
    margin-top: 14px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-wrap: wrap;
  }
}
</style>
