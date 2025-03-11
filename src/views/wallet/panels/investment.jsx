import { useState } from "react";

import fluidCSS from "fluid-css-lng";

import { TitlePanel } from "./comun";

import {
  generate_inputs,
  generate_selects,
  Info,
} from "@components/repetitives";

import DynTable from "@components/GUI/DynTable";
import { PaperP } from "@components/containers";

import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import { Button, Typography } from "@mui/material";

function Investment() {
  const [packtype, setPacktype] = useState("");
  const [time, setTime] = useState("");
  const [rechargeType, setRechargeType] = useState("PSE");

  return (
    <PaperP elevation={0}>
      <TitlePanel>Paquetes de inversión</TitlePanel>
      <div className="mh-10px">
        <Typography variant="caption" color="secondary">
          Selecciona entre diferentes paquetes de inversión diseñados para
          maximizar tus rendimientos y adaptarse a tus metas financieras. Conoce
          sus detalles, plazos y beneficios para tomar la mejor decisión de
          inversión.
        </Typography>
      </div>
      <br />
      <Investment_actions
        {...{
          time,
          setTime,
          rechargeType,
          setRechargeType,
          packtype,
          setPacktype,
        }}
      />
      <br />
      <hr />
      <br />
      <Typography variant="h5">
        Activas{" "}
        <Info
          placement="right"
          className="ml-20px"
          title={
            <>
              Revisa y gestiona todos tus activos de manera centralizada.
              Visualiza su estado, rendimiento y valor, y toma decisiones
              estratégicas basadas en información actualizada.
            </>
          }
        />
      </Typography>
      <br />
      <TableInvestment />
    </PaperP>
  );

  function TableInvestment(props) {
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

    return <DynTable {...props} columns={columns} rows={rows} />;
  }
}

function Investment_actions({
  time,
  setTime,
  rechargeType,
  setRechargeType,
  packtype,
  setPacktype,
}) {
  return (
    <div className="d-flex flex-wrap gap-10px jc-space-between">
      <Investment_action_recharge {...{ rechargeType, setRechargeType }} />
      <Investment_action_invert {...{ packtype, setPacktype, time, setTime }} />
    </div>
  );
}

function Investment_action_invert({ packtype, setPacktype, time, setTime }) {
  return (
    <Investment_action
      title={
        <>
          Inversión
          <Info
            placement="right"
            className="ml-20px"
            title={
              <>
                Invierte tu dinero eligiendo el paquete y el plazo que mejor se
                ajusten a tus metas financieras. Ingresa el monto, confirma la
                operación y comienza a generar rendimientos.
              </>
            }
          />
        </>
      }
      button_action={
        <Button variant="contained" startIcon={<MonetizationOnIcon />}>
          Hacer inversión
        </Button>
      }
    >
      {generate_inputs([
        {
          placeholder: "Ingresa el monto a invertir",
          label: "Monto inversión",
          id: "money-to-invest",
        },
      ])}
      {generate_selects([
        {
          label: "Paquete",
          name: "paquete",
          value: packtype,
          setter: setPacktype,
          opns: ["Pro", "Premium"],
        },
        {
          label: "Tiempo",
          name: "tiempo",
          value: time,
          setter: setTime,
          opns: ["5 minutos", "10 minutos", "7 días", "15 días"],
        },
      ])}
    </Investment_action>
  );
}

function Investment_action_recharge({ rechargeType, setRechargeType }) {
  return (
    <Investment_action
      title={
        <>
          Recarga
          <Info
            placement="right"
            className="ml-20px"
            title={
              <>
                Añade fondos a tu cuenta de forma rápida y segura. Selecciona el
                método de recarga, ingresa el monto deseado y confirma la
                operación para disponer de tu saldo inmediatamente.
              </>
            }
          />
        </>
      }
      button_action={
        <Button variant="contained" startIcon={<PriceCheckIcon />}>
          Hacer Recarga{" "}
        </Button>
      }
    >
      {generate_selects([
        {
          label: "Tipo",
          name: "recharge",
          value: rechargeType,
          setter: setRechargeType,
          opns: ["PSE", "Nequi (ejemplo)"],
        },
      ])}
      {generate_inputs([
        {
          placeholder: "Ingresa el monto a recargar",
          label: "Monto recarga",
          id: "money-to-recharge",
        },
      ])}
    </Investment_action>
  );
}

function Investment_action({ title, children, button_action }) {
  return (
    <PaperP
      className={fluidCSS()
        .ltX(1290, {
          width: ["100%", "49.5%"],
        })
        .end()}
    >
      <Typography variant="h6">{title}</Typography>
      <br />
      <div className="d-flex flex-wrap gap-20px">{children}</div>
      <br />
      {button_action}
    </PaperP>
  );
}

export default Investment;
