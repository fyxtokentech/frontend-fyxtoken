import React from 'react';
import { Box } from '@mui/material';
// Importar la tabla de depósitos de prueba
import TableDeposits from "@test/deposits/TableDeposits";

export default function DepositsTable() {
  return (
    <Box>
      {/* Renderizar la tabla de depósitos */}
      <TableDeposits />
    </Box>
  );
}
