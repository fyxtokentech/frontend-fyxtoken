const template = {
  features: [
    {
      id: 0,
      name: "Beneficio 1",
      description: "descripción del beneficio",
    },
    {
      id: 1,
      name: "Beneficio 2",
      description: "descripción del beneficio",
    },
    {
      id: 2,
      name: "Beneficio 3",
      description: "descripción del beneficio",
    },
    {
      id: 3,
      name: "Beneficio 4",
      description: "descripción del beneficio",
    },
    {
      id: 4,
      name: "Beneficio 5",
      description: "descripción del beneficio",
    },
  ],
  plans: [
    {
      id: 0,
      name: "Básico",
      price: {
        quantity: 0, // Gratis
      },
      period: "7 Días",
      operations: {
        quantity: 5,
        interval: "1 hora",
      },
      important: {
        legend: `Perfecto para que aprendas`
      },
      benefits: [0], // los id's de los beneficios incluidos
    },
    {
      id: 1,
      name: "Avanzado",
      price: {
        quantity: 10,
        prefix: "$",
        sufix: "USD",
      },
      period: "Mensual",
      operations: {
        quantity: 14,
        interval: "1 hora",
      },
      benefits: [0, 1], // los id's de los beneficios incluidos
    },
    {
      id: 2,
      name: "Pro",
      price: {
        quantity: 20,
        prefix: "$",
        sufix: "USD",
      },
      period: "Mensual",
      operations: {
        quantity: 50,
        interval: "", // Variado
      },
      popular: true,
      important: {
        legend: `Empieza a ganar potenciado con nuestro Bot`
      },
      benefits: [0, 1, 2], // los id's de los beneficios incluidos
    },
    {
      id: 3,
      name: "Élite",
      price: {
        quantity: 50,
        prefix: "$",
        sufix: "USD",
      },
      period: "Mensual",
      operations: {
        quantity: 100,
        interval: "", // Variado
      },
      benefits: [0, 1, 2, 3], // los id's de los beneficios incluidos
    },
    {
      id: 4,
      name: "Premium",
      important: {
        legend: `Nuestro Bot al máximo`
      },
      price: {
        quantity: 100,
        prefix: "$",
        sufix: "USD",
      },
      period: "Anual",
      operations: {
        quantity: -1, // Ilimitado
      },
      benefits: [0, 1, 2, 3, 4], // los id's de los beneficios incluidos
    },
  ],
};

export default template;
