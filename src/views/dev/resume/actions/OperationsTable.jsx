import React from 'react';
import { Typography, Box } from '@mui/material';

import TableOperations from "@tables/operations/TableOperations";

export default function OperationsTable() {
  return (
    <Box>
      <TableOperations useForUser={false} coinid={24478} user_id={global.configApp.userID}/>
    </Box>
  );
}
