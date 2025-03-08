import { Paper } from "@mui/material";

import DynTable from "@components/GUI/DynTable";

import { isDark } from "@theme/theme-manager.jsx";

export default Investment;

function Investment({ children }) {
  return (
    <>
      {children}
      <br />
      <Paper
        variant="outlined"
        sx={{
          height: "80vh",
          background: isDark() ? "rgba(0,0,0,0.25)" : "",
        }}
      >
        <TableInvestment />
      </Paper>
    </>
  );

  function TableInvestment() {
    const minWidth = 100;
    const minWidth_min = 70;

    const rows = [
      {
        id: 0,
        name: "Paquete Básico",
        duration: "7 Días",
        operation: "5 op. de 1 hora",
        gain: "10%",
        comision: "20%",
        cost: "Gratis",
        max_inv: "$500",
      },
      {
        id: 1,
        name: "Paquete Avanzado",
        duration: "14 Días",
        operation: "10 op. de 1 hora",
        gain: "15%",
        comision: "20%",
        cost: "$10",
        max_inv: "$1,000",
      },
      {
        id: 2,
        name: "Paquete Pro",
        duration: "30 Días",
        operation: "50 op. variadas",
        gain: "20%",
        comision: "20%",
        cost: "$20",
        max_inv: "$5,000",
      },
      {
        id: 3,
        name: "Paquete Élite",
        duration: "Mensual",
        operation: "100 op. variadas",
        gain: "25%",
        comision: "30%",
        cost: "$50",
        max_inv: "$10,000",
      },
      {
        id: 4,
        name: "Paquete Premium",
        duration: "Anual",
        operation: "Ilimitado",
        gain: "31%-70%",
        comision: "15%",
        cost: "$100",
        max_inv: "Ilimitado",
      },
    ];

    const columns = [
      {
        field: "name",
        headerName: "Nombre",
        description: "Nombre del paquete de inversión",
        minWidth,
      },
      {
        field: "duration",
        headerName: "Duración",
        description: "Tiempo que dura el paquete",
        minWidth: minWidth_min,
      },
      {
        field: "operation",
        headerName: "Operaciones",
        description: "Cantidad y tipo de operaciones incluidas",
        minWidth,
      },
      {
        field: "gain",
        headerName: "Ganancia",
        description: "Porcentaje de ganancia estimada",
        minWidth: minWidth_min,
      },
      {
        field: "comision",
        headerName: "Comisión",
        description: "Porcentaje de comisión aplicada",
        minWidth: minWidth_min,
      },
      {
        field: "cost",
        headerName: "Costo",
        description: "Costo del paquete de inversión",
        minWidth,
      },
      {
        field: "max_inv",
        headerName: "Máxima inversión",
        description: "Monto máximo de inversión permitido",
        minWidth,
      },
    ];

    return <DynTable {...{ columns, rows }} />;
  }
}
