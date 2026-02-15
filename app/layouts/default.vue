<script setup lang="ts">
import ConfirmModal from "~/components/ui/ConfirmModal.vue";

const state = useConfirm()

function closeWith(v: boolean) {
  const resolve = state.value.resolve
  state.value.open = false
  state.value.resolve = undefined
  resolve?.(v)
}
</script>

<template>
  <div class="container">
    <header style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
      <NuxtLink to="/" style="font-weight:800; letter-spacing:.2px;">Notes</NuxtLink>
      <div style="color:rgba(233,236,255,.7); font-size:13px;">Nuxt 4 • SPA</div>
    </header>

    <main style="margin-top:16px;">
      <slot />
    </main>

    <ConfirmModal
        :open="state.open"
        :title="state.title"
        :text="state.text"
        :confirm-text="state.confirmText"
        :cancel-text="state.cancelText"
        :danger="state.danger"
        @close="closeWith(false)"
        @confirm="closeWith(true)"
    />
  </div>
</template>
