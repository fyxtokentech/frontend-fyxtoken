import React from 'react';
import {DynTable} from "@jeff-aporta/camaleon";

const INVESTMENT_PACKAGES = [
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

const COLUMNS = [
  {
    field: "name",
    headerName: "Nombre",
    description: "Nombre del paquete de inversión",
    minWidth: 100,
  },
  {
    field: "duration",
    headerName: "Duración",
    description: "Tiempo que dura el paquete",
    minWidth: 70,
  },
  {
    field: "operation",
    headerName: "Operaciones",
    description: "Cantidad y tipo de operaciones incluidas",
    minWidth: 100,
  },
  {
    field: "gain",
    headerName: "Ganancia",
    description: "Porcentaje de ganancia estimada",
    minWidth: 70,
  },
  {
    field: "comision",
    headerName: "Comisión",
    description: "Porcentaje de comisión aplicada",
    minWidth: 70,
  },
  {
    field: "cost",
    headerName: "Costo",
    description: "Costo del paquete de inversión",
    minWidth: 100,
  },
  {
    field: "max_inv",
    headerName: "Máxima inversión",
    description: "Monto máximo de inversión permitido",
    minWidth: 100,
  },
];

function InvestmentTable(props) {
  return <DynTable {...props} columns={COLUMNS} rows={INVESTMENT_PACKAGES} />;
}

export default InvestmentTable;
