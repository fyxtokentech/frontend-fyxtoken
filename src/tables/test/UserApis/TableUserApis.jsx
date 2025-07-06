import React, { useState, useEffect } from "react";
import { DynTable, WaitSkeleton } from "@jeff-aporta/camaleon";

import columns_user_apis from "./columns-UserApis.jsx";
import mock_UserApis from "./mock-UserApis.json"; // Corregido nombre archivo mock
import { Box } from "@mui/material";

export default function TableUserApis({
  data = mock_UserApis,
  columns_config = columns_user_apis,
  ...rest
}) {
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
      <WaitSkeleton loading={loading}>
        <DynTable rows={data} columns={columns_config} {...rest} />
      </WaitSkeleton>
    </Box>
  );
}
