import { useLocation, useNavigate } from "react-router-dom";

function useSearchParams() {
  const location = useLocation();
  const navigate = useNavigate();

  const getSearchParams = () => new URLSearchParams(location.search);

  const set = (name, value, options = {}) => {
    if(!value || !name){
      return;
    }
    const searchParams = getSearchParams();
    searchParams.set(name, encodeURIComponent(value));
    const { replaceHistory = false, reload = false } = options;
    if (reload) {
      window.location.href = [
        window.location.pathname,
        searchParams.toString(),
      ].join("?");
      return;
    }
    navigate(
      {
        pathname: location.pathname,
        search: searchParams.toString(),
      },
      { replace: replaceHistory }
    );
  };

  const get = (name) => {
    const searchParams = getSearchParams();
    const value = searchParams.get(name);
    if(value){
      return decodeURIComponent(value);
    }
  };

  return { set, get };
}

export default useSearchParams;
