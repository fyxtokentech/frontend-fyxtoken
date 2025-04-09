import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

// mui
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { Chip, Paper, Tooltip } from "@mui/material";

// mylibs
import "./DynTable.css";

import {
  getThemeLuminance,
  getThemeName,
  isDark,
} from "@jeff-aporta/theme-manager";

import localeTextES from "./localeTextES";
import { genAllColumns, exclude } from "./Util";
import { rendersTemplate } from "./rendersTemplate";

function DynTable({ rows, columns, paginationModel, ...rest }) {
  const [, setWindowWidth] = useState(window.innerWidth);

  const apiRef = useGridApiRef();
  const refDataGrid = useRef();

  columns = exclude(columns).filter((c) => c["inTable"] != false);

  rendersTemplate(columns);

  rows = rows.map((row, i) => ({
    id: i,
    ...row,
  }));

  paginationModel ??= { page: 0, pageSize: 20 };

  useLayoutEffect(() => {
    const table = refDataGrid.current;
    if (table) {
      table.querySelectorAll(".MuiToolbar-root *").forEach((e) => {
        if (e.innerHTML.toLowerCase().trim() == "rows per page:") {
          e.innerHTML = "Filas por página:";
        }
        const regex_pagination = /\d+–\d+ of \d+/;
        if (regex_pagination.test(e.innerHTML)) {
          e.innerHTML = e.innerHTML.replace("of", "de");
        }
      });
    }
  }, [apiRef, refDataGrid]);

  const rsz = () => {
    let width = (0.96 * window.innerWidth - 120) / columns.length;
    columns = columns.map((c) => {
      const { headerName, fit_content, renderString, renderInfo } = c;
      let { iconized, label } = renderInfo || {};
      const render = Boolean(iconized ?? label);
      c.minWidth = str2width(headerName) + 50;
      c.width = Math.max(width, c.minWidth);
      if ((fit_content && renderString) || render) {
        c.width = Math.max(c.width, ...rows.map((r) => Row2width(r)));
      }
      return c;

      function Row2width(row) {
        const value = row[c.field];
        let texto = value;
        if (!renderString) {
          if (iconized) {
            ({ texto } = iconized({ value, row }, value));
          }
        } else {
          ({ texto } = renderString({ value, row }));
        }
        return str2width(texto) + 20 + 60 * render;
      }

      function str2width(str) {
        return str.length * (14 * 0.55);
      }
    });
  };

  useEffect(() => {
    const handleResize = () => {
      rsz();
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  rsz();

  return (
    <Paper
      elevation={(() => {
        if (getThemeLuminance() == "dark") {
          if (getThemeName() != "blacknwhite") {
            return 0;
          }
        }
      })()}
    >
      <div
        className="DynTable-container"
        style={{
          height: "auto",
          width: "100%",
          background: `rgba(0,0,0,${isDark() ? 0.1 : 0.025})`,
        }}
      >
        <DataGrid
          density="standard"
          disableRowSelectionOnClick
          {...rest}
          ref={refDataGrid}
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel,
            },
          }}
          pageSizeOptions={[20, 50, 100]}
          autoHeight
          disableExtendRowFullWidth={false}
          sx={{
            "& .MuiDataGrid-row:hover": {
              backgroundColor:
                getThemeName() == "main"
                  ? `hsla(
              var(--morado-enfasis-h),
              var(--morado-enfasis-s),
              var(--morado-enfasis-l),
              0.2
            )`
                  : null,
            },
            "& .MuiDataGrid-cell": {
              border: "none", // Remueve bordes de cada celda
              whiteSpace: "normal",
              wordWrap: "break-word",
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "none", // Remueve borde inferior de los encabezados
            },
            "& .MuiDataGrid-row": {
              borderBottom: "none", // Remueve borde inferior de las filas
              // overflow: "hidden !important",
            },
            "& .MuiDataGrid-root": {
              border: "none", // Remueve bordes de la tabla completa
              width: "100%",
              // overflow: "hidden !important",
            },
            "& .MuiDataGrid-virtualScroller": {
              // overflow: "auto !important",
            },
            "& .MuiDataGrid-scrollbar--horizontal": {
              // overflow: "hidden !important",
              position: "sticky !important",
              bottom: "0 !important",
            },
            "& .MuiDataGrid-main": {
              position: "relative !important",
              overflow: "auto !important",
              display: "block !important",
              // width: "80vw !important",
               maxHeight: "80vh",
            },
            "& .MuiDataGrid-virtualScrollerContent": {
              width: "fit-content !important",
              overflow: "auto !important",
            },
            "--DataGrid-rowWidth": "fit-content !important",
          }}
          localeText={localeTextES}
        />
      </div>
    </Paper>
  );
}

export { DynTable, genAllColumns, rendersTemplate, exclude };
