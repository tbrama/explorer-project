import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { Vfolder } from "@/utils/interface/View";

export const useFolderStore = defineStore("folder", () => {
  const search = ref("");
  const listSearch = ref(Array<Vfolder>());
  const path = ref("");

  return { search, listSearch, path };
});
