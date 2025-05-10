import React, { useState, useEffect } from "react";
import { DynTable } from "@components/GUI/DynTable/DynTable";

import columns_sales from "./columns-sales.jsx";
import mock_sales from "./mock-sales.json";
import { Box, Typography } from "@mui/material";
import {
  AutoSkeleton,
  DateRangeControls,
} from "@components/controls";
import dayjs from "dayjs";

export default function TableSales({
  data = mock_sales,
  columns_config = columns_sales,
  ...rest
}) {
  const [loading, setLoading] = useState(true);
  const [dateRangeInit, setDateRangeInit] = useState(
    dayjs().subtract(7, "day")
  );
  const [dateRangeFin, setDateRangeFin] = useState(dayjs());

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, [dateRangeInit, dateRangeFin, data]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Ventas
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
      <AutoSkeleton loading={loading} h="300px">
        <DynTable rows={data} columns={columns_config} {...rest} />
      </AutoSkeleton>
    </Box>
  );
}
