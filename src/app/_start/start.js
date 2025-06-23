export function initStartApp() {
  window.assignNullish(window, {
    currentUser: JSON.parse(localStorage.getItem("user") || "null"),
  });
}
