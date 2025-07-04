import React from "react";
import { getModelsFormat } from "@jeff-aporta/camaleon";

// Importar iconos necesarios
import StatusOkIcon from "@mui/icons-material/CheckCircleOutline"; // Para Active
import StatusErrorIcon from "@mui/icons-material/UnpublishedOutlined"; // Para Revoked o Error
import KeyIcon from "@mui/icons-material/VpnKey"; // Icono representativo para la clave API
// import PermissionsIcon from '@mui/icons-material/Rule'; // Icono para permisos (Eliminado)
import { Chip } from "@mui/material";

const columns_user_apis = [
  // --- Columnas con Iconos / Formato Especial Primero ---
  {
    field: "status", // 1. Estado (Importante saber si está activa o no)
    headerName: "Estado",
    description: "Estado actual de la clave API.",
    renderInfo: {
      label: {
        Active: { text: "Activa", icon: <StatusOkIcon />, color: "ok" },
        Revoked: {
          text: "Revocada",
          icon: <StatusErrorIcon />,
          color: "error",
        },
      },
    },
  },

  // --- Otras Columnas Visibles (Ordenadas por Relevancia) ---
  {
    field: "api_key", // 2. La clave en sí (o su alias/parte visible)
    headerName: "Clave API",
    description:
      "La clave API generada para el usuario (puede mostrarse parcialmente).",
    renderCell: (params) => (
      <span>
        {params.value
          ? `${params.value.substring(0, 4)}...${params.value.substring(
              params.value.length - 4
            )}`
          : "N/A"}
      </span>
    ),
  },
  {
    field: "last_used", // 4. Cuándo se usó por última vez
    headerName: "Último Uso",
    description: "Fecha y hora del último uso registrado de la clave API.",
    ...getModelsFormat().datetime,
  },
  {
    field: "activation_date", // 5. Fecha de activación de la clave API
    headerName: "Fecha Activación",
    description: "Fecha y hora en que la clave API fue activada.",
    ...getModelsFormat().datetime,
  },
  {
    field: "user_id", // 6. A quién pertenece (menos relevante si el usuario ve sus propias claves)
    headerName: "ID Usuario",
    description: "Identificador del usuario propietario de la clave API.",
  },

  // --- Columnas Ocultas / Internas ---
  {
    field: "id",
    headerName: "ID API",
    description: "Identificador único de la clave API.",
    inTable: false,
  },
  {
    field: "create_date", // Proveniente del mock renombrado
    headerName: "Fecha SQL",
    description: "Fecha SQL.",
    inTable: false, // Oculta porque 'exclude: true'
    exclude: true, // No relevante para mostrar directamente en tabla
    ...getModelsFormat().datetime,
  },
];

export default columns_user_apis;
