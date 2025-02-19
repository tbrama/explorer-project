<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import FolderStructure from "./components/FolderStructure.vue";
import Text from "./components/input/Text.vue";
import { useFetch } from '@/composables/api';
import { useDebounceFn } from '@vueuse/core'
import { ref } from "vue";
import { useFolderStore } from "./stores/folder";

const { dataSearch, listSearchApi } = useFetch();

const folderStore = useFolderStore()
const isLoading = ref(false)

const getCari = async () => {
  isLoading.value = true;
  await listSearchApi({ cari: folderStore.$state.search });
  if (dataSearch.value) folderStore.$state.listSearch = dataSearch.value.list
  isLoading.value = false;
}

const searchDebouncedFn = useDebounceFn(() => {
  if (folderStore.$state.search)
    getCari()
  else folderStore.$state.listSearch = Array()
}, 1000, { maxWait: 5000 })
</script>

<template>
  <div class="flex flex-col font-jakarta p-2 h-[100dvh] overflow-auto bg-ex-gray">
    <div class="flex gap-2 items-center">
      <!-- <img src="@/assets/logo.png" alt="" height="60" width="60" /> -->
      <p class="text-xl font-bold">Windows Explorer</p>
    </div>
    <div class=" bg-slate-50 p-2 rounded-lg my-2 flex justify-between items-center">
      <button type="button"
        class=" flex items-center gap-1 py-1 px-2 rounded-lg border border-ex-grayblue text-ex-grayblue font-semibold cursor-pointer">
        <iconify-icon icon="mdi:plus-thick" class=" text-ex-grayblue"></iconify-icon>Folder</button>
      <Text id="crFldr" placeholder="Cari folder/file..." v-model="folderStore.$state.search"
        @update:model-value="searchDebouncedFn" />
    </div>
    <div class="hidden md:grid grid-cols-6 gap-4 overflow-auto flex-grow">
      <div class=" flex flex-col overflow-auto col-span-1">
        <FolderStructure />
      </div>
      <div class=" flex flex-col overflow-auto col-span-5">
        <RouterView />
      </div>
    </div>
    <div class="md:hidden flex flex-col overflow-auto">
      <RouterView />
    </div>

  </div>
</template>

<style>
iconify-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
}
</style>
