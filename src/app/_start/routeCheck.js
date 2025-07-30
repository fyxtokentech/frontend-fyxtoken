function authError([first, second]) {
  const user = window["currentUser"];
  if (!user) {
    if (first === "users") {
      if (second !== "login") {
        return `
          Debes iniciar sesión,
          para acceder al módulo de usuarios (/users)
        `;
      }
    }
    if (first === "dev") {
      return `
        Debes iniciar sesión,
        para acceder al módulo de desarrolladores (/dev)
      `;
    }
  } else {
    if (first === "users") {
      if (second == "login") {
        return `
          Ya se inició sesión, 
          no puedes acceder al módulo de inicio de sesión (/users/login)
        `;
      }
    }
  }
}

export function routeCheck({
  querypath: path = () => 0, // Por defecto evita errores
}) {
  if (!path) {
    return; // No debe retornar error
  }

  const segments = (() => {
    if (Array.isArray(path)) {
      return path;
    }
    return path.split("/").filter(Boolean);
  })();

  return (
    authError(segments) ?? // Encontró error de autenticación
    false // No encontró error
  );
}
