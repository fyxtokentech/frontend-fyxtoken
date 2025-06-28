import React from 'react';
import { Typography, Box } from '@mui/material';

import TableTransactions from "@tables/transactions/TableTransactions";

export default function TransactionsTable() {
  // TODO: Fetch and display transactions data
  return (
    <Box>
      <TableTransactions useOperation={false} user_id={global.configApp.userID}/>
    </Box>
  );
}
