import { useState } from "react";

import {
  PaperP,
  genInputsGender,
  TitleInfo,
  genSelectFast,
  DynTable,
} from "@jeff-aporta/camaleon";

import { Button, Tooltip, Typography } from "@mui/material";

import { custom_styles } from "../comun";

let _platform_staking_ = "";
let _currency_staking_ = "";
let _mode_ = "";

function Withdrawal() {
  const [mode, setMode] = useState(_mode_);
  _mode_ = mode;
  return (
    <PaperP elevation={0}>
      <TitleInfo
        variant="h5"
        title="Retirar dinero de tu billetera"
        information={
          <>
            Retira tu dinero de manera sencilla y segura. Selecciona tu método
            de retiro, ingresa los datos requeridos y confirma tu solicitud para
            recibir el monto en la cuenta o tarjeta seleccionada.
          </>
        }
      />
      <br />
      <PanelIWishToWithdraw {...{ mode, setMode }} />
      <br />
      <hr />
      <br />
      <PanelPendingWithdrawals />
      <br />
      <hr />
      <br />
      <PanelOfWithdrawalsMade />
    </PaperP>
  );
}

function PanelOfWithdrawalsMade() {
  return (
    <>
      <TitleInfo
        title="Retiros Realizados"
        information={
          <>
            Lista los retiros realizados, mostrando la información esencial de
            cada transacción completada para facilitar su verificación,
            seguimiento y análisis histórico.
          </>
        }
      />
      <br />
      <TableOfWithdrawalsMade />
    </>
  );

  function TableOfWithdrawalsMade(props) {
    const columns = [
      {
        field: "date",
        headerName: "Fecha",
        description: "Fecha en que se realizó la transacción",
      },
      {
        field: "type",
        headerName: "Tipo",
        description: "Tipo de transacción (por ejemplo, ingreso o egreso)",
      },
      {
        field: "amount",
        headerName: "Monto",
        description: "Monto total de la transacción",
      },
      {
        field: "destination",
        headerName: "Destino",
        description: "Cuenta o destino asociado a la transacción",
      },
      {
        field: "cost",
        headerName: "Costo",
        description: "Costo asociado a la transacción o inversión",
      },
    ];
    const rows = [
      {
        id: 0,
        date: "26/10/2024",
        type: "FIAT",
        amount: "$150.00",
        destination: "10003698",
        cost: "$0",
      },
    ];
    return <DynTable {...props} columns={columns} rows={rows} />;
  }
}

function PanelPendingWithdrawals() {
  return (
    <>
      <TitleInfo
        title="Retiros Pendientes"
        information={
          <>
            Lista los retiros pendientes, mostrando la información esencial de
            cada solicitud para facilitar su verificación, seguimiento y gestión
            oportuna.
          </>
        }
      />
      <br />
      <Table_PendingWithdrawals />
    </>
  );

  function Table_PendingWithdrawals(props) {
    const columns = [
      {
        field: "date",
        headerName: "Fecha",
        description: "Fecha en que se realizó la transacción",
      },
      {
        field: "type",
        headerName: "Tipo",
        description: "Tipo de transacción (por ejemplo, ingreso o egreso)",
      },
      {
        field: "amount",
        headerName: "Monto",
        description: "Monto total de la transacción",
      },
      {
        field: "destination",
        headerName: "Destino",
        description: "Cuenta o destino asociado a la transacción",
      },
      {
        field: "state",
        headerName: "Estado",
        description:
          "Estado actual de la transacción (aprobada, pendiente, rechazada, etc.)",
      },
    ];
    const rows = [
      {
        id: 0,
        date: "28/10/2024",
        type: "FIAT",
        amount: "$100.00",
        destination: "10003698",
        state: "Pendiente",
      },
    ];
    return <DynTable {...props} columns={columns} rows={rows} />;
  }
}

function PanelIWishToWithdraw({ mode, setMode }) {
  return (
    <PaperP>
      <div className="padb-20px">
        <TitleInfo
          title="Solicitud de Retiro"
          information={
            <>
              Completa los campos del formulario para realizar tu retiro. Una
              vez verificados tus datos, presiona 'Solicitar Retiro' para
              continuar y recibir tu dinero en la cuenta o tarjeta seleccionada.
            </>
          }
        />
      </div>
      <div
        className="inline-block padb-10px padt-5px padw-10px"
        style={custom_styles.controlInput}
      >
        <SelectModeWithDrawal mode={mode} setMode={setMode} />
      </div>
      <br />
      <br />
      <Panel_InfoFormOfWithdrawal />
      <Button_RequestWithdrawal mode={mode} />
    </PaperP>
  );

  function Panel_InfoFormOfWithdrawal() {
    if (mode) {
      return (
        <PaperP elevation={0}>
          <Typography variant="h6">Información de {mode}</Typography>
          <div className="flex flex-wrap gap-30px padh-20px">
            <ChooseForm />
          </div>
        </PaperP>
      );
    } else {
      return <PaperP elevation={0} />;
    }

    function ChooseForm() {
      return (() => {
        switch (mode) {
          case "Cuenta bancaria":
            return <CuentaBancaria />;
          case "Tarjeta Debito":
            return <TarjetaDebito />;
          case "A cuenta FIAT":
            return <CuentaFIAT />;
          case "Tarjeta Debito (Asociada)":
            return <TarjetaDebitoAsociada />;
          case "Programado":
            return <Programado />;
          case "Staking":
            return <Staking />;
          case "Wallet":
            return <Wallet />;
          case "ACH":
            return <ACH />;
          case "Corporativo":
            return <Corporativo />;
        }
      })();
    }
  }

  function Button_RequestWithdrawal({ mode }) {
    return (
      <div className="d-end mt-25px">
        <Tooltip
          title={!mode ? "Selecciona una forma de retiro" : "Realizar retiro"}
        >
          <div
            style={{
              cursor: !mode ? "not-allowed" : "",
            }}
            className="inline-block"
          >
            <Button
              disabled={!mode}
              variant="contained"
              color="l4"
              startIcon={<i className="fa-solid fa-hand-holding-dollar" />}
            >
              Solicitar Retiro
            </Button>
          </div>
        </Tooltip>
      </div>
    );
  }
}

function SelectModeWithDrawal({ mode, setMode }) {
  return genSelectFast([
    {
      label: "Modo",
      name: "withdrawal",
      value: mode,
      onChange: (e, value) => setMode(value),
      style: {
        minWidth: "250px",
      },
      opns: [
        "Cuenta bancaria",
        "Tarjeta Debito",
        "A cuenta FIAT",
        "Tarjeta Debito (Asociada)",
        "Programado",
        "Staking",
        "Wallet",
        "ACH",
        "Corporativo",
      ],
    },
  ]);
}

function Corporativo() {
  return (
    <>
      {genInputsGender([
        {
          label: "Cantidad a retirar",
          type: "number",
          name: "amount",
        },
      ])}
    </>
  );
}

function ACH() {
  return (
    <>
      {genInputsGender([
        {
          label: "Cantidad a retirar",
          type: "number",
          name: "amount",
        },
      ])}
    </>
  );
}

function Wallet() {
  return (
    <>
      {genInputsGender([
        {
          label: "Cantidad a retirar",
          type: "number",
          name: "amount",
        },
      ])}
    </>
  );
}

function Staking() {
  const [platform, setPlatform] = useState(_platform_staking_);
  const [currency, setCurrency] = useState(_currency_staking_);
  _platform_staking_ = platform;
  _currency_staking_ = currency;
  return (
    <>
      {genInputsGender([
        {
          label: "Cantidad a retirar",
          type: "number",
          name: "amount",
        },
      ])}
      {genSelectFast([
        {
          label: "Plataforma de Staking",
          name: "staking",
          value: platform,
          setter: setPlatform,
          opns: ["Plataforma 1", "Plataforma 2", "Plataforma 3"],
        },
        {
          label: "Seleccionar moneda",
          name: "currency",
          value: currency,
          setter: setCurrency,
          opns: ["USD", "EUR", "GBP"],
        },
      ])}
    </>
  );
}

function Programado() {
  return (
    <>
      {genInputsGender([
        {
          label: "Cantidad a retirar",
          type: "number",
          name: "amount",
        },
        {
          label: "Fecha de retiro",
          type: "date",
          name: "withdrawal_date",
        },
      ])}
    </>
  );
}

function TarjetaDebitoAsociada() {
  return (
    <>
      {genInputsGender([
        {
          label: "Cantidad a retirar",
          type: "number",
          name: "amount",
        },
      ])}
    </>
  );
}

function CuentaFIAT() {
  return (
    <>
      {genInputsGender([
        {
          label: "Cantidad a retirar",
          type: "number",
          name: "amount",
        },
        {
          label: "Número de cuenta",
          type: "text",
          name: "account_number",
        },
      ])}
    </>
  );
}

function TarjetaDebito() {
  return (
    <>
      {genInputsGender([
        {
          label: "Número de tarjeta",
          type: "text",
          name: "card_number",
        },
        {
          label: "CVV",
          type: "text",
          name: "cvv",
        },
      ])}
    </>
  );
}

function CuentaBancaria() {
  return (
    <>
      {genInputsGender([
        {
          label: "Número de cuenta",
          type: "text",
          name: "account_number",
        },
        {
          label: "Nombre del titular",
          type: "text",
          name: "account_holder_name",
        },
        {
          label: "Número de tarjeta",
          type: "text",
          name: "card_number",
        },
        {
          label: "CVV",
          type: "text",
          name: "cvv",
        },
        {
          label: "Fecha de expiración (MM/AA)",
          type: "text",
          name: "expiration_date",
        },
      ])}
    </>
  );
}

export default Withdrawal;
