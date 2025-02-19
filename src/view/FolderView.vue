<script setup lang="ts">
import { useFetch } from '@/composables/api';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDebounceFn } from '@vueuse/core'
import { useFolderStore } from '@/stores/folder';
import type { Vfolder } from '@/utils/interface/View';

const folderStore = useFolderStore()
const isLoading = ref(false)
const { dataListView, listViewApi, } = useFetch();
const route = useRoute();

const listExt = ref(Array("pdf,doc,xlsx,jpg,jpeg,png"))

const getFolder = async (n: number) => {
    isLoading.value = true;
    folderStore.$state.search = "";
    folderStore.$state.listSearch = Array();
    await listViewApi(n);
    isLoading.value = false;
}

const listFolder = computed(() => {
    if (folderStore.$state.listSearch.length) return folderStore.$state.listSearch
    else {
        if (dataListView.value)
            return dataListView.value.list
    }
    return Array<Vfolder>()
})

watch(
    () => route.params.index,
    (newId, oldId) => {
        if (newId)
            getFolder(+newId);
        else getFolder(0);
    }
)

const goTo = (path: string, id: number) => {
    if (!listExt.value.includes("")) {
        getFolder(id);
    }
}

onMounted(async () => {
    getFolder(0);
})
</script>

<template>
    <div class="  h-full flex flex-col p-4 rounded-lg  shadow bg-slate-100 overflow-auto">
        <div>
            <button type="button" class=" cursor-pointer" @click="useRouter().back()"><iconify-icon
                    icon="mdi:arrow-left-thick" class=" text-ex-grayblue text-3xl"></iconify-icon></button>
        </div>
        <template v-if="listFolder.length">
            <div
                class="flex-grow grid  grid-cols-3 md:grid-cols-5 lg:grid-cols-7  grid-flow-row-dense auto-cols-max auto-rows-max gap-4 overflow-auto">
                <div v-for="f in listFolder" :title="f.folders_name"
                    class=" text-center hover:bg-ex-cyan  btn-list rounded-lg cursor-pointer"
                    @click="goTo(f.folders_name, f.id)">
                    <iconify-icon icon="mdi:folder" class=" text-orange-400 text-[100px]"></iconify-icon>
                    <p class="  line-clamp-1">{{ f.folders_name }}</p>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.btn-list:hover {
    background: #76abae;
}
</style>