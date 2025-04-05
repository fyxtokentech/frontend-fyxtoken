import fluidCSS from "@jeff-aporta/fluidcss";
import { FormControl, FormControlLabel, Radio, RadioGroup, Skeleton, useTheme } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {paletteConfig} from "@jeff-aporta/theme-manager";
import React from 'react';

export { AutoSkeleton, DateRangeControls };

function AutoSkeleton({ loading, w = "100%", h = "5vh", ...rest }) {
  return loading ? (
    <Skeleton style={{ height: h, width: `max(300px, ${w})` }} />
  ) : (
    <div {...rest} />
  );
}

function DateRangeControls({
  type = "radios",
  dateRangeInit,
  dateRangeFin,
  setDateRangeInit,
  setDateRangeFin,
  loading,
}) {
  const theme = useTheme();
  
  const handleRadioChange = (event) => {
    const value = event.target.value;
    const now = dayjs();
    
    switch (value) {
      case "day":
        setDateRangeFin(now);
        setDateRangeInit(now.subtract(1, 'day'));
        break;
      case "week":
        setDateRangeFin(now);
        setDateRangeInit(now.subtract(1, 'week'));
        break;
      case "month":
        setDateRangeFin(now);
        setDateRangeInit(now.subtract(1, 'month'));
        break;
      default:
        break;
    }
  };
  
  // Establecer el valor por defecto de "1 día" al montar el componente
  React.useEffect(() => {
    if (type === "radios") {
      const now = dayjs();
      setDateRangeFin(now);
      setDateRangeInit(now.subtract(1, 'day'));
    }
  }, [type, setDateRangeFin, setDateRangeInit]);
  
  // Si el tipo es "none", no mostrar ningún control
  if (type === "none") {
    return null;
  }
  
  if (type === "radios") {
    const palette_config = paletteConfig();
    return (
      <div className="d-flex ai-stretch flex-wrap gap-20px">
        <AutoSkeleton h="10vh" w="100%" loading={loading}>
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="date-range"
              name="date-range"
              defaultValue="day"
              onChange={handleRadioChange}
              sx={{
                '& .MuiFormControlLabel-root': {
                  marginRight: theme.spacing(3),
                },
                '& .MuiRadio-root': {
                  color: palette_config.constrast_color.hex(),
                  '&.Mui-checked': {
                    color: palette_config.constrast_color.hex(),
                  }
                },
              }}
            >
              <FormControlLabel 
                value="day" 
                control={<Radio />} 
                label="1 día" 
              />
              <FormControlLabel 
                value="week" 
                control={<Radio />} 
                label="1 semana" 
              />
              <FormControlLabel 
                value="month" 
                control={<Radio />} 
                label="1 mes" 
              />
            </RadioGroup>
          </FormControl>
        </AutoSkeleton>
      </div>
    );
  }
  
  return (
    <div className="d-flex ai-stretch flex-wrap gap-20px">
      <div className={fluidCSS().ltX(700, { width: "100%" }).end()}>
        <AutoSkeleton h="10vh" w="250px" loading={loading}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              className="fullWidth"
              label="Fecha inicio"
              defaultValue={dateRangeInit}
              onChange={(date) => setDateRangeInit(date)}
              slotProps={{ textField: { size: "small" } }}
            />
          </LocalizationProvider>
        </AutoSkeleton>
      </div>
      <div className={fluidCSS().ltX(700, { width: "100%" }).end()}>
        <AutoSkeleton h="10vh" w="250px" loading={loading}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              className="fullWidth"
              label="Fecha Fin"
              defaultValue={dateRangeFin}
              onChange={(date) => setDateRangeFin(date)}
              slotProps={{ textField: { size: "small" } }}
            />
          </LocalizationProvider>
        </AutoSkeleton>
      </div>
    </div>
  );
}
