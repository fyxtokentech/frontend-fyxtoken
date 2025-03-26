import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

import "./dynamic-table.css";

import { DataGrid, useGridApiRef } from "@mui/x-data-grid";

import { getThemeName, isDark } from "@jeff-aporta/theme-manager";

const localeTextES = {
  // Textos generales
  noRowsLabel: "Sin filas",
  noResultsOverlayLabel: "No se encontraron resultados",
  errorOverlayDefaultLabel: "Ha ocurrido un error.",

  // Barra de herramientas (Toolbar)
  toolbarDensity: "Densidad",
  toolbarDensityLabel: "Densidad",
  toolbarDensityCompact: "Compacto",
  toolbarDensityStandard: "Estándar",
  toolbarDensityComfortable: "Cómodo",

  toolbarColumns: "Columnas",
  toolbarColumnsLabel: "Seleccionar columnas",

  toolbarFilters: "Filtros",
  toolbarFiltersLabel: "Mostrar filtros",
  toolbarFiltersTooltipHide: "Ocultar filtros",
  toolbarFiltersTooltipShow: "Mostrar filtros",
  toolbarFiltersTooltipActive: (count) =>
    count > 1 ? `${count} filtros activos` : `${count} filtro activo`,

  toolbarExport: "Exportar",
  toolbarExportLabel: "Exportar",
  toolbarExportCSV: "Descargar como CSV",
  toolbarExportPrint: "Imprimir",

  // Panel de columnas
  columnsPanelTextFieldLabel: "Buscar columna",
  columnsPanelTextFieldPlaceholder: "Título de columna",
  columnsPanelDragIconLabel: "Reordenar columna",
  columnsPanelShowAllButton: "Mostrar todo",
  columnsPanelHideAllButton: "Ocultar todo",

  // Panel de filtros
  filterPanelAddFilter: "Agregar filtro",
  filterPanelDeleteIconLabel: "Eliminar",
  filterPanelOperators: "Operadores",
  filterPanelOperatorAnd: "Y",
  filterPanelOperatorOr: "O",
  filterPanelColumns: "Columna",
  filterPanelInputLabel: "Valor",
  filterPanelInputPlaceholder: "Filtrar valor",

  // Menú de columnas
  columnMenuLabel: "Menú",
  columnMenuShowColumns: "Mostrar columnas",
  columnMenuFilter: "Filtrar",
  columnMenuHideColumn: "Ocultar",
  columnMenuUnsort: "Desordenar",
  columnMenuSortAsc: "Orden ascendente",
  columnMenuSortDesc: "Orden descendente",

  // Paginación del Footer
  footerPaginationRowsPerPage: "Filas por página:",
  footerPaginationLabelRowsPerPage: "Filas por página:",
  footerPaginationDisplayedRows: ({ from, to, count }) =>
    `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`,
  footerPaginationNext: "Siguiente página",
  footerPaginationPrevious: "Página anterior",
  footerPaginationFirst: "Primera página",
  footerPaginationLast: "Última página",

  // Ordenamiento y celdas
  sortLabel: "Ordenar",
  booleanCellTrueLabel: "sí",
  booleanCellFalseLabel: "no",
  actionsCellMore: "más",

  // Encabezados de columna
  columnHeaderFiltersTooltipActive: (count) =>
    count > 1 ? `${count} filtros activos` : `${count} filtro activo`,
  columnHeaderFiltersLabel: "Mostrar filtros",
  columnHeaderSortIconLabel: "Ordenar",
};

function DynTable({ rows, columns, paginationModel, ...rest }) {
  const apiRef = useGridApiRef();
  const refDataGrid = useRef();

  columns = columns.filter((c) => c["inTable"] != false);

  rows = rows.map((row, i) => ({
    id: i,
    ...row,
  }));

  paginationModel ??= { page: 0, pageSize: 20 };

  useLayoutEffect(() => {
    if (apiRef.current) {
      // Llamada única a autosizeColumns
      // apiRef.current.autosizeColumns(DEFAULT_GRID_AUTOSIZE_OPTIONS);
    }
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

  const [, setWindowWidth] = useState(window.innerWidth);

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
        return str2width(texto) + 20 + 50 * render;
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
    <div
      className="DynTable-container"
      style={{
        maxHeight: "80vh",
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
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "none", // Remueve borde inferior de los encabezados
          },
          "& .MuiDataGrid-row": {
            borderBottom: "none", // Remueve borde inferior de las filas
          },
          "& .MuiDataGrid-root": {
            border: "none", // Remueve bordes de la tabla completa
          },
        }}
        localeText={localeTextES}
      />
    </div>
  );
}

function genAllColumns(content) {
  return Object.keys(
    content.reduce((acc, value) => {
      Object.assign(acc, value);
      return acc;
    }, {})
  ).map((k) => ({
    field: k,
    headerName: k,
    description: "",
  }));
}

export { DynTable, genAllColumns };
