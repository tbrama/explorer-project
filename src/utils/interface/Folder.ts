export interface ListFolder {
    list: Folder[]
  }
  
  export interface Folder {
    id: number
    parentDir: number
    foldersName: string
    isFile: number
  }
  