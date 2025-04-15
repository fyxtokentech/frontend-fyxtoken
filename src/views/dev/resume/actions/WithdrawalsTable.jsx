import React from 'react';
import { Box } from '@mui/material';
// Importar la tabla de retiros
import TableWithdrawals from "@test/withdrawal/TableWithdrawals";

export default function WithdrawalsTable() {
  return (
    <Box>
      {/* Renderizar la tabla de retiros */}
      <TableWithdrawals user_id={global.configApp.userID} />
    </Box>
  );
}
