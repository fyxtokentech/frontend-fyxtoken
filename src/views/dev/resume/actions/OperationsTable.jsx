import React from 'react';
import { Typography, Box } from '@mui/material';

import TableOperations from "@test/operacion/TableOperations";

export default function OperationsTable() {
  return (
    <Box>
      <TableOperations useForUser={false} />
    </Box>
  );
}
