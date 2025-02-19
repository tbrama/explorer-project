export interface ViewFolder {
    list: Vfolder[]
  }
  
  export interface Vfolder {
    id: number
    folders_name: string
    parentDir: number
    isFile: number
    path: string
  }
  