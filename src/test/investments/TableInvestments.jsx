import React, { useState, useEffect } from "react";
import { DynTable } from "@components/GUI/DynTable/DynTable";

import columns_investments from "./columns-investments.jsx";
import mock_investments from "./mock-investments.json";
import { Box, Typography } from "@mui/material";
import {
  AutoSkeleton,
  DateRangeControls,
} from "@components/controls";
import dayjs from "dayjs";

export default function TableInvestments({
  data = mock_investments,
  columns_config = columns_investments,
  ...rest
}) {
  const [loading, setLoading] = useState(true);
  const [dateRangeInit, setDateRangeInit] = useState(
    dayjs().subtract(30, "day")
  ); // Rango diferente
  const [dateRangeFin, setDateRangeFin] = useState(dayjs());

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [dateRangeInit, dateRangeFin, data]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Inversiones
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
