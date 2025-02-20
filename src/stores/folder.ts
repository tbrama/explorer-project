import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { Vfolder } from "@/utils/interface/View";

export const useFolderStore = defineStore("folder", () => {
  const search = ref("");
  const listSearch = ref(Array<Vfolder>());
  const path = ref("");
  const parent = ref(0);
  const listView = ref(Array<Vfolder>());

  return { search, listSearch, path, parent, listView };
});
