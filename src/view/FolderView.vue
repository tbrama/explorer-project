<script setup lang="ts">
import { useFetch } from "@/composables/api";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { onClickOutside, useDebounceFn } from "@vueuse/core";
import { useFolderStore } from "@/stores/folder";
import type { Vfolder } from "@/utils/interface/View";
import Load from "@/components/Load.vue";

const folderStore = useFolderStore();
const isLoading = ref(false);
const {
  dataListView,
  listViewApi,
  dataUpFile,
  upFileApi,
  resDelete,
  deleteApi,
} = useFetch();
const route = useRoute();
const router = useRouter();

const listExt = ref(
  Array(".pdf", ".doc", ".docx", ".txt", ".xlsx", ".jpg", ".jpeg", ".png")
);

const getFolder = async (n: number) => {
  isLoading.value = true;
  folderStore.$state.parent = n;
  folderStore.$state.search = "";
  folderStore.$state.listSearch = Array();
  await listViewApi(n);
  if (dataListView.value) {
    folderStore.$state.path = dataListView.value.path;
    folderStore.$state.listView = dataListView.value.list;
  }
  isLoading.value = false;
};

const listFolder = computed(() => {
  if (folderStore.$state.listSearch.length)
    return folderStore.$state.listSearch;
  else {
    return folderStore.$state.listView;
  }
});

watch(
  () => route.params.index,
  (newId, oldId) => {
    if (newId) {
      getFolder(+newId);
    } else {
      getFolder(0);
    }
  },
  { immediate: true }
);

const goBack = () => {
  folderStore.$state.search = "";
  folderStore.$state.listSearch = Array();
  router.back();
};

const goTo = (obj: Vfolder) => {
  if (obj.isFile) {
    return;
  }
  router.push(`/${obj.id}`);
  // getFolder(obj.id);
};

const dropHandler = async (ev: any) => {
  if (folderStore.$state.search) {
    alert("Tidak bisa upload, mohon hapus seacrh");
    return;
  }
  const paramId = route.params.index ? +route.params.index : 0;
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...ev.dataTransfer.items].forEach(async (item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        const file = item.getAsFile();
        const ext = file.name.substring(
          file.name.lastIndexOf("."),
          file.name.length
        );
        if (listExt.value.includes(ext)) {
          isLoading.value = true;
          const form = new FormData();
          form.append("file", file);
          //@ts-ignore
          form.append("parentDir", paramId);
          await upFileApi(form);
          if (dataUpFile.value) {
            if (dataUpFile.value.msg) alert(dataUpFile.value.msg);
            else if (dataListView.value)
              dataListView.value.list = dataUpFile.value.list;
          }
          isLoading.value = false;
        } else
          alert(
            `${
              file.name
            } tidak dapat di upload, hanya dapat upload dengan extensi ${listExt.value.join(
              ", "
            )}`
          );
        // console.log(`… file[${i}].name = ${file.name}`);
      }
    });
  }
};

const dragOverHandler = (ev: any) => {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
};

const iconFile = computed(() => {
  return (obj: Vfolder) => {
    if (!obj.isFile) {
      return { name: "mdi:folder", color: "text-orange-400" };
    }
    const nm = obj.folders_name;
    const ext = nm.substring(nm.lastIndexOf("."), nm.length);
    if (ext == ".pdf")
      return { name: "mdi:file-pdf-box", color: "text-red-500" };
    if (ext == ".xlsx")
      return { name: "mdi:file-excel-box", color: "text-green-600" };
    if (Array(".png", ".jpg", ".jpeg", ".svg").includes(ext))
      return { name: "mdi:file-image-box", color: "text-sky-500" };
    if (Array(".doc", ".docx", ".jpeg", ".svg").includes(ext))
      return { name: "mdi:file-word-box", color: "text-blue-500" };
    return { name: "mdi:document", color: "text-gray-400" };
  };
});

const objDelete = ref<{
  id: null | number;
  path: string;
  parentDir: null | number;
}>({
  id: null,
  path: "",
  parentDir: null,
});

const elContext = ref<HTMLDivElement | null>(null);

onClickOutside(elContext, () => {
  if (elContext.value) {
    elContext.value.classList.remove("flex");
    elContext.value.classList.add("hidden");
    objDelete.value = { id: null, path: "", parentDir: null };
  }
});

const showContexMenu = (obj: Vfolder, ev: any) => {
  if (folderStore.$state.search) {
    return;
  }
  objDelete.value = { id: null, path: "", parentDir: null };
  if (elContext.value) {
    const paramId = route.params.index ? +route.params.index : 0;
    elContext.value.classList.remove("hidden");
    elContext.value.classList.add("flex");
    elContext.value.style.left = `${ev.x + 10}px`;
    elContext.value.style.top = `${ev.y + 10}px`;
    objDelete.value = { id: obj.id, path: obj.path, parentDir: paramId };
  }
};

const deleteFile = async () => {
  if (elContext.value) {
    elContext.value.classList.remove("flex");
    elContext.value.classList.add("hidden");
  }
  isLoading.value = true;
  await deleteApi(
    objDelete.value as {
      path: string;
      id: number;
      parentDir: number;
    }
  );
  if (resDelete.value && dataListView.value) {
    dataListView.value.list = resDelete.value.list;
  }
  objDelete.value = { id: null, path: "", parentDir: null };
  isLoading.value = false;
};

onMounted(async () => {
  getFolder(0);
});
</script>

<template>
  <div
    class="h-full flex flex-col p-4 rounded-lg shadow bg-slate-100 overflow-auto relative"
  >
    <div v-if="isLoading" class="flex-grow flex justify-center items-center">
      <Load />
    </div>
    <template v-else>
      <div class="flex gap-2 items-center">
        <button type="button" class="cursor-pointer z-50" @click="goBack">
          <iconify-icon
            icon="mdi:arrow-left-thick"
            class="text-ex-grayblue text-3xl"
          ></iconify-icon>
        </button>
        <p>{{ folderStore.$state.path }}</p>
      </div>
      <template v-if="listFolder.length">
        <div
          class="relative flex-grow grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 grid-flow-row-dense auto-cols-max auto-rows-max gap-4 overflow-auto"
        >
          <div
            v-for="f in listFolder"
            :title="f.folders_name"
            class="text-center hover:bg-ex-cyan btn-list rounded-lg cursor-pointer z-50"
            @click="goTo(f)"
            @contextmenu.prevent="showContexMenu(f, $event)"
          >
            <iconify-icon
              :icon="iconFile(f).name"
              class="text-[100px]"
              :class="iconFile(f).color"
            ></iconify-icon>
            <p class="line-clamp-1">{{ f.folders_name }}</p>
          </div>
        </div>
        <div
          id="drop_zone"
          @drop="dropHandler($event)"
          @dragover="dragOverHandler($event)"
          class="absolute top-0 bottom-0 left-0 right-0 border border-ex-cyan rounded-lg z-40"
        ></div>
      </template>
      <div
        v-else
        class="relative flex-grow flex justify-center items-center overflow-auto"
      >
        <p class="text-ex-grayblue font-semibold">Opps masih kosong</p>
        <div
          id="drop_zone"
          @drop="dropHandler($event)"
          @dragover="dragOverHandler($event)"
          class="absolute top-0 bottom-0 left-0 right-0 border border-ex-cyan rounded-lg z-40"
        ></div>
      </div>
    </template>
    <div
      ref="elContext"
      class="fixed hidden flex-col p-2 rounded-lg shadow z-[100] bg-slate-50"
    >
      <div>
        <button type="button" class="cursor-pointer" @click="deleteFile">
          <iconify-icon icon="mdi:trash" class="text-red-600"></iconify-icon>
          Hapus
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-list:hover {
  background: #76abae;
}
</style>
