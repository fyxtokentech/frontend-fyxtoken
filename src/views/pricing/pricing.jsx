import React, { useEffect, useRef, useState } from "react";

import { colorsTheme, isDark } from "@jeff-aporta/theme-manager";
import fluidCSS from "@jeff-aporta/fluidcss";
import JS2CSS from "@jeff-aporta/js2css";

import { generate_inputs, generate_selects, Info } from "@recurrent";
import { ThemeSwitcher, themeSwitch_listener } from "@templates";
import { DivM, PaperP } from "@containers";

import { Button, Chip, Paper, Typography } from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UnpublishedIcon from "@mui/icons-material/Unpublished";

import "./pricing.css";

import template from "./template.js";

const { plans, features } = template;

JS2CSS.insertStyle({
  id: "pricing-custom",
  objJs: {
    width: `calc(100% / ${plans.length})`,
    minWidth: "150px",
  },
});

//-------------------------------------

export default Pricing;

//------------ definitions ------------

function Pricing() {
  const [theme, setTheme] = useState(isDark());
  const txt = "Compara planes y características";
  document.querySelector("title").innerHTML = txt;

  useEffect(() => {
    themeSwitch_listener.push(setTheme);
  }, []);

  const subtitle_classes = isDark() ? "morado-enfasis-brillante" : "azul-agua";

  JS2CSS.insertStyle({
    id: "pricing",
    objJs: {
      ":root": {
        "--border-table": `${
          isDark() ? "hsla(81, 100%, 37%, 0.8)" : "lightgray"
        }`,
        "--border-bright-table": `${
          isDark() ? "hsla(81, 100%, 60%, 0.2)" : "transparent"
        }`,
        "--bg-table": `${
          isDark() ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.5)"
        }`,
      },
    },
  });

  return (
    <ThemeSwitcher h_fin="300px">
      <div className="overflow-hidden">
        <DivM>
          <div className="d-flex-col-center">
            <Typography variant="h2" className="mb-15px">
              Planes y precios
            </Typography>
            <Typography variant="h5">
              <b>Elige el plan perfecto para ganar</b>
            </Typography>
          </div>
          <br />
          <div
            className={fluidCSS()
              .gtX(1100, {
                justifyContent: ["space-evenly", "space-around"],
                padding: ["50px", "20px"],
              })
              .end("d-flex flex-wrap gap-20px")}
          >
            {plans
              .filter(({ important }) => important)
              .map((p, i) => {
                return <PrevCardPlan plan={p} key={i} />;
              })}
          </div>
          <DivM
            style={{
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              className={`goodtimes-rg ${
                isDark() ? "verde-lima" : "verde-cielo"
              }`}
            >
              {txt}
            </Typography>
          </DivM>
          <Paper
            id="container-pricing"
            style={{
              border: "2px solid var(--border-table)",
              overflow: "auto",
              textAlign: "center",
              position: "relative",
              maxHeight: "80vh",
            }}
          >
            <table id="pricing" cellSpacing={0} cellPadding={0}>
              <thead className="fix-top">
                <tr className="bordear">
                  <td className="no-pad p-relative">
                    <PaperP className="expand"></PaperP>
                  </td>
                  {plans.map((p, i) => (
                    <Plan plan={p} key={i} />
                  ))}
                </tr>
                <tr className="bordear">
                  <td colSpan={6} className="no-pad">
                    <PaperP>
                      <Typography
                        color="morado_enfasis"
                        className={`goodtimes-rg ${subtitle_classes}`}
                      >
                        Capacidad de uso
                      </Typography>
                    </PaperP>
                  </td>
                </tr>
              </thead>
              <tbody>
                {features.map(({ id: id_benefit, name, description }, i) => (
                  <BenefitList
                    key={i}
                    title={name}
                    cols={plans.map(({ benefits: plan_benefits }) =>
                      plan_benefits.includes(id_benefit)
                    )}
                  >
                    <Typography variant="caption">{description}</Typography>
                  </BenefitList>
                ))}
              </tbody>
            </table>
          </Paper>
        </DivM>
      </div>
    </ThemeSwitcher>
  );

  function BenefitList({ children, title, cols, ...rest }) {
    return (
      <tr className="bordear" {...rest}>
        <td className="fix-left no-pad">
          <PaperP>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="caption">{children}</Typography>
          </PaperP>
        </td>
        <Checksbenefit cols={cols} />
      </tr>
    );
  }

  function Checksbenefit({ cols }) {
    return cols.map((s, i) => {
      return (
        <td key={i}>
          <div className="d-center">
            {s ? (
              <CheckCircleIcon color="verde_lima" />
            ) : (
              <UnpublishedIcon color="cancel" />
            )}
          </div>
        </td>
      );
    });
  }

  function PrevCardPlan({ plan: { name, popular, important } }) {
    return (
      <CardPlan
        title={
          <>
            {name}{" "}
            {popular && (
              <Chip label="Popular" size="small" style={{ scale: 0.9 }} />
            )}
          </>
        }
        className={
          popular &&
          fluidCSS()
            .ltX(1150, {
              scale: [1, 1.2],
            })
            .end()
        }
        style={{
          maxWidth: "250px",
          ...(popular
            ? {
                border: "4px solid var(--border-table)",
              }
            : {}),
        }}
      >
        {important.legend}
      </CardPlan>
    );
  }

  function Plan({
    plan: {
      name,
      price: { prefix, quantity, sufix },
      description,
    },
  }) {
    return (
      <td className="no-pad">
        <PaperP className="d-flex-col-center">
          <span className="nombre-plan">{name}</span>
          <span className="precio-plan">
            {[prefix, quantity, sufix].join(" ")}
          </span>
          <Button variant="contained" size="small">
            Seleccionar
          </Button>
        </PaperP>
      </td>
    );
  }
}

function CardPlan({ title, children, index, style = {}, ...rest }) {
  return (
    <PaperP
      key={index}
      {...rest}
      style={{
        border: "2px solid " + colorsTheme().secondary.color.hex(),
        ...style,
      }}
      className="d-flex-col jc-space-between"
    >
      <div>
        <Typography variant="h4">{title}</Typography>
        <br />
        <Typography variant="caption" className="mh-20px">
          {children}
        </Typography>
      </div>
      <hr className="mh-10px" />
      <Button fullWidth variant="contained" size="small">
        Seleccionar plan
      </Button>
    </PaperP>
  );
}

function BenefitCardPlan({ title, desc }) {
  return (
    <div className="d-flex gap-10px">
      <TaskAltIcon />
      <div className="d-flex-col gap-10px">
        <small>{title}</small>
        <Typography variant="caption" color="secondary">
          {desc}
        </Typography>
      </div>
    </div>
  );
}
