<script setup lang="ts">
import { useFetch } from "@/composables/api";
import "iconify-icon";
import { onMounted, ref } from "vue";
import Load from "./Load.vue";
import { useRouter } from "vue-router";

const router = useRouter()
const { dataList, listFolderApi } = useFetch()
const isLoading = ref(false)

const getFolder = async () => {
    isLoading.value = true;
    await listFolderApi();
    isLoading.value = false;
}

onMounted(async () => {
    getFolder();
})
</script>

<template>
    <div class="  h-full flex flex-col p-4 rounded-lg  shadow bg-slate-100 overflow-auto">
        <div v-if="isLoading" class=" flex-grow  flex justify-center items-center">
            <Load />
        </div>
        <template v-if="dataList && dataList.list.length">
            <button type="button"
                class=" flex gap-1 items-center   p-1 rounded-lg hover:bg-ex-cyan cursor-pointer btn-list"
                @click="router.push(`/`)">
                <iconify-icon icon="mdi:home" class=" text-ex-grayblue"></iconify-icon> Home
            </button>
            <button type="button" v-for="f in dataList.list"
                class=" flex gap-1 items-center  hover:bg-ex-cyan  p-1 rounded-lg cursor-pointer btn-list "
                :title="f.foldersName" @click="router.push(`/${f.id}`)">
                <iconify-icon icon="mdi:folder" class=" text-orange-400"></iconify-icon>
                <span class="line-clamp-1 text-left">{{ f.foldersName }}</span>
            </button>
        </template>
    </div>
</template>

<style scoped>
.btn-list:hover {
    background: #76abae;
}
</style>