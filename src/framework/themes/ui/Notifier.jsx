import React, { Component } from "react";

import {
  Typography,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";

import { getSecondaryColor } from "../rules/manager/manager.selected.js";
import { DriverComponent } from "../../tools/DriverComponent.js";

const SUCCESS_ICON = <CheckCircleIcon color="success" fontSize="small" />;
const WARNING_ICON = <WarningAmberIcon color="warning" fontSize="small" />;
const ERROR_ICON = <ErrorIcon color="error" fontSize="small" />;
const INFO_ICON = <InfoIcon color="info" fontSize="small" />;
const LOADING_ICON = <CircularProgress size={16} color="contrastPaperBOW" />;

const driverNotifier = DriverComponent({
  idDriver: "notifier-camaleon",
  DURATION: 10_000,
  MAX_DURATION: 100_000_000,
  notifierBox: {},
  notify: {
    isArray: true,
    getByID(id, { getValue }) {
      return getValue().find((item) => item.id == id);
    },
    remove(id, { getValue, setValue, remove, getByID }) {
      const notification = getByID(id);
      if (notification) {
        const listNotify = [...getValue()];
        listNotify.splice(listNotify.indexOf(notification), 1);
        setValue(listNotify);
      }
    },
    send(
      { id = Date.now(), duration, ...props },
      { getValue, exists, update, send, remove, DURATION, push }
    ) {
      if (!duration) {
        duration = DURATION;
      }
      if (typeof duration !== "number") {
        console.warn("sendNotify: DURATION must be a number", DURATION);
        duration = DURATION;
      }
      push({
        id,
        ...props,
      });
      setTimeout(() => {
        remove(id);
      }, duration);
    },
  },
});

export function getNotify(id) {
  return driverNotifier.getByIDNotify(id);
}

export function sendNotify(props) {
  driverNotifier.sendNotify(props);
}

export function removeNotify(id) {
  driverNotifier.removeNotify(id);
}

export function removeAllNotify() {
  driverNotifier.removeAllNotify();
}

export class NotifierBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    driverNotifier.addLinkNotify(this);
    driverNotifier.setNotifierBox(this);
  }
  componentWillUnmount() {
    driverNotifier.removeLinkNotify(this);
  }
  render() {
    const { position = "bottom-right" } = this.props;
    const notifies = driverNotifier.getNotify();
    return (
      <div
        className="NotifierBox fixed flex col-direction-reverse gap-10px z-notifier"
        style={{
          transition: "all 0.5s ease-in-out",
          interpolateSize: "allow-keywords",
          ...(() => {
            const RETURN = {};
            const [x, y] = position.split("-");
            if (x == "bottom") {
              RETURN.bottom = "10px";
            } else if (x == "top") {
              RETURN.top = "10px";
            }
            if (y == "left") {
              RETURN.left = "10px";
            } else if (y == "right") {
              RETURN.right = "10px";
            }
            return RETURN;
          })(),
        }}
      >
        {notifies.length > 1 ? (
          <Button
            variant="contained"
            onClick={() => {
              const n = document.querySelector(".NotifierBox");
              if (n) {
                n.classList.add("fadeout-90", "ghost");
                n.style["--animation-duration"] = "2s";
              }
              setTimeout(() => {
                removeAllNotify();
                n.classList.remove("fadeout-90", "ghost");
              }, 3000);
            }}
          >
            <Typography variant="caption" className="uppercase">
              Cerrar todo
            </Typography>
          </Button>
        ) : null}
        <div
          style={{
            maxHeight: "calc(93dvh - 20px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {notifies.map(({ id, jsx, icon, duration, classes, style }) => {
            return (
              <Alert
                icon={false}
                key={id}
                color="secondary"
                className={`
                  Notify-item 
                  flex nowrap
                  align-center justify-space-between 
                  gap-10px padh-5px padw-15px
                  fadeout-90
                  ${classes}
                `.replace(/\s+/g, " ")}
                elevation={12}
                style={{
                  "--animation-duration": `${duration}ms`,
                  border: `1px solid ${getSecondaryColor()}`,
                  ...style,
                }}
                onClose={() => removeNotify(id)}
              >
                <div className="flex align-center gap-10px">
                  {icon}
                  {jsx}
                </div>
              </Alert>
            );
          })}
        </div>
      </div>
    );
  }
}

function TextNotify({ children }) {
  return <Typography variant="caption">{children}</Typography>;
}

export function showJSX(jsx, icon, duration) {
  if (!jsx) {
    return;
  }
  if (typeof jsx === "string") {
    jsx = <TextNotify>{jsx}</TextNotify>;
  }
  sendNotify({
    jsx,
    icon,
    duration,
  });
}

export function showSuccess(text, duration) {
  showJSX(
    GenerateNotificationMessage({ text, icon: SUCCESS_ICON }),
    null,
    duration
  );
}

export function showWarning(
  text,
  { showConsole = true, ...details } = {},
  duration
) {
  if (showConsole) {
    console.warn(...[text, details].filter(Boolean));
  }
  showJSX(
    GenerateNotificationMessage({ text, icon: WARNING_ICON }),
    null,
    duration
  );
}

export function showError(
  text,
  { showConsole = true, ...details } = {},
  duration
) {
  if (showConsole) {
    console.error(...[text, details].filter(Boolean));
  }
  showJSX(
    GenerateNotificationMessage({ text, icon: ERROR_ICON }),
    null,
    duration
  );
}

export function showInfo(text, duration) {
  showJSX(
    GenerateNotificationMessage({ text, icon: INFO_ICON }),
    null,
    duration
  );
}

function GenerateNotificationMessage({ text, icon }) {
  return (
    <div className="flex align-center gap-10px min-w-300px">
      {icon}
      <TextNotify>{text}</TextNotify>
    </div>
  );
}

function LoadingJSXPromise(text) {
  return GenerateNotificationMessage({ text, icon: LOADING_ICON });
}

function SuccessJSXPromise(text) {
  return GenerateNotificationMessage({ text, icon: SUCCESS_ICON });
}

function ErrorJSXPromise(text) {
  return GenerateNotificationMessage({ text, icon: ERROR_ICON });
}

function WarningJSXPromise(text) {
  return GenerateNotificationMessage({ text, icon: WARNING_ICON });
}

function InfoJSXPromise(text) {
  return GenerateNotificationMessage({ text, icon: INFO_ICON });
}

export function showPromise(loading = "Procesando...", promise, duration) {
  if (!promise) {
    console.error("showPromise: 'promise' es requerido");
    return;
  }
  if (typeof promise.then !== "function") {
    if (typeof promise === "function") {
      promise = new Promise(promise);
    } else {
      console.error("showPromise: 'promise' no se puede procesar", promise);
      return;
    }
  }

  const loadingId = Date.now();
  sendNotify({
    id: loadingId,
    duration: driverNotifier.MAX_DURATION,
    jsx: typeof loading === "string" ? LoadingJSXPromise(loading) : loading,
    showCloseButton: true,
  });

  // Cuando la promesa finalice, actualizamos la MISMA notificación

  promise
    .then((msg) => {
      if (msg && msg.error) {
        return fromMsg(msg, "error");
      }
      fromMsg(msg, "success");
    })
    .catch((msg) => {
      fromMsg(msg, "error");
    });

  return promise; // permitimos al consumidor encadenar

  function fromMsg(msg, typeDefault) {
    if (!msg) {
      removeNotify(loadingId);
      return;
    }
    const { type = typeDefault, message } = msg;
    if (message) {
      msg = message;
    }
    const notify = getNotify(loadingId);
    if (notify) {
      notify.jsx = fromType(msg, type) || msg;
      driverNotifier.updateNotifierBox();
      notify.duration = driverNotifier.DURATION;
      setTimeout(() => removeNotify(loadingId), driverNotifier.DURATION);
    }
  }

  function fromType(msg, type) {
    if (typeof msg !== "string") {
      return;
    }
    switch (type) {
      case "success":
        return SuccessJSXPromise(msg);
      case "warning":
        return WarningJSXPromise(msg);
      case "info":
        return InfoJSXPromise(msg);
      case "error":
        return ErrorJSXPromise(msg);
    }
  }
}
