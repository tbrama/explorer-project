// fetch.js
import type { Folder, ListFolder } from "@/utils/interface/Folder";
import type { ViewFolder } from "@/utils/interface/View";
import { ref } from "vue";

export const useFetch = () => {
  const baseUrl = "http://localhost:3001/explorer-api/v1";

  const dataList = ref<null | ListFolder>(null);
  const listFolderApi = async () => {
    const result = await fetch(`${baseUrl}/`);
    dataList.value = await result.json();
  };

  const dataListView = ref<null | ViewFolder>(null);
  const listViewApi = async (index: number) => {
    const result = await fetch(`${baseUrl}/${index}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    });
    dataListView.value = await result.json();
  };

  const dataSearch = ref<null | ViewFolder>(null);
  const listSearchApi = async (data: { cari: string }) => {
    const result = await fetch(`${baseUrl}/carifolder`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    dataSearch.value = await result.json();
  };

  const resAddFolder = ref<null | ViewFolder>(null);
  const addFolderApi = async (data: {
    foldersName: string;
    parentDir: number;
  }) => {
    const result = await fetch(`${baseUrl}/add-folder`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    resAddFolder.value = await result.json();
  };

  const dataUpFile = ref<null | ViewFolder>(null);
  const upFileApi = async (data: any) => {
    const result = await fetch(`${baseUrl}/add-files`, {
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
      method: "POST",
      body: data,
    });
    dataUpFile.value = await result.json();
  };

  const resDelete = ref<null | ViewFolder>(null);
  const deleteApi = async (data: {
    path: string;
    id: number;
    parentDir: number;
  }) => {
    const result = await fetch(`${baseUrl}/delete`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    resDelete.value = await result.json();
  };

  return {
    dataList,
    listFolderApi,
    dataListView,
    listViewApi,
    dataSearch,
    listSearchApi,
    dataUpFile,
    upFileApi,
    resDelete,
    deleteApi,
    resAddFolder,
    addFolderApi,
  };
};
