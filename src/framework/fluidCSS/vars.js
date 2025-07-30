export const diccionario = {};
export const estructuras = {};

export const isSmall = () => window.innerWidth <= sizes.small;
export const isMedium = () => window.innerWidth <= sizes.medium;
export const isLarge = () => window.innerWidth > sizes.medium;
export const isConfort = () => window.innerWidth > sizes.large;

export const sizes = {
  small: 600,
  medium: 900,
  large: 1200,
  responsive: [600, 900], //btw
  "responsive-min": [400, 1000], // lerp
};

export const determinarAliasDeTamaño = (value) => {
  if (sizes[value]) {
    return sizes[value];
  }
  return value;
};
