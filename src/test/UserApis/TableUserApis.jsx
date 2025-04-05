import React, { useState, useEffect } from 'react';
import {
  DynTable,
} from "@components/GUI/DynTable/DynTable";

import columns_user_apis from "./columns-UserApis.jsx";
import mock_UserApis from "./mock-UserApis.json"; // Corregido nombre archivo mock
import { Box } from '@mui/material';
import { AutoSkeleton } from "@views/dev/bot/controls"; // Sin controles de fecha

export default function TableUserApis({ data = mock_UserApis, columns_config = columns_user_apis, ...rest }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // Carga rápida
    return () => clearTimeout(timer);
  }, [data]); // Dependencia solo de data

  return (
    <Box>
      {/* Sin DateRangeControls para APIs */}
      <AutoSkeleton loading={loading} h="300px" >
        <DynTable
          rows={data}
          columns={columns_config}
          {...rest}
        />
      </AutoSkeleton>
    </Box>
  );
}
