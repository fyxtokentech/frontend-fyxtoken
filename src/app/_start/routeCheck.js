function authError([first, second]) {
  const user = window["currentUser"];
  if (!user) {
    if (first === "users") {
      if (second !== "login") {
        return {
          error: true,
          message: "Debes iniciar sesión para acceder a Usuarios",
        };
      }
    }
    if (first === "dev") {
      return {
        error: true,
        message: "Debes iniciar sesión para acceder a Dev",
      };
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
