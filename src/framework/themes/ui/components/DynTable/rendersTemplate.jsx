import React from "react";
import { Typography } from "@mui/material";
import { getNumberFormat } from "./modelsFormat.jsx";
import { ReserveLayer } from "../containers.jsx";
import { TooltipGhost } from "../controls.jsx";

export function rendersTemplate(columns_config) {
  columns_config.map((column) => {
    const { renderInfo, headerName, showHeaderInTooltip = true } = column;
    if (renderInfo) {
      let {
        "date-format": date_format,
        "number-format": number_format,
        label,
        iconized,
        local,
        sufix,
        style,
        styleEl1,
        styleEl2,
        className,
        hide_seconds,
        join_date = "/",
      } = renderInfo;

      if (label) {
        return Object.assign(column, LabelFormat());
      }
      if (number_format) {
        Object.assign(column, NumberFormat());
      }
      if (date_format) {
        Object.assign(column, DateFormat());
      }

      if (iconized) {
        const { renderCell } = LabelFormat();
        return Object.assign(column, { renderCell });
      }

      function DateFormat() {
        return {
          renderString(params) {
            let { texto = "---", tooltip = "Fecha no disponible" } =
              extractInfoDate();

            return {
              texto,
              tooltip: tooltipWhitHeader(
                tooltip,
                headerName,
                showHeaderInTooltip
              ),
            };

            function extractInfoDate() {
              const { value } = params;
              if (!value) {
                return {};
              }
              const date = new Date(value);
              const formattedDate = date.toLocaleString(
                global.nullishFlat(local, "es-ES"),
                date_format
              );
              const [datePart, timePart] = formattedDate
                .replaceAll(" de ", join_date)
                .split(", ");
              let [hour, minute, seconds] = timePart.split(":");
              if (hide_seconds) {
                seconds = null;
              } else {
                seconds = seconds.split(" ")[0];
              }
              const time = [hour, minute, seconds].filter(Boolean).join(":");
              const sufix_time = date_format["hour12"]
                ? ["AM", "PM"][+(date.getHours() >= 12)]
                : "";

              const formattedTime = [time, sufix_time]
                .filter(Boolean)
                .join(" ");

              const { texto, simple_text } = processSufix(
                {},
                formattedTime,
                datePart,
                {
                  style,
                  className,
                  styleEl1,
                  styleEl2,
                  join: ", ",
                  hour,
                  minute,
                  seconds,
                }
              );
              return {
                texto,
                tooltip: simple_text,
              };
            }
          },
          renderCell: RenderGeneral({
            column,
            ...column,
            className:
              "DateFormat d-center gap-10px " + (column.className || ""),
          }),
        };
      }

      function NumberFormat() {
        return {
          renderString(params) {
            const { value, row } = params;
            let retorno;

            let texto = "---";
            let tooltip = "Valor no disponible";

            if (value == null) {
              return {
                texto,
                tooltip: tooltipWhitHeader(
                  tooltip,
                  headerName,
                  showHeaderInTooltip
                ),
              };
            }

            const number_format_ =
              typeof number_format == "function"
                ? number_format(params)
                : number_format;

            ({ texto } = getNumberFormat().numberFormat(
              number_format_,
              value,
              local,
              retorno
            ));

            let simple_text;

            ({ texto, simple_text } = processSufix(row, sufix, texto, {
              style,
              className,
              styleEl1,
              styleEl2,
            }));

            tooltip = tooltipWhitHeader(
              simple_text,
              headerName,
              showHeaderInTooltip
            );

            return { texto, tooltip };
          },
          renderCell: RenderGeneral({ column, ...column }),
        };
      }

      function LabelFormat() {
        return {
          renderString(params) {
            const { value } = params;
            const {
              text = (value ?? "").toString(),
              color,
              icon,
            } = label[value] || {};
            return {
              texto: text,
              tooltip: text,
              color,
              icon,
            };
          },
          renderCell(params) {
            let renderString;
            if (column.renderString) {
              renderString = column.renderString(params);
            } else {
              ({ value: renderString } = params);
            }
            const { texto, tooltip, color, icon } = (() => {
              if (iconized) {
                return iconized(params, renderString.texto);
              }
              return renderString;
            })();
            return RenderGeneral({
              column,
              ...column,
              className:
                "LabelFormat d-center gap-10px " + (column.className || ""),
              component: column.component || "Typography",
              tooltip: tooltipWhitHeader(
                tooltip,
                headerName,
                showHeaderInTooltip
              ),
              color,
              children: (
                <>
                  {icon} {texto}
                </>
              ),
            });
          },
        };
      }
    }
  });
}

function tooltipWhitHeader(tooltip, headerName, showHeaderInTooltip) {
  if (!showHeaderInTooltip) {
    return tooltip;
  }
  return (
    <div className="flex col-direction">
      <Typography variant="caption">
        <b>{headerName}:</b>
      </Typography>
      <Typography variant="caption">{tooltip}</Typography>
    </div>
  );
}

function processSufix(
  row,
  sufix,
  texto,
  { style, className, styleEl1, styleEl2, join = " ", ...rest }
) {
  const row_sufix = row[sufix];
  if (row_sufix) {
    sufix = row_sufix;
  }
  const simple_text = [texto, sufix].filter(Boolean).join(join);
  if (style || className) {
    if (typeof styleEl2 == "function") {
      styleEl2 = styleEl2({ row, ...rest });
    }
    if (typeof styleEl1 == "function") {
      styleEl1 = styleEl1({ row, ...rest });
    }
    texto = (
      <div className={className} style={style}>
        <div>
          <span style={styleEl1}>{texto}</span>
        </div>
        <div>
          <span style={styleEl2}>{sufix}</span>
        </div>
      </div>
    );
  } else {
    texto = simple_text;
  }
  return { texto, simple_text };
}

function RenderGeneral({
  column,
  style = {},
  className = "",
  children,
  //General
  component = "div",
  tooltip,
  //MUI
  color,
}) {
  const ComponentSelected = ({ children, fromChildren, tooltip }) => {
    const CLASSNAME = `RenderGeneral-${component} ${
      fromChildren ? "fromChildren" : ""
    } ${tooltip ? "tooltip" : "noTooltip"} ${className}`;
    switch (component) {
      case "ReserveLayer":
        return (
          <ReserveLayer style={style} className={CLASSNAME}>
            {children}
          </ReserveLayer>
        );
      case "Typography":
        return (
          <Typography style={style} className={CLASSNAME} color={color}>
            {children}
          </Typography>
        );
      case "div":
      default:
        return (
          <div style={style} className={CLASSNAME}>
            {children}
          </div>
        );
    }
  };

  const EnvolveTooltip = ({ children, tooltip = "", fromChildren }) => {
    const CompEnv = (
      <ComponentSelected fromChildren={fromChildren} tooltip={tooltip}>
        {children}
      </ComponentSelected>
    );
    return (
      <TooltipGhost title={tooltip}>
        <div>{CompEnv}</div>
      </TooltipGhost>
    );
  };
  if (children) {
    return (
      <EnvolveTooltip tooltip={tooltip} fromChildren>
        {children}
      </EnvolveTooltip>
    );
  }
  return (params) => {
    const { texto, tooltip } = column.renderString(params);
    return <EnvolveTooltip tooltip={tooltip}>{texto}</EnvolveTooltip>;
  };
}
