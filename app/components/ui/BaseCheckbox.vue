<script setup lang="ts">
const model = defineModel<boolean>({ required: true })
defineProps<{ disabled?: boolean }>()
</script>

<template>
  <label class="cb">
    <input type="checkbox" v-model="model" :disabled="disabled" />
    <span class="cb__box" aria-hidden="true"></span>
    <span class="cb__slot"><slot /></span>
  </label>
</template>

<style scoped lang="scss">
@use "@/assets/scss/vars" as *;

.cb {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  user-select: none;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &__box {
    position: relative;
    margin-top: 2px;
    width: 18px;
    height: 18px;
    border-radius: 6px;
    border: 1px solid $border;
    background: rgba(23,26,43,.65);
    display: inline-block;
    transition: background .15s ease, border-color .15s ease;

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 5px;
      height: 9px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: translate(-50%, -60%) rotate(45deg) scale(0);
      transition: transform .12s ease;
    }
  }

  input:checked + &__box {
    background: rgba(124,92,255,.9);
    border-color: rgba(124,92,255,.95);
  }

  input:checked + &__box::after {
    transform: translate(-50%, -60%) rotate(45deg) scale(1);
  }

  input:focus-visible + &__box {
    @include focusRing;
  }

  input:disabled + &__box {
    opacity: .5;
  }
}

</style>
