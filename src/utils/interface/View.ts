export interface ViewFolder {
  list: Vfolder[];
  path: string;
  msg: string;
}

export interface Vfolder {
  id: number;
  folders_name: string;
  parentDir: number;
  isFile: number;
  path: string;
}
