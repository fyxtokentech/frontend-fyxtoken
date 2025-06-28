import React from 'react';
import { Box } from '@mui/material';
// Importar la tabla de inversiones de prueba
import TableInvestments from "@test/investments/TableInvestments";

export default function InvestmentsTable() {
  return (
    <Box>
      {/* Renderizar la tabla de inversiones */}
      <TableInvestments />
    </Box>
  );
}
