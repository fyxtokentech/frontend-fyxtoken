import React, { useState, useEffect } from "react";
import { DynTable, WaitSkeleton } from "@jeff-aporta/camaleon";

import columns_purchases from "./columns-purchases.jsx";
import mock_purchases from "./mock-purchases.json";
import { Box, Typography } from "@mui/material";
import { DateRangeControls } from "@components/controls";
import dayjs from "dayjs";

export default function TablePurchases({
  data = mock_purchases,
  columns_config = columns_purchases,
  ...rest
}) {
  const [loading, setLoading] = useState(true);
  const [dateRangeInit, setDateRangeInit] = useState(
    dayjs().subtract(14, "day")
  );
  const [dateRangeFin, setDateRangeFin] = useState(dayjs());

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [dateRangeInit, dateRangeFin, data]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Compras
      </Typography>
      <br />
      <DateRangeControls
        {...{
          loading,
          dateRangeInit,
          setDateRangeInit,
          dateRangeFin,
          setDateRangeFin,
        }}
      />
      <br />
      <WaitSkeleton loading={loading}>
        <DynTable rows={data} columns={columns_config} {...rest} />
      </WaitSkeleton>
    </Box>
  );
}
