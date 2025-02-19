// fetch.js
import type { Folder, ListFolder } from '@/utils/interface/Folder';
import type { ViewFolder } from '@/utils/interface/View';
import { ref } from 'vue'

export const  useFetch = () =>  {


  const baseUrl = "http://localhost:3001/explorer-api/v1";

  const dataList = ref<null|ListFolder>(null);
  const listFolderApi = async () => {
    const result = await fetch(`${baseUrl}/`);
    dataList.value = await result.json();
  }

  const dataListView = ref<null|ViewFolder>(null);
  const listViewApi = async (index:number) => {
    const result = await fetch(`${baseUrl}/${index}`);
    dataListView.value = await result.json();
  }

  const dataSearch= ref<null|ViewFolder>(null);
  const listSearchApi = async (data:{cari:string}) => {
    const result = await fetch(`${baseUrl}/carifolder` ,{
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    dataSearch.value = await result.json();
  }

  return { dataList, listFolderApi,  dataListView, listViewApi, dataSearch, listSearchApi }
}