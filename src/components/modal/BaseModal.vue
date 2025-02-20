<script setup lang="ts">
const props = defineProps({
  id: { type: String, required: true },
  title: String,
});
</script>

<template>
  <Teleport to="body">
    <dialog
      :id="id"
      class="bg-transparent w-[90%] md:w-[50%] overflow-auto m-auto"
    >
      <div
        class="w-full h-[90dvh] overflow-auto flex flex-col justify-center text-base font-Poppins"
      >
        <div class="bg-slate-50 p-3 flex flex-col gap-2 overflow-auto rounded">
          <slot />
        </div>
        <!-- </div> -->
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
::backdrop {
  background: black;
  opacity: 0.75;
}
dialog[open] {
  -webkit-animation: show 1s ease normal;
  animation: show 1s ease normal;
}

@keyframes show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
