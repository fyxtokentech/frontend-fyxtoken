import { useLocation, useNavigate } from "react-router-dom";

function useSearchParams() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retorna una instancia de URLSearchParams basada en la query string actual
  const getSearchParams = () => new URLSearchParams(location.search);

  // Función para actualizar o agregar un parámetro en la URL
  const set = (name, value, stayin = false) => {
    const searchParams = getSearchParams();
    searchParams.set(name, value);
    navigate(
      { pathname: location.pathname, search: searchParams.toString() },
      { replace: stayin }
    );
  };

  // Función para obtener el valor de un parámetro de la URL
  const get = (name) => {
    const searchParams = getSearchParams();
    return searchParams.get(name);
  };

  return { set, get };
}

export default useSearchParams;
