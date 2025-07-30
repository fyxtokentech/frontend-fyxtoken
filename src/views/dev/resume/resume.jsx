import React from "react";
import { Box, Tabs, Tab, Paper, Typography } from "@mui/material";
import {
  fluidCSS,
  driverParams,
  getPaletteConfig,
} from "@jeff-aporta/camaleon"; // Importar fluidCSS

// Importar contenedores y templates
import {
  DivM,
  addThemeChangeListener,
  removeThemeChangeListener,
} from "@jeff-aporta/camaleon";

// Importar los componentes de las pestañas (se crearán a continuación)
import OperationsTable from "./actions/OperationsTable";
import TransactionsTable from "./actions/TransactionsTable";
import InvestmentsTable from "./actions/InvestmentsTable";
import DepositsTable from "./actions/DepositsTable";
import UserApisTable from "./actions/UserApisTable";
import SalesTable from "./actions/SalesTable";
import PurchasesTable from "./actions/PurchasesTable";
import WithdrawalsTable from "./actions/WithdrawalsTable"; // Nuevo componente para retiros

import { Main } from "@theme/main.jsx";

const tabMapping = {
  deposits: 0,
  investments: 1,
  operations: 2,
  withdrawals: 3, // Nueva pestaña de retiros
  purchases: 4, // Compra antes que venta
  sales: 5, // Venta después de compra
  apis: 6, // APIs al final
};

const { lemonGreen } = window.themeColors;

const reverseTabMapping = Object.fromEntries(
  Object.entries(tabMapping).map(([key, value]) => [value, key])
);

export default () => <Resume />;

class Resume extends React.Component {
  constructor(props) {
    super(props);
    const key = driverParams.get("view_resume")[0] || "deposits";
    const idx = tabMapping.hasOwnProperty(key) ? tabMapping[key] : 0;
    this.state = { activeTab: idx };
  }

  handleChange = (_, newValue) => {
    const tabKey = reverseTabMapping[newValue];
    this.setState({ activeTab: newValue });
    driverParams.set("view_resume", tabKey);
  };

  renderTabContent() {
    const { activeTab } = this.state;
    switch (reverseTabMapping[activeTab]) {
      case "deposits":
        return <DepositsTable />;
      case "investments":
        return <InvestmentsTable />;
      case "operations":
        return <OperationsTable />;
      case "withdrawals":
        return <WithdrawalsTable />;
      case "purchases":
        return <PurchasesTable />;
      case "sales":
        return <SalesTable />;
      case "apis":
        return <UserApisTable />;
      default:
        return <DepositsTable />;
    }
  }

  render() {
    const { activeTab } = this.state;
    const palette = getPaletteConfig();
    return (
      <Main h_init="20px" h_fin="300px">
        <DivM>
          <Typography variant="h4">Panel Resumen</Typography>
          <br />
          <Paper sx={{ width: "100%", p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={this.handleChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  "& .Mui-selected": {
                    color: `${palette.constrast_color.hex()} !important`,
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: `${palette.constrast_color.hex()} !important`,
                  },
                }}
              >
                <Tab
                  label="Depósitos"
                  id="tab-deposits"
                  aria-controls="tabpanel-deposits"
                />
                <Tab
                  label="Inversiones"
                  id="tab-investments"
                  aria-controls="tabpanel-investments"
                />
                <Tab
                  label="🚧 Operaciones"
                  id="tab-operations"
                  aria-controls="tabpanel-operations"
                />
                <Tab
                  label="🚧 Retiros"
                  id="tab-withdrawals"
                  aria-controls="tabpanel-withdrawals"
                />
                <Tab
                  label="Compras"
                  id="tab-purchases"
                  aria-controls="tabpanel-purchases"
                />
                <Tab
                  label="Ventas"
                  id="tab-sales"
                  aria-controls="tabpanel-sales"
                />
                <Tab
                  label="APIs de Usuario"
                  id="tab-apis"
                  aria-controls="tabpanel-apis"
                />
              </Tabs>
            </Box>
            <Box>{this.renderTabContent()}</Box>
          </Paper>
        </DivM>
      </Main>
    );
  }
}
