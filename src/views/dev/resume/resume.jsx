import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Paper, Typography } from "@mui/material";
import { DriverParams } from "@jeff-aporta/router";
import fluidCSS from "@jeff-aporta/fluidcss"; // Importar fluidCSS

// Importar contenedores y templates
import { ThemeSwitcher } from "@templates";
import { DivM } from "@containers";

// Importar los componentes de las pestañas (se crearán a continuación)
import OperationsTable from "./actions/OperationsTable";
import TransactionsTable from "./actions/TransactionsTable";
import InvestmentsTable from "./actions/InvestmentsTable";
import DepositsTable from "./actions/DepositsTable";
import UserApisTable from "./actions/UserApisTable";
import SalesTable from "./actions/SalesTable";
import PurchasesTable from "./actions/PurchasesTable";
import WithdrawalsTable from "./actions/WithdrawalsTable"; // Nuevo componente para retiros

import {paletteConfig} from "@jeff-aporta/theme-manager";

import {themeSwitch_listener} from "@templates";

import { Title } from "@recurrent";

const tabMapping = {
  deposits: 0,
  investments: 1,
  operations: 2,
  withdrawals: 3, // Nueva pestaña de retiros
  purchases: 4,   // Compra antes que venta
  sales: 5,       // Venta después de compra
  apis: 6,        // APIs al final
};

const {
  verde_lima
} = global.identity.colors;

const reverseTabMapping = Object.fromEntries(
  Object.entries(tabMapping).map(([key, value]) => [value, key])
);

export default function DevView() {
  const [theme, setTheme] = useState(0);
  const driverParams = DriverParams();
  const initialTabKey = driverParams.get("action-id") || "deposits";
  // Ensure initialTabKey is valid, otherwise default to deposits (index 0)
  const initialTabIndex = tabMapping.hasOwnProperty(initialTabKey) ? tabMapping[initialTabKey] : 0;
  const [activeTab, setActiveTab] = useState(initialTabIndex);

  // Update URL and state when tab changes
  const handleChange = (event, newValue) => {
    const newTabKey = reverseTabMapping[newValue];
    setActiveTab(newValue);
    // Update URL without reloading the page if possible, 
    // assuming DriverParams handles history updates correctly.
    driverParams.set("action-id", newTabKey); 
  };

  useEffect(() => {
    themeSwitch_listener.push(setTheme);
  }, []);

  // Effect to sync tab state if URL changes externally (e.g., back/forward buttons)
  useEffect(() => {
    const currentActionId = driverParams.get("action-id") || 'deposits';
    const desiredTabIndex = tabMapping.hasOwnProperty(currentActionId) ? tabMapping[currentActionId] : 0;
    if (activeTab !== desiredTabIndex) {
        setActiveTab(desiredTabIndex);
    }
    // Optional: Set initial action-id if missing (might be redundant if handled elsewhere)
    // if (!driverParams.get("action-id")) {
    //   driverParams.set("action-id", "deposits");
    // }
  }, [driverParams.get("action-id")]); // Re-run if action-id changes


  const renderTabContent = () => {
    const currentTabKey = reverseTabMapping[activeTab];
    switch (currentTabKey) {
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
         // Fallback to deposits if the key is somehow invalid
        return <DepositsTable />;
    }
  };

  const palette_config = paletteConfig();

  return (
    // Envolver con ThemeSwitcher y DivM
    <ThemeSwitcher h_init="20px" h_fin="300px">
      <DivM>
        {/* Usar el componente Title */}
        <Title txt="Panel Resumen" />

        {/* Mantener Paper para la estructura interna de las pestañas */}
        <Paper sx={{ width: '100%', p: 3 /* mt: 2 eliminado ya que DivM puede manejar margen */ }}> 
          {/* Typography h4 eliminada, manejada por Title */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
                value={activeTab} 
                onChange={handleChange} 
                variant="scrollable" 
                scrollButtons="auto"
                sx={{
                    '& .Mui-selected': {
                        color: `${palette_config.constrast_color.hex()} !important`, // Color del texto de la pestaña seleccionada
                    },
                    '& .MuiTabs-indicator': {
                        backgroundColor: `${palette_config.constrast_color.hex()} !important`, // Color del indicador
                    },
                }}
            >
              <Tab label="Depósitos" id="tab-deposits" aria-controls="tabpanel-deposits" />
              <Tab label="Inversiones" id="tab-investments" aria-controls="tabpanel-investments" />
              <Tab label="Operaciones" id="tab-operations" aria-controls="tabpanel-operations" />
              <Tab label="Retiros" id="tab-withdrawals" aria-controls="tabpanel-withdrawals" />
              <Tab label="Compras" id="tab-purchases" aria-controls="tabpanel-purchases" />
              <Tab label="Ventas" id="tab-sales" aria-controls="tabpanel-sales" />
              <Tab label="APIs de Usuario" id="tab-apis" aria-controls="tabpanel-apis" />
            </Tabs>
          </Box>
          {/* Render content based on active tab */}
          <Box>
              {renderTabContent()}
          </Box>
        </Paper>
      </DivM>
    </ThemeSwitcher>
  );
}