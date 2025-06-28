const template = {
  features: [
    {
      id: "usage_limits",
      name: "Límites de uso",
      description: "Número de operaciones permitidas",
    },
    {
      id: "api_calls",
      name: "Llamadas a la API",
      description: "Límite de llamadas a la API por mes",
    },
    {
      id: "bot_operations",
      name: "Operaciones del Bot",
      description: "Número de operaciones automatizadas",
    },
    {
      id: "telegram_notifications",
      name: "Notificaciones Telegram",
      description: "Recibe alertas en tu cuenta de Telegram",
    },
    {
      id: "advanced_strategies",
      name: "Estrategias avanzadas",
      description: "Acceso a estrategias de trading avanzadas",
    },
    {
      id: "priority_support",
      name: "Soporte prioritario",
      description: "Acceso a soporte técnico prioritario",
    },
    {
      id: "custom_indicators",
      name: "Indicadores personalizados",
      description: "Crea y utiliza indicadores personalizados",
    },
    {
      id: "backtesting",
      name: "Backtesting",
      description: "Prueba estrategias con datos históricos",
    },
    {
      id: "ai_predictions",
      name: "Predicciones con IA",
      description: "Análisis predictivo con inteligencia artificial",
    },
  ],
  plans: [
    {
      id: 0,
      name: "Paquete Básico",
      price: {
        quantity: 0,
        prefix: "",
        sufix: "",
      },
      period: "7 días",
      operations: {
        quantity: 5,
        interval: "de 1 hora",
      },
      important: {
        legend: "Perfecto para que aprendas y pruebes la plataforma sin costo"
      },
      ganancia: "10%",
      comision: "20%",
      costo: "Gratis",
      maxInversion: "$500",
      benefits: ["usage_limits", "api_calls"],
    },
    {
      id: 1,
      name: "Paquete Avanzado",
      price: {
        quantity: 10,
        prefix: "$",
        sufix: "USD",
      },
      period: "Mensual",
      operations: {
        quantity: 14,
        interval: "de 1 hora",
      },
      ganancia: "15%",
      comision: "20%",
      costo: "$10",
      maxInversion: "$1,000",
      benefits: ["usage_limits", "api_calls", "bot_operations", "telegram_notifications"],
    },
    {
      id: 2,
      name: "Paquete Pro",
      price: {
        quantity: 20,
        prefix: "$",
        sufix: "USD",
      },
      period: "Mensual",
      operations: {
        quantity: 50,
        interval: "variadas",
      },
      popular: true,
      important: {
        legend: "Ideal para traders activos que buscan automatizar sus estrategias"
      },
      ganancia: "20%",
      comision: "20%",
      costo: "$20",
      maxInversion: "$50,000",
      benefits: ["usage_limits", "api_calls", "bot_operations", "telegram_notifications", "advanced_strategies", "priority_support"],
    },
    {
      id: 3,
      name: "Paquete Élite",
      price: {
        quantity: 50,
        prefix: "$",
        sufix: "USD",
      },
      period: "Mensual",
      operations: {
        quantity: 100,
        interval: "variadas",
      },
      ganancia: "30%",
      comision: "20%",
      costo: "$50",
      maxInversion: "$100,000",
      benefits: ["usage_limits", "api_calls", "bot_operations", "telegram_notifications", "advanced_strategies", "priority_support", "custom_indicators"],
    },
    {
      id: 4,
      name: "Paquete Premium",
      price: {
        quantity: 100,
        prefix: "$",
        sufix: "USD",
      },
      period: "Mensual",
      operations: {
        quantity: -1,
        interval: "Ilimitado",
      },
      important: {
        legend: "Acceso completo a todas las funcionalidades para traders profesionales"
      },
      ganancia: "31% - 70%",
      comision: "15%",
      costo: "$100",
      maxInversion: "Ilimitado*",
      benefits: ["usage_limits", "api_calls", "bot_operations", "telegram_notifications", "advanced_strategies", "priority_support", "custom_indicators", "backtesting", "ai_predictions"],
    },
  ],
};

export default template;
