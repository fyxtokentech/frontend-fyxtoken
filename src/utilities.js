export function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

export function isMobile() {
  return /Mobi|Android|android|iphone|ipad|ipod|opera mini|iemobile|blackberry/i.test(
    navigator.userAgent || navigator.vendor || window.opera
  );
}

export function centrar_verticalmente_scroll(elemento) {
  const elementRect = elemento.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + window.pageYOffset;
  const middle =
    absoluteElementTop - window.innerHeight / 2 + elemento.offsetHeight / 2;

  window.scrollTo({
    top: middle,
    behavior: "smooth",
  });
}

export function burn() {
  Object.assign(window, {
    utilities: {
      isTouchDevice,
      isMobile,
      centrar_verticalmente_scroll,
    },
  });
}
