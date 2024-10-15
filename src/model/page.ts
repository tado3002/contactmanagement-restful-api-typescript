export type Paging = {
  size: number;
  total_page: number;
  current_page: number;
};
export type PageableContacts<T> = {
  contacts: Array<T>
  paging: Paging
}
export type PageableAddresses<T> = {
  addresses: Array<T>
  paging: Paging
}
