export const isMobile = (() => {
  return /Mobi|Android|android|iphone|ipad|ipod|opera mini|iemobile|blackberry/i.test(
    navigator.userAgent || navigator.vendor || window.opera
  );
})();

export const IS_GITHUB = (() => {
  return window.location.hostname.includes(".github");
})();

export const IS_LOCAL = (() => {
  return ["localhost", "127.0.0.1"].some((h) =>
    window.location.hostname.includes(h)
  );
})();

export function firstUppercase(str) {
  const retorno = str.charAt(0).toUpperCase() + str.slice(1);
  return retorno;
}

export function joinClass(...classes) {
  return classes.filter(Boolean).join(" ");
}
