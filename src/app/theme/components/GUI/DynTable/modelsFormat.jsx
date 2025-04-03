import BenefitUplineIcon from "@mui/icons-material/TrendingUpOutlined";
import BenefitDownlineIcon from "@mui/icons-material/TrendingDownOutlined";
import BenefitConstantlineIcon from "@mui/icons-material/TrendingFlatOutlined";

const currentBitcoin = {
  fit_content: true,
  renderInfo: {
    local: "es-ES",
    sufix: "name_coin",
    type: "number",
    "number-format"(params) {
      let { value } = params;
      value = Math.abs(value);
      if (value < 0.01) {
        return {
          maximumFractionDigits: 8,
        };
      } else {
        return {
          maximumFractionDigits: 2,
        };
      }
    },
  },
};

export default {
  profit: {
    ...{
      ...currentBitcoin,
      renderInfo: {
        ...currentBitcoin.renderInfo,
        iconized(params, renderString) {
          let { value } = params;
          const texto = renderString;
          const tooltip = texto;
          const strings = { texto, tooltip };
          if (value == 0) {
            return {
              ...strings,
              icon: <BenefitConstantlineIcon />,
              color: "warning",
            };
          }
          if (value < 0) {
            return {
              ...strings,
              icon: <BenefitDownlineIcon />,
              color: "error",
            };
          }
          if (value > 0) {
            return { ...strings, icon: <BenefitUplineIcon />, color: "ok" };
          }
        },
      },
    },
  },
  label: {
    fit_content: true,
    icon_width: 30,
  },
  datetime: {
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
  currentBitcoin,
};
