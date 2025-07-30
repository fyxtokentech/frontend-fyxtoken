import React, { Component } from "react";

import "./DynTable.css";

import { DataGrid } from "@mui/x-data-grid";
import { Chip, Paper, Tooltip } from "@mui/material";

import { JS2CSS } from "../../../../fluidCSS/JS2CSS/index.js";

import {
  getPrimaryColor,
  getThemeLuminance,
  getThemeName,
  isDark,
} from "../../../rules/index.js";

import { localeTextES } from "./localeTextES.js";

import { rendersTemplate } from "./rendersTemplate.jsx";
import { idR } from "../../../../tools/math/math.js";

function burnCSS(table, props) {
  const { rowHoverColor } = props;
  JS2CSS.insertStyle({
    id: "DynTable-js2css",
    [`.DynTable-container.${table.R}`]: {
      "& .MuiDataGrid-row:hover": {
        backgroundColor: rowHoverColor,
      },
    },
  });
}

function resizeColumnsFromWindowWidth(table, props) {
  const { innerWidth } = window;
  const { rows = [], columns = [] } = props;
  let autoWidth = (0.96 * innerWidth - 120) / columns.length;
  if (autoWidth < 150) {
    autoWidth = 150;
  }
  table.columns = columns.map((c) => {
    const {
      headerName,
      fit_content,
      renderString,
      renderInfo,
      extra_width = 0,
    } = c;
    const extra_buttons = 30;
    const extra_padding = 20;
    c.minWidth =
      str2width(headerName) + extra_buttons + extra_padding + extra_width;
    c.width = Math.max(autoWidth, c.minWidth, c.width || 1);
    if (fit_content) {
      c.width = Math.max(c.width, ...props.rows.map((row) => Row2width(row)));
    }
    return c;

    function Row2width(row) {
      const value = row[c.field];
      let texto = value;
      let { iconized, label } = renderInfo || {};
      const extra_render = 60 * +!!(iconized || label);
      if (renderString) {
        let { texto: t_ } = renderString({ value, row });
        if (t_) {
          texto = t_;
        }
      } else {
        if (iconized) {
          let { texto: t_ } = iconized({ value, row }, value);
          if (t_) {
            texto = t_;
          }
        }
      }

      return str2width(texto) + extra_padding + extra_render + extra_width;
    }

    function str2width(str) {
      return (str || "---").toString().length * (14 * 0.55);
    }
  });
}

function genColor2CSSAlpha(color, alpha = 0.2) {
  return `rgba(${color
    .rgb()
    .array()
    .map((c) => parseInt(c))
    .join(",")}, ${alpha}) !important`;
}

export function columnsExclude(columns) {
  return columns.filter((c) => c.inTable != false && c.exclude != true);
}

export class DynTable extends Component {
  constructor(props) {
    super(props);
    this.apiRef = React.createRef();
    this.refDataGrid = React.createRef();
    this.R = idR();
    // Definir color de hover de fila para CSS dinámico
    burnCSS(this, this.props);
    this.resizeColumns = () => {
      resizeColumnsFromWindowWidth(this, this.props);
    };
  }

  componentDidUpdate() {
    this.props.componentDidUpdate && this.props.componentDidUpdate.bind(this)();
  }

  componentDidMount() {
    window.addEventListener("resize", this.resizeColumns);
    this.props.componentDidMount && this.props.componentDidMount.bind(this)();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeColumns);
    this.props.componentWillUnmount &&
      this.props.componentWillUnmount.bind(this)();
  }

  render() {
    this.resizeColumns();
    const { columns = [] } = this;
    const {
      rows = [],
      density = "compact",
      elevation = 1,
      background = "none !important",
      headercolor = genColor2CSSAlpha(getPrimaryColor().toGray(0.6), 0.2),
      rowHoverColor = genColor2CSSAlpha(getPrimaryColor(), 0.1),
      pageSizeOptions = [20, 50, 100],
      paginationModel = {
        page: 0,
        pageSize: 20,
      },
      className = "",
      style = {},
    } = this.props;

    // Variables locales
    let columnsFiltered = columnsExclude(columns);
    let rowsWithID = rows.map((row, i) => ({ id: i, ...row }));

    rendersTemplate(columnsFiltered);

    return (
      <Paper elevation={elevation}>
        <div
          className={`DynTable-container ${this.R} ${className}`}
          style={{
            height: "auto",
            width: "100%",
            ...style,
          }}
        >
          <DataGrid
            columns={columnsFiltered}
            rows={rowsWithID}
            density={density}
            disableRowSelectionOnClick
            ref={this.refDataGrid}
            initialState={{
              pagination: {
                paginationModel,
              },
            }}
            pageSizeOptions={pageSizeOptions}
            autoHeight
            disableExtendRowFullWidth={false}
            localeText={localeTextES}
            sx={{
              "--DataGrid-t-color-background-base": background,
              "--DataGrid-t-header-background-base": headercolor,
              "--DataGrid-containerBackground": headercolor,
            }}
          />
        </div>
      </Paper>
    );
  }
}
