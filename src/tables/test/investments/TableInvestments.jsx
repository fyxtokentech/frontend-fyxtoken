import React, { useState, useEffect } from "react";
import { DynTable, WaitSkeleton } from "@jeff-aporta/camaleon";

import columns_investments from "./columns-investments.jsx";
import mock_investments from "./mock-investments.json";
import { Box, Typography, Grid } from "@mui/material";
import { DateRangeControls, UserFilterControl } from "@components/controls";
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
  const [userFilter, setUserFilter] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  // Filtrar datos basados en el rango de fechas y el filtro de usuario
  useEffect(() => {
    const filterData = () => {
      // Filtrar por rango de fechas
      let filtered = data.filter((item) => {
        const itemDate = dayjs(item.date);
        return (
          itemDate.isAfter(dateRangeInit) &&
          itemDate.isBefore(dateRangeFin.add(1, "day"))
        );
      });

      // Filtrar por nombre de usuario si hay un filtro activo
      if (userFilter) {
        filtered = filtered.filter((item) => {
          // Verificar si el nombre de usuario contiene el texto de búsqueda (case insensitive)
          return (
            item.user_name &&
            item.user_name.toLowerCase().includes(userFilter.toLowerCase())
          );
        });
      }

      return filtered;
    };

    setFilteredData(filterData());
  }, [data, dateRangeInit, dateRangeFin, userFilter]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [dateRangeInit, dateRangeFin, userFilter, data]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Inversiones
      </Typography>
      <br />
      <Grid
        container
        spacing={3}
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item xs={12} md={7}>
          <DateRangeControls
            {...{
              loading,
              dateRangeInit,
              setDateRangeInit,
              dateRangeFin,
              setDateRangeFin,
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            display: "flex",
            justifyContent: { xs: "flex-start", md: "flex-end" },
          }}
        >
          <UserFilterControl
            value={userFilter}
            onChange={setUserFilter}
            loading={loading}
            label="Filtrar por usuario"
            placeholder="Nombre de usuario"
          />
        </Grid>
      </Grid>
      <br />
      <WaitSkeleton loading={loading}>
        <DynTable rows={filteredData} columns={columns_config} {...rest} />
      </WaitSkeleton>
    </Box>
  );
}
