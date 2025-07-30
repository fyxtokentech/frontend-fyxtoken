const {
  renderInfo: {
    "date-format": mainRenderInfoDateFormat,
    ...renderInfoDateFormat
  },
  ...propsDateFormat
} = {
  fit_content: true,
  renderInfo: {
    local: "es-ES",
    hide_seconds: true,
    "date-format": {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
  },
};

const modelsFormat = {
  format: {
    number: {
      numberFormat,
    },
  },
  label: {
    fit_content: true,
    icon_width: 30,
  },
  datetime: {
    ...propsDateFormat,
    renderInfo: {
      ...renderInfoDateFormat,
      "date-format": {
        ...mainRenderInfoDateFormat,
        hour12: false,
      },
    },
  },
  datetime12: {
    ...propsDateFormat,
    renderInfo: {
      ...renderInfoDateFormat,
      "date-format": {
        ...mainRenderInfoDateFormat,
        hour12: true,
      },
    },
  },
  numberGeneral: {
    fit_content: true,
    renderInfo: {
      local: "es-ES",
      type: "number",
      "number-format": {
        maximumFractionDigits: 2,
      },
    },
  },
};

export function addModelFormat(newsModels) {
  Object.assign(getModelsFormat(), newsModels);
}

export function getModelsFormat() {
  return modelsFormat;
}

export function addNumberFormat(newsModels) {
  Object.assign(getNumberFormat(), newsModels);
}

export function getNumberFormat() {
  return modelsFormat.format.number;
}

function numberFormat(number_format, value, local, retorno) {
  if (number_format) {
    const numeroFormateado = new Intl.NumberFormat(
      local || "es-ES",
      number_format
    ).format(+value);

    retorno = numeroFormateado;
  }
  return { texto: retorno };
}