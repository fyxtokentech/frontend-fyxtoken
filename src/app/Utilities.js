function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

function isMobile() {
  return /Mobi|Android|android|iphone|ipad|ipod|opera mini|iemobile|blackberry/i.test(
    navigator.userAgent || navigator.vendor || window.opera
  );
}

export {
  isTouchDevice,
  isMobile,
};
