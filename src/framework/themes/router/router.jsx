import React, { Component } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { getUseViewId } from "./storage.js";
import {
  setSettingsView,
  restartSettingsView,
  href,
} from "../rules/manager/index.js";
import { Button, Link } from "@mui/material";
import { subscribeParam, driverParams, _setURLParams } from "./params.js";
import { buildHref, hrefManagement } from "./builder.js";
import {
  setComponentsContext,
  _setRoutesAvailable,
  setCustomRoutes,
  mapGenerateComponents,
  getRoutesAvailable,
} from "./context.js";
import {
  inferMAIN_FOLDER,
  evaluateIndex,
  inferirIntension,
  evaluate404,
  evaluateFn,
  limpiarIgnorados,
} from "./inference.js";
import { JS2CSS } from "../../fluidCSS/JS2CSS/index.js";
import { VIEW_ID } from "../constants.js";
import { removeAllNotify } from "../ui/Notifier.jsx";

let querypath = "";
let assignedpath = "";

export function RoutingManagement(props) {
  return (
    <BrowserRouter>
      <RoutingManagement_ {...props} />
    </BrowserRouter>
  );
}
const fades = {
  time: 0,
  fadeIn: {},
  fadeOut: {},
};

export function getFadeInfo() {
  return fades;
}

export function setTransition({
  fadein = {},
  fadeout = {},
  fade = {},
  time = 200,
}) {
  Object.assign(fades.fadeIn, fadein);
  Object.assign(fades.fadeOut, fadeout);
  Object.assign(fades.fadeIn, fade);
  Object.assign(fades.fadeOut, fade);
  fades.time = time * 1.1;
}

export class RoutingManagement_ extends Component {
  constructor(props) {
    super(props);
    subscribeParam(
      {
        [VIEW_ID]: () => {
          setTimeout(() => {
            JS2CSS.insertStyle({
              id: "effect-change-view-id",
              ".CamaleonAppThemeProvider": fades.fadeOut,
            });
          });
          this.hidding = true;
          removeAllNotify();
          this.forceUpdate();
          setTimeout(() => {
            this.hidding = false;
            this.forceUpdate();
          }, 0.5 * fades.time);
        },
      },
      this
    );
  }

  componentDidUpdate() {
    setTimeout(() => {
      JS2CSS.insertStyle({
        id: "effect-change-view-id",
        ".CamaleonAppThemeProvider": fades.fadeIn,
      });
      setTimeout(() => {
        JS2CSS.insertStyle({
          id: "effect-change-view-id",
          ".CamaleonAppThemeProvider": {},
        });
      }, 1.3 * fades.time);
    }, fades.time);
  }

  componentDidMount() {
    this.addParamListener();
  }

  componentWillUnmount() {
    this.removeParamListener();
  }

  render() {
    const { ...props } = this.props;
    if (this.hidding) {
      return <></>;
    }
    return (
      <Routes>
        <Route path="/" element={<RouteComponent {...props} />} />
        {Array.from({ length: 20 }).map((_, i) => {
          const segments = Array.from(
            { length: i + 1 },
            (_, idx) => `:node${idx + 1}`
          );
          return (
            <Route
              key={i}
              path={`/${segments.join("/")}`}
              element={<RouteComponent {...props} />}
            />
          );
        })}
      </Routes>
    );
  }
}

function RouteComponent({
  componentsContext,
  customRoutes = {},
  startIgnore = [],
  routeCheck = () => 0, // Función verificadora de errores en ruta
  componentError = () => 0, // Componente a mostrar si hubo error
}) {
  const view_id = driverParams.getOne(VIEW_ID);
  setComponentsContext(componentsContext);
  setCustomRoutes(customRoutes);
  _setRoutesAvailable(mapGenerateComponents());

  const params = useParams();
  const nodes = (
    view_id
      ? view_id.split("/")
      : Array.from(
          {
            length: 10,
          },
          (_, n) => params[`node${n + 1}`]
        )
  ).filter(Boolean);
  querypath = nodes.join("/");
  assignedpath = querypath;

  const href = hrefManagement(querypath).view;
  if (href != querypath) {
    window.location.href = buildHref(href);
    return;
  }

  let check = routeCheck({
    querypath,
  });

  if (check) {
    if (typeof check != "object") {
      check = { message: check };
    }
    check.message = check.message.replace(/\s+/g, " ");
    return (
      componentError(check) ||
      (() => {
        const unauthEl = resolvePath(inferMAIN_FOLDER("unauthorize"));
        return React.cloneElement(unauthEl, { ...check });
      })()
    );
  }

  const cleanedNodes = limpiarIgnorados(nodes, startIgnore);
  const index = evaluateIndex(cleanedNodes);
  if (index) {
    querypath = index;
  }
  let path = inferirIntension(querypath, cleanedNodes);
  path = evaluate404(path);

  return resolvePath(path);

  function resolvePath(path) {
    const handlerReturn = evaluateFn(path);
    const routeEntry = getRoutesAvailable()[path];
    if (routeEntry) {
      const { settings = {} } = routeEntry.component;
      setSettingsView(settings);
    }
    if (handlerReturn) {
      return handlerReturn;
    }
    if (routeEntry?.main) {
      const MainComp = routeEntry.main;
      return <MainComp />;
    }
    return <h1>Imposible de resolver</h1>;
  }
}

export function getQueryPath() {
  return querypath;
}

export function getAssignedPath() {
  return assignedpath;
}

export function NavigationLink({
  to,
  scrolltop = true,
  target = "_self",
  children,
  disabled = false,
  className = "",
  underline = "hover",
  color = "toPaperBOW50",
  colorDisabled = "toGray25",
  isButton = false,
  startIcon,
  ...rest
}) {
  const navigate = useNavigate();
  to = hrefManagement(to);
  const url = buildHref(to);

  const handleClick = (e) => {
    e.preventDefault();
    if (disabled) {
      return;
    }
    const view_Id = driverParams.getOne(VIEW_ID);
    if (to.view != view_Id) {
      if (view_Id) {
        _setURLParams("replaceState", url);
      } else {
        const isExternal = url.startsWith("http");
        if (target == "_self" || !isExternal) {
          navigate(url, { replace: true });
        } else {
          window.open(url, target);
        }
      }
    }
    scrolltop && window.scrollTo(0, 0);
  };

  let cursor = "";

  if (disabled) {
    cursor = "pointer-not-allowed";
    underline = "always";
    color = colorDisabled;
  } else {
    if (target != "_self") {
      cursor = "pointer-alias";
    }
  }

  if (isButton) {
    return (
      <Button
        className={className}
        variant="contained"
        color={color}
        startIcon={startIcon}
        onClick={handleClick}
        href={url}
        disabled={disabled}
        {...rest}
      >
        {children}
      </Button>
    );
  }

  return (
    <Link
      className={[cursor, className].filter(Boolean).join(" ")}
      href={url}
      onClick={handleClick}
      underline={underline}
      color={color}
      {...rest}
    >
      {children}
    </Link>
  );
}
