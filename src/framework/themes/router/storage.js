let use_view_id;

initStorageUseViewId();

export function initStorageUseViewId() {
  const storage = getUseViewIdStorage();
  use_view_id = global.nullish(use_view_id, storage);
}

export function getUseViewIdStorage() {
  return localStorage.getItem("router-use-view-id") == 1;
}

export function getUseViewId() {
  return use_view_id;
}

export function UseViewId(bool = true) {
  use_view_id = !!bool;
}

export function defaultUseViewId(bool) {
  if (localStorage.getItem("router-use-view-id")) {
    return;
  }
  configUseViewId(bool);
}

export function configUseViewId(bool) {
  localStorage.setItem("router-use-view-id", +bool);
  window.location.reload();
}
