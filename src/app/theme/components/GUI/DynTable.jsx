import React, { useLayoutEffect, useRef } from "react";

import "./DynTable.css";

import {
  DataGrid,
  useGridApiRef,
  DEFAULT_GRID_AUTOSIZE_OPTIONS,
} from "@mui/x-data-grid";

export default DynTable;

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

function DynTable({ rows, columns, paginationModel }) {
  const apiRef = useGridApiRef();
  const refDataGrid = useRef();

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
      });
    }
  }, [apiRef, refDataGrid]);

  let width = (window.innerWidth - 120) / columns.length;

  if (width > 150) {
    width = 150;
  }

  columns = columns.map((c) => {
    c.minWidth = c.headerName.length * (14 * 0.55) + 30;
    return {
      ...c,
      width: Math.max(width, c.minWidth),
    };
  });

  return (
    <DataGrid
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
      density="compact"
      sx={{
        "& .MuiDataGrid-row:hover": {
          backgroundColor: `hsla(
            var(--verde-cielo-h),
            var(--verde-cielo-s),
            var(--verde-cielo-l),
            0.2
          )`,
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
  );
}
