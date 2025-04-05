import React from 'react';
import { Box } from '@mui/material';
// Importar la tabla de APIs de usuario de prueba
import TableUserApis from "@test/UserApis/TableUserApis"; // Corregido nombre de carpeta

export default function UserApisTable() {
  return (
    <Box>
      {/* Renderizar la tabla de APIs de usuario */}
      <TableUserApis />
    </Box>
  );
}
