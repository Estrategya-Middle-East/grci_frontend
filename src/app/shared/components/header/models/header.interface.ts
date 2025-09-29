export interface ShowFilteration {
  tabeOne: Search;
  tabeTwo: Search;
  search: Search;
  year?: Search;
  import: boolean;
}

export interface Search {
  show: boolean;
  label: string;
}
export interface ShowActions {
  add: Add;
  import: Import;
}

export interface Add {
  show: boolean;
  isLink?: boolean;
  label: string;
  link?: string;
}
export interface Import {
  show: boolean;
  label: string;
}
export interface DropdownList {
  label: string;
  optionLabel: string;
  list: List[];
  searchType: string;
  selected: string;
}

export interface List {
  name: string;
  value: number;
}
