import React from "react";
import { PaperP, TitleInfo } from "@jeff-aporta/camaleon";
import {MovementsGraph} from "@components/graph/graph-driver";

function Movements() {
  return (
    <PaperP elevation={0}>
      <TitleInfo
        variant="h5"
        title="Historial de movimientos"
        information={
          <>
            Consulta y analiza tus transacciones pasadas para llevar un registro
            claro de depósitos, retiros y otros movimientos.
          </>
        }
      />
      <br />
      <MovementsGraph />
    </PaperP>
  );
}

export default Movements;
