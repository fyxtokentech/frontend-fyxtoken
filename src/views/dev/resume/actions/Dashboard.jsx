import React, { useState } from "react";
import {
  Box,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";

const balanceMock = { balance: 5000, currency: "USDT" };
const resumeMock = {
  investment: 5000,
  received: 1250.5,
  balance: 3749.5,
  utility: 120.75,
  utilityToday: 45.2,
  utilityTotal: 650.3,
  currency: "USDT",
};
const assetsMock = [{
  name: "BTC",
  quantity: 2.5,
  currentPrice: 67895.12,
  variation: 12.02,
  openedOperations: 0,
  closedOperations: 14,
}];
const earningsByAssetMock = [
  { name: "BTC", earnedUSDT: 650.3, color: "#f59e0b" },
  { name: "ETH", earnedUSDT: 310.2, color: "#6366f1" },
  { name: "SOL", earnedUSDT: 185.4, color: "#14b8a6" },
  { name: "ADA", earnedUSDT: 104.1, color: "#ef4444" },
];
const chartMock = {
  day: {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "Ahora"],
    balance: [3680, 3715, 3690, 3730, 3725, 3749.5],
    utility: [74, 82, 79, 96, 101, 120.75],
  },
  week: {
    labels: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Hoy"],
    balance: [3619.5, 3669.5, 3639.5, 3714.5, 3759.5, 3784.5, 3749.5],
    utility: [82.75, 91.2, 88.4, 102.3, 110.5, 128.6, 120.75],
  },
  month: {
    labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Hoy"],
    balance: [3420, 3560, 3650, 3710, 3749.5],
    utility: [38.4, 65.2, 84.7, 108.2, 120.75],
  },
};

const formatMoney = (value, currency = "USDT") =>
  `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} ${currency}`;

const totalEarnings = earningsByAssetMock.reduce(
  (total, asset) => total + asset.earnedUSDT,
  0
);

const formatPercentage = (value) =>
  `${((value / totalEarnings) * 100).toFixed(2)}%`;

const withOpacity = (hex, opacity) => {
  const normalized = hex.replace("#", "");
  const number = parseInt(normalized, 16);
  return `rgba(${number >> 16}, ${(number >> 8) & 255}, ${number & 255}, ${opacity})`;
};

function Metric({ label, value, detail, color = "text.primary" }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography color="text.secondary" variant="body2">{label}</Typography>
      <Typography color={color} sx={{ mt: 0.5, fontWeight: 700 }} variant="h6">{value}</Typography>
      {detail && <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="caption">{detail}</Typography>}
    </Box>
  );
}

export default function Dashboard() {
  const [period, setPeriod] = useState("week");
  const [selectedAsset, setSelectedAsset] = useState("all");
  const [metric, setMetric] = useState("balance");
  const periodData = chartMock[period];
  const visibleAssets = selectedAsset === "all"
    ? assetsMock
    : assetsMock.filter((item) => item.name === selectedAsset);
  const asset = visibleAssets[0] || assetsMock[0];
  const chartData = periodData[metric];
  const chartTitle = metric === "balance" ? "Balance de la cuenta" : "Rendimiento acumulado";
  const chartCurrency = metric === "balance" ? balanceMock.currency : resumeMock.currency;

  return (
    <Box sx={{ color: "text.primary" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2, flexWrap: "wrap", mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Resumen de cuenta</Typography>
          <Typography color="text.secondary" variant="body2">Tu actividad y balance en un solo lugar</Typography>
        </Box>
        <Chip icon={<AccountBalanceWalletOutlinedIcon />} label={`Cuenta spot · ${balanceMock.currency}`} variant="outlined" />
      </Box>
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center", mb: 3, p: 1.5, border: 1, borderColor: "divider", borderRadius: 1 }}>
        <Typography color="text.secondary" sx={{ mr: 0.5 }} variant="body2">Filtrar por</Typography>
        <FormControl size="small" sx={{ minWidth: 145 }}>
          <InputLabel id="dashboard-period-label">Periodo</InputLabel>
          <Select label="Periodo" labelId="dashboard-period-label" value={period} onChange={(event) => setPeriod(event.target.value)}>
            <MenuItem value="day">Hoy</MenuItem><MenuItem value="week">7 dias</MenuItem><MenuItem value="month">30 dias</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 145 }}>
          <InputLabel id="dashboard-asset-label">Activo</InputLabel>
          <Select label="Activo" labelId="dashboard-asset-label" value={selectedAsset} onChange={(event) => setSelectedAsset(event.target.value)}>
            <MenuItem value="all">Todos los activos</MenuItem>
            {earningsByAssetMock.map((item) => <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 165 }}>
          <InputLabel id="dashboard-metric-label">Metrica</InputLabel>
          <Select label="Metrica" labelId="dashboard-metric-label" value={metric} onChange={(event) => setMetric(event.target.value)}>
            <MenuItem value="balance">Balance</MenuItem><MenuItem value="utility">Rendimiento</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.25fr 1fr 1fr" }, gap: 2, mb: 2 }}>
        <Box sx={{ p: 2.5, borderRadius: 1, bgcolor: "action.hover" }}>
          <Typography color="text.secondary" variant="body2">Balance total estimado</Typography>
          <Typography sx={{ mt: 1, fontWeight: 800 }} variant="h4">{formatMoney(balanceMock.balance, balanceMock.currency)}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }} alignItems="center"><ArrowUpwardIcon color="success" fontSize="small" /><Typography color="success.main" variant="body2">+{formatMoney(resumeMock.utilityToday)} hoy</Typography></Stack>
        </Box>
        <Box sx={{ p: 2.5, borderRadius: 1, border: 1, borderColor: "divider" }}>
          <Metric label="Rendimiento total" value={formatMoney(metric === "balance" ? resumeMock.utilityTotal : resumeMock.utility)} detail={`${formatMoney(resumeMock.utility)} disponible`} color="success.main" />
        </Box>
        <Box sx={{ p: 2.5, borderRadius: 1, border: 1, borderColor: "divider" }}>
          <Metric label="Invertido" value={formatMoney(resumeMock.investment)} detail={`${formatMoney(resumeMock.received)} recibido`} />
        </Box>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.4fr 1fr" }, gap: 2 }}>
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography sx={{ fontWeight: 700 }} variant="subtitle1">{chartTitle}</Typography><Typography color="text.secondary" variant="caption">{period === "day" ? "Hoy" : period === "week" ? "Ultimos 7 dias" : "Ultimos 30 dias"}</Typography></Box><ShowChartIcon color={metric === "balance" ? "success" : "primary"} /></Stack>
          <LineChart height={220} margin={{ left: 8, right: 8, top: 20, bottom: 20 }} xAxis={[{ data: periodData.labels, scaleType: "point" }]} yAxis={[{ width: 65, valueFormatter: (value) => formatMoney(value, chartCurrency) }]} series={[{ data: chartData, area: true, color: metric === "balance" ? "#16a34a" : "#2563eb", showMark: false }]} sx={{ "& .MuiChartsAxis-tickLabel": { fontSize: 11 } }} />
        </Box>
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography sx={{ fontWeight: 700 }} variant="subtitle1">Ganancias por moneda</Typography>
              <Typography color="text.secondary" variant="caption">Total de operaciones realizadas</Typography>
            </Box>
            <Typography color="success.main" sx={{ fontWeight: 700 }} variant="body2">{formatMoney(totalEarnings)}</Typography>
          </Stack>
          <PieChart
            height={235}
            series={[{
              data: earningsByAssetMock.map((item) => ({
                id: item.name,
                label: item.name,
                value: item.earnedUSDT,
                color: withOpacity(item.color, selectedAsset === "all" || selectedAsset === item.name ? 1 : 0.2),
              })),
              innerRadius: 48,
              outerRadius: 92,
              paddingAngle: 2,
              arcLabel: (item) => formatPercentage(item.value),
              arcLabelMinAngle: 15,
            }]}
            slotProps={{ legend: { hidden: true } }}
            sx={{ "& .MuiPieArcLabel-root": { fontWeight: 700, fill: "#fff" } }}
          />
          <Stack spacing={1}>
            {earningsByAssetMock.map((item) => {
              const isSelected = selectedAsset === "all" || selectedAsset === item.name;
              return (
                <Stack key={item.name} direction="row" justifyContent="space-between" alignItems="center" sx={{ opacity: isSelected ? 1 : 0.35 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color }} />
                    <Typography variant="body2">{item.name}</Typography>
                  </Stack>
                  <Typography sx={{ fontWeight: 700 }} variant="body2">{formatPercentage(item.earnedUSDT)} · {formatMoney(item.earnedUSDT)}</Typography>
                </Stack>
              );
            })}
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={3}><Metric label="Operaciones abiertas" value={asset.openedOperations} /><Metric label="Operaciones cerradas" value={asset.closedOperations} /></Stack>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center"><ArrowDownwardIcon color="action" fontSize="small" /><Typography color="text.secondary" variant="caption">Ganancia seleccionada: {formatMoney(selectedAsset === "all" ? totalEarnings : earningsByAssetMock.find((item) => item.name === selectedAsset)?.earnedUSDT || 0)}</Typography></Stack>
        </Box>
      </Box>
    </Box>
  );
}