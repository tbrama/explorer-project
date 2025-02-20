<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import FolderStructure from "./components/FolderStructure.vue";
import Text from "./components/input/Text.vue";
import { useFetch } from "@/composables/api";
import { useDebounceFn } from "@vueuse/core";
import { ref } from "vue";
import { useFolderStore } from "./stores/folder";
import BaseModal from "@/components/modal/BaseModal.vue";

const { dataSearch, listSearchApi, resAddFolder, addFolderApi } = useFetch();

const folderStore = useFolderStore();
const isLoading = ref(false);

const getCari = async () => {
  isLoading.value = true;
  await listSearchApi({ cari: folderStore.$state.search });
  if (dataSearch.value) folderStore.$state.listSearch = dataSearch.value.list;
  isLoading.value = false;
};

const searchDebouncedFn = useDebounceFn(
  () => {
    if (folderStore.$state.search) getCari();
    else folderStore.$state.listSearch = Array();
  },
  1000,
  { maxWait: 5000 }
);

const dataAddFolder = ref({
  parentDir: folderStore.$state.parent,
  foldersName: "",
});
const showAddFolder = () => {
  const modEl: HTMLDialogElement | null =
    document.querySelector("#elAddFolder");
  if (modEl) modEl.showModal();
};

const closeAddFolder = () => {
  const modEl: HTMLDialogElement | null =
    document.querySelector("#elAddFolder");
  if (modEl) modEl.close();
};

const saveFolder = async () => {
  isLoading.value = true;
  const modEl: HTMLDialogElement | null =
    document.querySelector("#elAddFolder");
  if (modEl) modEl.close();
  dataAddFolder.value.parentDir = folderStore.$state.parent;
  await addFolderApi(dataAddFolder.value);
  if (resAddFolder.value) {
    folderStore.$state.listView = resAddFolder.value.list;
  }
  isLoading.value = false;
};
</script>

<template>
  <div
    class="flex flex-col font-jakarta p-2 h-[100dvh] overflow-auto bg-ex-gray"
  >
    <div class="flex gap-2 items-center">
      <!-- <img src="@/assets/logo.png" alt="" height="60" width="60" /> -->
      <p class="text-xl font-bold">Windows Explorer</p>
    </div>
    <div
      class="bg-slate-50 p-2 rounded-lg my-2 flex justify-between items-center"
    >
      <button
        type="button"
        class="flex items-center gap-1 py-1 px-2 rounded-lg border border-ex-grayblue text-ex-grayblue font-semibold cursor-pointer"
        @click="showAddFolder()"
      >
        <iconify-icon
          icon="mdi:plus-thick"
          class="text-ex-grayblue"
        ></iconify-icon
        >Folder
      </button>
      <Text
        id="crFldr"
        placeholder="Cari folder/file..."
        v-model="folderStore.$state.search"
        @update:model-value="searchDebouncedFn"
      />
    </div>
    <div class="grid grid-cols-6 gap-4 overflow-auto flex-grow">
      <div class="md:flex hidden flex-col overflow-auto col-span-1">
        <FolderStructure />
      </div>
      <div class="flex flex-col overflow-auto col-span-6 md:col-span-5">
        <RouterView />
      </div>
    </div>
    <BaseModal id="elAddFolder">
      <div class="flex justify-between items-center">
        <p class="font-semibold">Tambah Folder</p>
        <button
          @click="closeAddFolder"
          type="button"
          class="rounded-full bg-red-600 flex items-center justify-center cursor-pointer"
        >
          <iconify-icon icon="mdi:close" class="text-slate-50"></iconify-icon>
        </button>
      </div>
      <form @submit.prevent="saveFolder" class="flex flex-col gap-4">
        <Text label="Nama Folder" v-model="dataAddFolder.foldersName" />
        <div class="flex justify-end">
          <button
            type="submit"
            @click="saveFolder"
            class="cursor-pointer border border-ex-cyan text-ex-cyan font-semibold rounded-lg px-2 py-1"
          >
            Simpan
          </button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<style>
iconify-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
}
</style>
