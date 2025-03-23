import fluidCSS from "@jeff-aporta/fluidcss";
import { Skeleton } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export { AutoSkeleton, DateRangeControls };

function AutoSkeleton({ loading, w = "100%", h = "5vh", ...rest }) {
  return loading ? (
    <Skeleton style={{ height: h, width: `max(300px, ${w})` }} />
  ) : (
    <div {...rest} />
  );
}

function DateRangeControls({
  dateRangeInit,
  dateRangeFin,
  setDateRangeInit,
  setDateRangeFin,
  loading,
}) {
  return (
    <div className="d-flex ai-stretch flex-wrap gap-10px">
      <div className={fluidCSS().ltX(700, { width: "100%" }).end()}>
        <AutoSkeleton h="10vh" w="250px" loading={loading}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              inert
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
              inert
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
