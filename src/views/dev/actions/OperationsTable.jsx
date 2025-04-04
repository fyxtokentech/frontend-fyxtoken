import React from 'react';
import { Typography, Box } from '@mui/material';

import TableOperations from "@test/operacion/TableOperations";

export default function OperationsTable() {
  // TODO: Fetch and display operations data
  return (
    <Box>
      <TableOperations useForUser={false} />
    </Box>
  );
}
