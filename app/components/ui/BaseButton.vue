<script setup lang="ts">
const props = defineProps<{
  variant?: 'primary' | 'ghost' | 'danger'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit'
}>()
</script>

<template>
  <button
      :type="props.type ?? 'button'"
      class="btn"
      :class="[`btn--${props.variant ?? 'primary'}`, { 'is-loading': props.loading }]"
      :disabled="props.disabled || props.loading"
  >
    <span class="btn__spinner" v-if="props.loading" aria-hidden="true" />
    <span class="btn__content"><slot /></span>
  </button>
</template>

<style scoped lang="scss">
@use "@/assets/scss/vars" as *;

.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: $radius;
  border: 1px solid $border;
  cursor: pointer;
  user-select: none;
  transition: transform .05s ease, background .15s ease, border-color .15s ease, opacity .15s ease;
  color: $text;

  &:active {
    transform: translateY(1px);
  }
  &:disabled {
    opacity: .55;
    cursor: not-allowed;
  }

  &__spinner {
    width: 14px; height: 14px;
    border-radius: 999px;
    border: 2px solid rgba(233,236,255,.25);
    border-top-color: rgba(233,236,255,.9);
    animation: spin .8s linear infinite;
  }
}

.btn--primary {
  background: rgba(124,92,255,.18);
  border-color: rgba(124,92,255,.35);
}

.btn--ghost {
  background: transparent;
}

.btn--danger {
  background: rgba(255,77,109,.14);
  border-color: rgba(255,77,109,.35);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
