import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const formatBalanceValue = (value, currency = "USDT") => {
  const numericValue = Number(value ?? 0);
  if (!Number.isFinite(numericValue)) {
    return `0 ${currency}`;
  }

  const formattedValue = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);

  return `${formattedValue} ${currency}`;
};

const formatPercentValue = (value) => {
  const numericValue = Number(value ?? 0);
  if (!Number.isFinite(numericValue)) {
    return "0.00%";
  }

  const symbol = numericValue >= 0 ? "+" : "";

  return `${symbol}${new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue)}%`;
};

const normalizeBalanceAsset = (asset) => {
  const quantity = Number(asset?.quantity ?? 0);
  const currentPrice = Number(asset?.currentPrice ?? 0);

  return {
    symbol: asset?.name || "",
    name: `${asset?.name || "Activo"} · Cripto`,
    quantity,
    currentValue: quantity * currentPrice,
    purchased: Number(asset?.purchases ?? 0),
    sold: Number(asset?.sales ?? 0),
    pnl: Number(asset?.variation ?? 0),
    operations: `${Number(asset?.openedOperations ?? 0)} abiertas · ${Number(asset?.closedOperations ?? 0)} cerradas`,
    badge: asset?.name || "-",
    badgeColor: "#d4af37",
    currency: asset?.currency || "USDT",
  };
};

const feeCards = [
  {
    key: "exchange",
    title: "FEE CARGADO POR EL EXCHANGE",
    exchanges: [
      { key: "binance", label: "Binance", percentValue: "0.10%", usdValue: "2.75 US$" },
      { key: "kraken", label: "Kraken", percentValue: "0.12%", usdValue: "3.30 US$" },
    ],
    description: "Comisión estimada aplicada por el exchange en operaciones.",
    accent: "#f7d98c",
  },
  {
    key: "fyx",
    title: "FEE CARGADO POR FYXTOKEN",
    percentValue: "0.05%",
    usdValue: "1.37 US$",
    description: "Comisión aplicada por FyxToken por gestión y soporte.",
    accent: "#d7f28d",
  },
];

export default function Dashboard() {
  const [selectedAsset, setSelectedAsset] = useState("all");
  const [balanceAssets, setBalanceAssets] = useState([]);
  const [sortBy, setSortBy] = useState("currentValue");
  const [feeView, setFeeView] = useState({ exchange: "percent", fyx: "percent" });
  const [selectedExchange, setSelectedExchange] = useState("binance");
  const [startDate, setStartDate] = useState(() => dayjs().startOf("year"));
  const [endDate, setEndDate] = useState(dayjs());
  const [balancePeriod, setBalancePeriod] = useState("most_recent");
  const [balanceMonth, setBalanceMonth] = useState(dayjs().month());
  const [balanceWeek, setBalanceWeek] = useState(Math.ceil(dayjs().date() / 7));
  const [portfolioBalance, setPortfolioBalance] = useState(0);
  const [portfolioCurrency, setPortfolioCurrency] = useState("USDT");
  const [portfolioMetrics, setPortfolioMetrics] = useState({
    investment: 0,
    utility: 0,
    utilityCurrent: 0,
    currency: "USDT",
  });

  const setBalanceDateRange = (start, end, period = balancePeriod) => {
    setStartDate(dayjs(start));
    setEndDate(dayjs(end));
    setBalancePeriod(period);
  };

  const handleBalancePeriodChange = (event) => {
    const period = event.target.value;
    const today = dayjs();

    if (period === "day") {
      const date = today.format("YYYY-MM-DD");
      setBalanceDateRange(date, date, period);
      return;
    }

    if (period === "week") {
      const week = Math.min(4, Math.ceil(today.date() / 7));
      const start = today.startOf("month").date((week - 1) * 7 + 1);
      const end = week === 4
        ? today.endOf("month")
        : today.startOf("month").date(week * 7);
      setBalanceMonth(today.month());
      setBalanceWeek(week);
      setBalanceDateRange(start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD"), period);
      return;
    }

    if (period === "month") {
      setBalanceMonth(today.month());
      setBalanceDateRange(
        today.startOf("month").format("YYYY-MM-DD"),
        today.endOf("month").format("YYYY-MM-DD"),
        period
      );
      return;
    }

    setBalancePeriod(period);
  };

  const handleBalanceMonthChange = (event) => {
    const month = Number(event.target.value);
    const monthDate = dayjs().month(month);
    setBalanceMonth(month);
    setBalanceWeek(Math.min(4, Math.ceil(monthDate.date() / 7)));
    setBalanceDateRange(
      monthDate.startOf("month").format("YYYY-MM-DD"),
      monthDate.endOf("month").isAfter(dayjs()) ? dayjs().format("YYYY-MM-DD") : monthDate.endOf("month").format("YYYY-MM-DD"),
      balancePeriod
    );
  };

  const handleBalanceWeekChange = (event) => {
    const week = Number(event.target.value);
    const monthDate = dayjs().month(balanceMonth);
    const start = monthDate.startOf("month").date((week - 1) * 7 + 1);
    const end = week === 4 ? monthDate.endOf("month") : monthDate.startOf("month").date(week * 7);
    setBalanceWeek(week);
    setBalanceDateRange(
      start.format("YYYY-MM-DD"),
      end.isAfter(dayjs()) ? dayjs().format("YYYY-MM-DD") : end.format("YYYY-MM-DD"),
      "week"
    );
  };

  const handleBalanceDayChange = (value) => {
    const date = value || dayjs();
    setBalanceDateRange(date.format("YYYY-MM-DD"), date.format("YYYY-MM-DD"), "day");
  };

  useEffect(() => {
    let isActive = true;

    const loadPortfolioBalance = async () => {
      const userProfile = window.currentUser || {};
      const appConfig = typeof window !== "undefined" ? window.configApp : undefined;
      const userId = userProfile.user_id || appConfig?.userID || "";

      if (!userId) {
        if (isActive) {
          setPortfolioBalance(0);
          setPortfolioCurrency("USDT");
        }
        return;
      }

      try {
        const startDateValue = startDate?.format ? startDate.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD");
        const endDateValue = endDate?.format ? endDate.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD");
        const response = await fetch(
          `http://168.231.97.207:8081/exchange/user/${userId}/balance/actives?startDate=${encodeURIComponent(startDateValue)}&endDate=${encodeURIComponent(endDateValue)}&idApi=1`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = await response.json();
        const data = payload?.data ?? {};

        if (isActive) {
          if (Array.isArray(data)) {
            setBalanceAssets(data.map(normalizeBalanceAsset).filter((asset) => asset.symbol));
          } else {
            setPortfolioBalance(Number(data?.balance ?? 0));
            setPortfolioCurrency(data?.currency || "USDT");
          }
        }
      } catch (error) {
        console.error("Error cargando el balance del exchange:", error);
        if (isActive) {
          setPortfolioBalance(0);
          setPortfolioCurrency("USDT");
          setBalanceAssets([]);
        }
      }
    };

    const loadPortfolioMetrics = async () => {
      const userProfile = window.currentUser || {};
      const appConfig = typeof window !== "undefined" ? window.configApp : undefined;
      const userId = userProfile.user_id || appConfig?.userID || "";

      if (!userId) {
        if (isActive) {
          setPortfolioMetrics({ investment: 0, utility: 0, utilityCurrent: 0, currency: "USDT" });
        }
        return;
      }

      try {
        const startDateValue = startDate?.format ? startDate.format("YYYY-MM-DD 00:00:00") : dayjs().format("YYYY-MM-DD 00:00:00");
        const endDateValue = endDate?.format ? endDate.format("YYYY-MM-DD 00:00:00") : dayjs().format("YYYY-MM-DD 00:00:00");
        const endpoint = `http://168.231.97.207:8081/exchange/user/${userId}?startDate=${encodeURIComponent(startDateValue)}&endDate=${encodeURIComponent(endDateValue)}`;
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = await response.json();
        const data = payload?.data ?? {};

        if (isActive) {
          setPortfolioMetrics({
            investment: Number(data?.investment ?? 0),
            utility: Number(data?.utility ?? 0),
            utilityCurrent: Number(data?.utilityCurrent ?? 0),
            currency: data?.currency || "USDT",
          });
        }
      } catch (error) {
        console.error("Error cargando el resumen del exchange:", error);
        if (isActive) {
          setPortfolioMetrics({ investment: 0, utility: 0, utilityCurrent: 0, currency: "USDT" });
        }
      }
    };

    loadPortfolioBalance();
    loadPortfolioMetrics();

    return () => {
      isActive = false;
    };
  }, [startDate, endDate]);

  const summaryCards = useMemo(
    () => [
      {
        label: "INVERTIDO (COMPRAS)",
        value: formatBalanceValue(portfolioMetrics.investment, portfolioMetrics.currency),
      },
      {
        label: "RECIBIDO (VENTAS)",
        value: formatBalanceValue(portfolioMetrics.utility, portfolioMetrics.currency),
      },
      {
        label: "VALOR ACTUAL EN CARTERA",
        value: formatBalanceValue(portfolioBalance, portfolioCurrency),
      },
      { label: "GANANCIA SI VENDIERAS HOY", value: "-1,54 US$", tone: "danger" },
    ],
    [portfolioBalance, portfolioCurrency, portfolioMetrics]
  );

  const filteredAssets = useMemo(() => {
    const activeAssets =
      selectedAsset === "all"
        ? balanceAssets
        : balanceAssets.filter((asset) => asset.symbol === selectedAsset);

    return [...activeAssets].sort((a, b) => {
      if (sortBy === "pnl") return b.pnl - a.pnl;
      if (sortBy === "quantity") return b.quantity - a.quantity;
      return b.currentValue - a.currentValue;
    });
  }, [balanceAssets, selectedAsset, sortBy]);

  useEffect(() => {
    if (selectedAsset !== "all" && !balanceAssets.some((asset) => asset.symbol === selectedAsset)) {
      setSelectedAsset("all");
    }
  }, [balanceAssets, selectedAsset]);

  return (
    <Box sx={{ color: "#f5f0e8", width: "100%" }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            textTransform: "uppercase",
            letterSpacing: 1.2,
            color: "#d8bf7a",
            fontWeight: 700,
            fontSize: 12,
            mb: 1,
          }}
          variant="overline"
        >
          Operación real
        </Typography>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: 34, md: 46 }, lineHeight: 1.1, color: "#f3f0eb" }}>
          Balance de tus operaciones
        </Typography>
        <Typography sx={{ color: "#b7b2a9", mt: 1.5, fontSize: 18 }}>
          Compras y ventas reales que el Uninvet ejecutó en tus cuentas.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <DatePicker
              label="Desde"
              value={startDate}
              onChange={(value) => {
                setStartDate(value || dayjs().startOf("year"));
                setBalancePeriod("most_recent");
              }}
              format="DD/MM/YYYY"
              slotProps={{ textField: { size: "small", sx: { minWidth: 170, "& .MuiInputBase-root": { color: "#f5f0e8", background: "rgba(255,255,255,0.02)", borderRadius: 1 }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.12)" }, "& .MuiInputLabel-root": { color: "#d8bf7a" }, "& .MuiSvgIcon-root": { color: "#d8bf7a" } } } }}
            />
            <DatePicker
              label="Hasta"
              value={endDate}
              onChange={(value) => {
                setEndDate(value || dayjs());
                setBalancePeriod("most_recent");
              }}
              format="DD/MM/YYYY"
              slotProps={{ textField: { size: "small", sx: { minWidth: 170, "& .MuiInputBase-root": { color: "#f5f0e8", background: "rgba(255,255,255,0.02)", borderRadius: 1 }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.12)" }, "& .MuiInputLabel-root": { color: "#d8bf7a" }, "& .MuiSvgIcon-root": { color: "#d8bf7a" } } } }}
            />
          </Stack>
        </LocalizationProvider>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3, justifyContent: "flex-end" }}>
        <Box sx={{ minWidth: { xs: "100%", md: 250 }, p: 2.25, borderRadius: 1.5, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Typography sx={{ textTransform: "uppercase", letterSpacing: 1.2, color: "#a6a29d", fontSize: 11, fontWeight: 700 }}>
            Rentabilidad actual
          </Typography>
          <Typography sx={{ mt: 1.25, color: "#d9d2bf", fontWeight: 700, fontSize: 28 }}>
            {formatPercentValue(portfolioMetrics.utilityCurrent)}
          </Typography>
          <Typography sx={{ mt: 0.75, color: "#b7b2a9", fontSize: 12 }}>
            Resultado neto total vs. el total recibido en ventas.
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" }, gap: 2, mb: 2 }}>
        {summaryCards.slice(0, 3).map((card) => (
          <Box
            key={card.label}
            sx={{
              background: "rgba(255,255,255,0.02)",
              borderRadius: 1.5,
              border: "1px solid rgba(255,255,255,0.08)",
              p: 2.25,
              minHeight: 120,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ textTransform: "uppercase", letterSpacing: 1.2, color: "#a6a29d", fontSize: 11, fontWeight: 700 }}>
              {card.label}
            </Typography>
            <Typography sx={{ mt: 1.5, fontWeight: 800, fontSize: 28, color: "#f2efe9" }}>
              {card.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" }, gap: 2, mb: 4 }}>
        {feeCards.map((card) => {
          const selectedExchangeData = card.exchanges?.find((exchange) => exchange.key === selectedExchange) ?? card.exchanges?.[0];
          const currentValue = feeView[card.key] === "usd"
            ? (selectedExchangeData?.usdValue ?? card.usdValue)
            : (selectedExchangeData?.percentValue ?? card.percentValue);

          return (
            <Box
              key={card.key}
              sx={{
                background: card.key === "exchange" ? "rgba(255, 196, 83, 0.05)" : "rgba(255, 255, 255, 0.02)",
                borderRadius: 1.5,
                border: `1px solid ${card.key === "exchange" ? "rgba(216, 191, 122, 0.2)" : "rgba(255,255,255,0.08)"}`,
                p: 2.25,
                minHeight: 120,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
                <Typography sx={{ textTransform: "uppercase", letterSpacing: 1.2, color: "#a6a29d", fontSize: 11, fontWeight: 700 }}>
                  {card.title}
                </Typography>

                {card.exchanges && (
                  <FormControl size="small" sx={{ minWidth: 125 }}>
                    <InputLabel id="exchange-fee-filter-label" sx={{ color: "#d8bf7a", fontSize: 12 }}>
                      Exchange
                    </InputLabel>
                    <Select
                      labelId="exchange-fee-filter-label"
                      value={selectedExchange}
                      label="Exchange"
                      onChange={(event) => setSelectedExchange(event.target.value)}
                      sx={{
                        color: "#f5f0e8",
                        background: "rgba(255,255,255,0.02)",
                        ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.12)" },
                        ".MuiSvgIcon-root": { color: "#d8bf7a" },
                        fontSize: 12,
                      }}
                    >
                      {card.exchanges.map((exchange) => (
                        <MenuItem key={exchange.key} value={exchange.key}>{exchange.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <FormControl size="small" sx={{ minWidth: 110 }}>
                  <Select
                    value={feeView[card.key]}
                    onChange={(event) =>
                      setFeeView((prev) => ({
                        ...prev,
                        [card.key]: event.target.value,
                      }))
                    }
                    sx={{
                      color: "#f5f0e8",
                      background: "rgba(255,255,255,0.02)",
                      ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.12)" },
                      ".MuiSvgIcon-root": { color: "#d8bf7a" },
                      fontSize: 12,
                    }}
                  >
                    <MenuItem value="percent">%</MenuItem>
                    <MenuItem value="usd">USD</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Typography sx={{ mt: 1, fontWeight: 800, fontSize: 28, color: card.accent }}>
                {currentValue}
              </Typography>
              <Typography sx={{ mt: 0.75, color: "#b7b2a9", fontSize: 12 }}>
                {card.description}
              </Typography>
            </Box>
          );
        })}

        {summaryCards.slice(3).map((card) => (
          <Box
            key={card.label}
            sx={{
              background: card.tone === "danger" ? "rgba(255, 82, 82, 0.04)" : card.tone === "success" ? "rgba(167, 214, 107, 0.04)" : "rgba(255,255,255,0.02)",
              borderRadius: 1.5,
              border: `1px solid ${card.tone === "danger" ? "rgba(255, 82, 82, 0.2)" : card.tone === "success" ? "rgba(196, 214, 108, 0.2)" : "rgba(255,255,255,0.08)"}`,
              p: 2.25,
              minHeight: 120,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ textTransform: "uppercase", letterSpacing: 1.2, color: "#a6a29d", fontSize: 11, fontWeight: 700 }}>
              {card.label}
            </Typography>
            <Typography sx={{ mt: 1.5, fontWeight: 800, fontSize: 28, color: card.tone === "danger" ? "#f16d6d" : "#d7f28d" }}>
              {card.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <Typography sx={{ fontWeight: 800, color: "#f3f0eb", fontSize: 18 }}>
          Balance por activo
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="balance-period-filter-label" sx={{ color: "#d8bf7a" }}>Período</InputLabel>
            <Select
              labelId="balance-period-filter-label"
              value={balancePeriod}
              label="Período"
              onChange={handleBalancePeriodChange}
              sx={{
                color: "#f5f0e8",
                background: "rgba(255,255,255,0.02)",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.12)" },
                ".MuiSvgIcon-root": { color: "#d8bf7a" },
              }}
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="most_recent">Más recientes</MenuItem>
              <MenuItem value="day">1 día</MenuItem>
              <MenuItem value="week">1 semana</MenuItem>
              <MenuItem value="month">1 mes</MenuItem>
            </Select>
          </FormControl>

          {balancePeriod === "day" && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Seleccionar día"
                value={dayjs(startDate)}
                onChange={handleBalanceDayChange}
                format="DD/MM/YYYY"
                maxDate={dayjs()}
                slotProps={{ textField: { size: "small", sx: { minWidth: 160, "& .MuiInputBase-root": { color: "#f5f0e8", background: "rgba(255,255,255,0.02)", borderRadius: 1 }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.12)" }, "& .MuiInputLabel-root": { color: "#d8bf7a" }, "& .MuiSvgIcon-root": { color: "#d8bf7a" } } } }}
              />
            </LocalizationProvider>
          )}

          {balancePeriod === "week" && (
            <>
              <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel id="balance-month-filter-label" sx={{ color: "#d8bf7a" }}>Mes</InputLabel>
                <Select
                  labelId="balance-month-filter-label"
                  value={balanceMonth}
                  label="Mes"
                  onChange={handleBalanceMonthChange}
                  sx={{ color: "#f5f0e8", background: "rgba(255,255,255,0.02)", ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.12)" }, ".MuiSvgIcon-root": { color: "#d8bf7a" } }}
                >
                  {Array.from({ length: 12 }, (_, month) => (
                    <MenuItem key={month} value={month}>{dayjs().month(month).format("MMMM YYYY")}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel id="balance-week-filter-label" sx={{ color: "#d8bf7a" }}>Semana</InputLabel>
                <Select
                  labelId="balance-week-filter-label"
                  value={balanceWeek}
                  label="Semana"
                  onChange={handleBalanceWeekChange}
                  sx={{ color: "#f5f0e8", background: "rgba(255,255,255,0.02)", ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.12)" }, ".MuiSvgIcon-root": { color: "#d8bf7a" } }}
                >
                  {[1, 2, 3, 4].map((week) => (
                    <MenuItem key={week} value={week}>Semana {week}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          {balancePeriod === "month" && (
            <FormControl size="small" sx={{ minWidth: 170 }}>
              <InputLabel id="balance-month-only-filter-label" sx={{ color: "#d8bf7a" }}>Mes</InputLabel>
              <Select
                labelId="balance-month-only-filter-label"
                value={balanceMonth}
                label="Mes"
                onChange={handleBalanceMonthChange}
                sx={{ color: "#f5f0e8", background: "rgba(255,255,255,0.02)", ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.12)" }, ".MuiSvgIcon-root": { color: "#d8bf7a" } }}
              >
                {Array.from({ length: 12 }, (_, month) => (
                  <MenuItem key={month} value={month}>{dayjs().month(month).format("MMMM YYYY")}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel id="asset-filter-label" sx={{ color: "#d8bf7a" }}>Activo</InputLabel>
            <Select
              labelId="asset-filter-label"
              value={selectedAsset}
              label="Activo"
              onChange={(event) => setSelectedAsset(event.target.value)}
              sx={{
                color: "#f5f0e8",
                background: "rgba(255,255,255,0.02)",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.12)" },
                ".MuiSvgIcon-root": { color: "#d8bf7a" },
              }}
            >
              <MenuItem value="all">Todos los activos</MenuItem>
              {balanceAssets.map((asset) => (
                <MenuItem key={asset.symbol} value={asset.symbol}>{asset.symbol}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel id="sort-filter-label" sx={{ color: "#d8bf7a" }}>Ordenar</InputLabel>
            <Select
              labelId="sort-filter-label"
              value={sortBy}
              label="Ordenar"
              onChange={(event) => setSortBy(event.target.value)}
              sx={{
                color: "#f5f0e8",
                background: "rgba(255,255,255,0.02)",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.12)" },
                ".MuiSvgIcon-root": { color: "#d8bf7a" },
              }}
            >
              <MenuItem value="currentValue">Valor actual</MenuItem>
              <MenuItem value="pnl">P&L</MenuItem>
              <MenuItem value="quantity">Cantidad</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <TableContainer
        sx={{
          background: "rgba(255,255,255,0.01)",
          borderRadius: 1.5,
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: "rgba(255,255,255,0.02)" }}>
              <TableCell sx={{ color: "#a6a29d", fontWeight: 700, textTransform: "uppercase", fontSize: 11, py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Activo</TableCell>
              <TableCell sx={{ color: "#a6a29d", fontWeight: 700, textTransform: "uppercase", fontSize: 11, py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Cantidad</TableCell>
              <TableCell sx={{ color: "#a6a29d", fontWeight: 700, textTransform: "uppercase", fontSize: 11, py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Valor actual</TableCell>
              <TableCell sx={{ color: "#a6a29d", fontWeight: 700, textTransform: "uppercase", fontSize: 11, py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Comprado</TableCell>
              <TableCell sx={{ color: "#a6a29d", fontWeight: 700, textTransform: "uppercase", fontSize: 11, py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Vendido</TableCell>
              <TableCell sx={{ color: "#a6a29d", fontWeight: 700, textTransform: "uppercase", fontSize: 11, py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>P&L</TableCell>
              <TableCell sx={{ color: "#a6a29d", fontWeight: 700, textTransform: "uppercase", fontSize: 11, py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Operaciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssets.map((asset) => (
              <TableRow key={asset.symbol} sx={{ "&:hover": { background: "rgba(255,255,255,0.015)" } }}>
                <TableCell sx={{ py: 2.2, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: 1,
                        background: asset.badgeColor,
                        color: "#111",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    >
                      {asset.badge}
                    </Box>
                    <Box>
                      <Typography sx={{ color: "#f0efeb", fontWeight: 700 }}>
                        {asset.symbol}
                      </Typography>
                      <Typography sx={{ color: "#b7b2a9", fontSize: 12 }}>
                        {asset.name}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell sx={{ color: "#f0efeb", py: 2.2, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{asset.quantity}</TableCell>
                <TableCell sx={{ color: "#f0efeb", py: 2.2, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{formatBalanceValue(asset.currentValue, asset.currency)}</TableCell>
                <TableCell sx={{ color: "#f0efeb", py: 2.2, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{formatBalanceValue(asset.purchased, asset.currency)}</TableCell>
                <TableCell sx={{ color: "#f0efeb", py: 2.2, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{formatBalanceValue(asset.sold, asset.currency)}</TableCell>
                <TableCell sx={{ color: "#d7f28d", fontWeight: 700, py: 2.2, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{formatBalanceValue(asset.pnl, asset.currency)}</TableCell>
                <TableCell sx={{ color: "#b7b2a9", py: 2.2, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{asset.operations}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.08)" }} />
    </Box>
  );
}