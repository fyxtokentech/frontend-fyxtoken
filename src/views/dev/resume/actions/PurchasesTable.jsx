import React from 'react';
import { Box } from '@mui/material';
// Importar la tabla de compras de prueba
import TablePurchases from "@test/purchases/TablePurchases";

export default function PurchasesTable() {
  return (
    <Box>
      {/* Renderizar la tabla de compras */}
      <TablePurchases />
    </Box>
  );
}
