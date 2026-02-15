<script setup lang="ts">
const model = defineModel<string>({ required: true })
defineProps<{ placeholder?: string }>()
</script>

<template>
  <input v-model="model" class="input" :placeholder="placeholder" />
</template>

<style scoped lang="scss">
@use "@/assets/scss/vars" as *;

.input {
  width: 100%;
  padding: 11px 12px;
  border-radius: $radius;
  border: 1px solid $border;
  background: rgba(23,26,43,.65);
  color: $text;

  &:focus {
    @include focusRing;
  }
}
</style>
