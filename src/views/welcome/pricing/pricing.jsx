import React, { useEffect, useState } from "react";

import { getThemeLuminance, getThemeName, isDark } from "@jeff-aporta/camaleon";
import { fluidCSS } from "@jeff-aporta/camaleon";
import { JS2CSS } from "@jeff-aporta/camaleon";

import { addThemeChangeListener, DivM, PaperP } from "@jeff-aporta/camaleon";

import { Main } from "@theme/main.jsx";

import {
  Button,
  Chip,
  Paper,
  Typography,
  Box,
  Container,
  Grid,
} from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UnpublishedIcon from "@mui/icons-material/Unpublished";

import "./pricing.css";

import template from "./mock.js";

const { plans, features } = template;

export default function () {
  return <Pricing />;
}

function Pricing() {
  const [theme, setTheme] = useState(getThemeName() + getThemeLuminance());
  const [selectedTab, setSelectedTab] = useState("individuals");
  const pageTitle = "Planes y precios";
  document.querySelector("title").innerHTML = pageTitle;

  useEffect(() => {
    addThemeChangeListener((name, luminance) => {
      setTheme(name + luminance);
    });
  }, []);

  const subtitle_classes = isDark()
    ? "morado-enfasis-brillante"
    : "verde-cielo";

  JS2CSS.insertStyle({
    id: "pricing",
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
  });

  return (
    <Main h_fin="300px">
      <div className="overflow-hidden">
        <Container maxWidth="lg">
          {/* Encabezado */}
          <Box className="plans-section" textAlign="center" mt={4}>
            <Typography
              variant="h2"
              component="div"
              className="plans-section-title"
              gutterBottom
            >
              {pageTitle}
            </Typography>
            <Typography
              variant="h5"
              component="div"
              className="plans-section-subtitle"
            >
              Elige el plan perfecto para tu estrategia
            </Typography>

            {/* Selector de tipo de plan */}
            <Box display="flex" justifyContent="center" mt={2} mb={4}>
              <Button
                variant={
                  selectedTab === "individuals" ? "contained" : "outlined"
                }
                color="primary"
                onClick={() => setSelectedTab("individuals")}
                sx={{ mr: 1 }}
              >
                Para individuos
              </Button>
              <Button
                variant={
                  selectedTab === "organizations" ? "contained" : "outlined"
                }
                color={isDark() ? "white" : "black"}
                onClick={() => setSelectedTab("organizations")}
              >
                Para grupos
              </Button>
            </Box>
          </Box>

          {/* Tarjetas de planes destacados */}
          <Box className="pricing-cards-container">
            {plans
              .filter(({ important }) => important)
              .map((plan, index) => (
                <PricingCard key={index} plan={plan} />
              ))}
          </Box>

          {/* Tabla comparativa */}
          <Box mt={6} mb={4} textAlign="center">
            <Typography variant="h4" component="h3" color="contrast">
              Compara planes y características
            </Typography>
          </Box>

          {/* Tabla de comparación de planes */}
          <Paper id="container-pricing" className="mb-4">
            <Box className="table-responsive">
              <table className="features-table" id="pricing">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Duración</th>
                    <th>Operaciones</th>
                    <th>Ganancia</th>
                    <th>Comisión</th>
                    <th>Costo</th>
                    <th>Máx. Inversión</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan, index) => (
                    <tr key={index}>
                      <td>
                        <Typography
                          variant="body1"
                          component="div"
                          fontWeight="bold"
                        >
                          {plan.name}
                          {plan.popular && (
                            <Chip
                              label="Popular"
                              size="small"
                              color="primary"
                              sx={{ ml: 1, scale: 0.9, color: "white" }}
                            />
                          )}
                        </Typography>
                      </td>
                      <td>{plan.period}</td>
                      <td>
                        {plan.operations.quantity === -1
                          ? "Ilimitado"
                          : `${plan.operations.quantity} op. ${plan.operations.interval}`}
                      </td>
                      <td>{plan.ganancia || "-"}</td>
                      <td>{plan.comision || "-"}</td>
                      <td>
                        <Typography
                          variant="body1"
                          component="div"
                          fontWeight="bold"
                        >
                          {plan.costo ||
                            (plan.price && plan.price.quantity === 0
                              ? "Gratis"
                              : "-")}
                        </Typography>
                      </td>
                      <td>{plan.maxInversion || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>

          {/* Tabla de características */}
          <Paper id="container-pricing">
            <Box className="table-responsive">
              <table className="features-table" id="pricing">
                <thead>
                  <tr>
                    <th>Características</th>
                    {plans.map((plan, index) => (
                      <th key={index}>
                        <Typography
                          variant="body1"
                          component="div"
                          fontWeight="bold"
                        >
                          {plan.name}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={plans.length + 1} className="section-header">
                      <Typography
                        className={`goodtimes-rg ${subtitle_classes}`}
                        component="div"
                        fontWeight="bold"
                      >
                        Capacidad de uso
                      </Typography>
                    </td>
                  </tr>
                  {features.map((feature, index) => (
                    <tr key={index}>
                      <td>
                        <Typography variant="body1" component="div">
                          {feature.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          component="div"
                          color="textSecondary"
                        >
                          {feature.description}
                        </Typography>
                      </td>
                      {plans.map((plan, planIndex) => (
                        <td key={planIndex} align="center">
                          {plan.benefits &&
                          plan.benefits.includes(feature.id) ? (
                            <CheckCircleIcon className="feature-available" />
                          ) : (
                            <UnpublishedIcon className="feature-unavailable" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>

          {/* Sección de referidos */}
          <Box
            textAlign="center"
            my={6}
            p={3}
            bgcolor={isDark() ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)"}
            borderRadius={2}
          >
            <Typography variant="h5" component="div" gutterBottom>
              Refiere a un amigo o un plan de pago para ganar 500 créditos
              gratis
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Referir ahora
            </Button>
          </Box>
        </Container>
      </div>
    </Main>
  );
}

function PricingCard({ plan }) {
  const {
    name,
    price,
    period,
    popular,
    important,
    operations,
    ganancia,
    comision,
    costo,
    maxInversion,
  } = plan || {};

  return (
    <PaperP
      className={`pricing-card ${popular ? "popular" : ""}`}
      style={{
        border: popular ? `3px solid gray` : `1px solid gray`,
      }}
    >
      <div className="pricing-card-header">
        <Typography variant="h4" gutterBottom>
          {name || ""}
        </Typography>
        <div className="pricing-card-price">
          {price &&
            (price.quantity === 0
              ? "Gratis"
              : `${price.prefix || ""}${price.quantity || 0}${
                  price.sufix || ""
                }`)}
          <Typography variant="body2" className="pricing-card-period">
            {period || ""}
          </Typography>
        </div>
      </div>

      <div className="pricing-card-body">
        {important && important.legend && (
          <Typography variant="body1" component="div" paragraph>
            {important.legend}
          </Typography>
        )}

        {operations && (
          <div className="pricing-card-feature">
            <TaskAltIcon className="feature-icon" />
            <Typography variant="body2" component="div">
              <strong>Operaciones:</strong>{" "}
              {operations.quantity === -1
                ? "Ilimitadas"
                : `${operations.quantity || 0} ${operations.interval || ""}`}
            </Typography>
          </div>
        )}

        {ganancia && (
          <div className="pricing-card-feature">
            <TaskAltIcon className="feature-icon" />
            <Typography variant="body2" component="div">
              <strong>Ganancia:</strong> {ganancia}
            </Typography>
          </div>
        )}

        {comision && (
          <div className="pricing-card-feature">
            <TaskAltIcon className="feature-icon" />
            <Typography variant="body2" component="div">
              <strong>Comisión:</strong> {comision}
            </Typography>
          </div>
        )}

        {maxInversion && (
          <div className="pricing-card-feature">
            <TaskAltIcon className="feature-icon" />
            <Typography variant="body2" component="div">
              <strong>Máx. Inversión:</strong> {maxInversion}
            </Typography>
          </div>
        )}
      </div>

      <div className="pricing-card-footer">
        <Button variant="contained" color="primary" fullWidth>
          Seleccionar plan
        </Button>
      </div>
    </PaperP>
  );
}
