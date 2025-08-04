import React, { Component } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  Button,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { DriverComponent } from "../../tools/DriverComponent.js";
import { TooltipGhost, InputNumberDot } from "./components/index.js";
import { AddSVGFilter } from "../../graphics/index.js";
import { Color } from "../rules/colors.js";

import {
  getPrimaryColor,
  getSecondaryColor,
  isDark,
} from "../rules/manager/index.js";

import { ENTER } from "../../events/events.ids.js";

const driverDialog = DriverComponent({
  idDriver: "prompt-dialog-camaleon",
  dialog: {
    isComponent: true,
    show(props) {
      return this.showPromptDialog({
        ...props,
        dividerTitleBody: null,
        showCancelButton: false,
        input: "confirm",
      });
    },
    showPrompt(props) {
      const { input } = props;
      const okcancel = ["okcancel", "ok/cancel", "confirm"];
      return new Promise((resolve) => {
        open({
          ...props,
          onSuccess: (value) => {
            if (okcancel.includes(input)) {
              value = true;
            }
            resolve({ status: "confirmed", success: true, value });
          },
          onCancel: (value) => {
            console.log("onCancel", value);
            if (okcancel.includes(input)) {
              value = false;
            }
            resolve({ status: "canceled", success: false, value });
          },
        });
      });
    },
  },
});

function open(props) {
  driverDialog.getDialog().open(props);
}

export function showDialog(props) {
  return driverDialog.showDialog(props);
}

export function showPromptDialog(props) {
  return driverDialog.showPromptDialog(props);
}

export class PromptDialog extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      inputValue: "",
      open: false,
      validationError: null,
      formData: {},
    };
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  open(props) {
    console.log(props);
    this.setState({
      inputValue: props.value || "",
      validationError: null,
      formData: {},
      ...props,
      open: true,
    });
  }

  onClose() {
    this.setState({ inputValue: "", open: false });
  }

  handleConfirm() {
    this.setState({ validationError: null });
    const { inputValue, onValidate, input, onSuccess } = this.state;
    let payload;
    if (React.isValidElement(input)) {
      const formEl = this.formRef.current;
      const formData = new FormData(formEl);
      payload = Object.fromEntries(formData.entries());
    } else {
      payload = inputValue;
    }

    const callback = onSuccess;
    if (onValidate) {
      const validationResult = onValidate(payload);
      if (!validationResult) {
        this.setState({ validationError: "error en la validación" });
        return;
      }
      switch (typeof validationResult) {
        case "object":
          this.setState({
            validationError:
              validationResult.message || "error en la validación",
          });
          return;
        case "string":
          this.setState({ validationError: validationResult });
          return;
      }
    }
    if (callback) {
      callback(payload);
    }
    this.onClose();
  }

  handleCancel() {
    const callback = this.state.onCancel;
    if (callback) {
      callback();
    }
    this.onClose();
  }

  handleChange(e) {
    this.setState({ inputValue: e.target.value });
  }

  handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    this.setState((prev) => ({
      formData: {
        ...prev.formData,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  }

  componentDidMount() {
    driverDialog.setDialog(this);
    AddSVGFilter(({ escapeSVGString }) => [
      {
        id: "effect-glass",
        body: [
          {
            type: "feImage",
            xlinkHref: escapeSVGString({
              width: 9999,
              height: 9999,
              body: `<rect 
                width="100%" 
                height="100%" 
                fill="black" 
              />`,
            }),
            result: "img3",
          },
          {
            type: "feDisplacementMap",
            scale: "30",
            xChannelSelector: "R",
            yChannelSelector: "G",
            in2: "img3",
            in: "SourceGraphic",
          },
        ],
      },
    ]);
  }

  render() {
    const {
      value,
      open,
      title,
      description,
      validationError,
      onValidate,
      input = "text",
      min,
      max,
      step,
      positive,
      Actions = () => null,
      footer,
      showConfirmButton = true,
      showCancelButton = true,
      showCloseButton = true,
      confirmText = "aceptar",
      cancelText = "cancelar",
      label = "Valor",
      variantConfirmButton = "contained",
      colorConfirmButton = "contrastPaper",
      variantCancelButton,
      colorCancelButton = "secondary",
      model,
      dividerTitleBody = <Divider />,
      ...rest
    } = this.state;

    return (
      <Dialog
        open={open}
        onClose={this.handleCancel}
        disablePortal
        container={document.body}
        {...processModel({ model, ...rest })}
      >
        <DialogTitle sx={{ m: 0, pr: 10 }}>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          {showCloseButton && (
            <TooltipGhost title="Cerrar" onClick={this.handleCancel}>
              <IconButton
                color="closePaper"
                size="small"
                onClick={this.handleCancel}
                sx={{ position: "absolute", right: "5px", top: "5px" }}
              >
                <CloseIcon />
              </IconButton>
            </TooltipGhost>
          )}
        </DialogTitle>
        {dividerTitleBody}
        <DialogContent>
          {validationError && (
            <Alert
              severity={
                ["error", validationError.severity][+!!validationError.severity]
              }
            >
              {
                [validationError, validationError.message][
                  +!!validationError.message
                ]
              }
            </Alert>
          )}
          {description && (
            <Typography variant="body2" component="div">
              {(() => {
                if (typeof description == "function") {
                  return description();
                }
                return description;
              })()}
              <br />
              <br />
            </Typography>
          )}

          {(() => {
            if (React.isValidElement(input)) {
              return (
                <Box
                  component="form"
                  ref={this.formRef}
                  onSubmit={(e) => {
                    e.preventDefault();
                    this.handleConfirm();
                  }}
                >
                  {input}
                </Box>
              );
            }

            switch (input) {
              case "confirm":
              case "okcancel":
              case "ok/cancel":
                return null;
              case "number":
                return (
                  <InputNumberDot
                    autoFocus
                    fullWidth
                    value={value || 0}
                    min={min}
                    max={max}
                    step={step}
                    positive={positive}
                    label={label}
                    onChange={({newValue}) => {
                      this.setState({
                        inputValue: newValue,
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.keyCode === ENTER) {
                        e.preventDefault();
                        document.getElementById("buttonConfirmOnPromptDialog").click();
                        return true;
                      }
                    }}
                  />
                );
              case "boolean":
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="toBOW50"
                        checked={value}
                        onChange={(e) =>
                          this.setState({ inputValue: e.target.checked })
                        }
                      />
                    }
                    label={label}
                  />
                );
              case "text":
              case undefined:
                return (
                  <TextField
                    autoFocus
                    margin="dense"
                    fullWidth
                    value={value || ""}
                    onChange={this.handleChange}
                    onKeyDown={(e) => {
                      if (e.keyCode === ENTER) {
                        this.handleConfirm();
                      }
                    }}
                    label={label}
                    variant="outlined"
                  />
                );
              default:
                return null;
            }
          })()}
          {footer}
        </DialogContent>
        <DialogActions>
          <Actions
            handleClose={this.handleCancel}
            handleConfirm={this.handleConfirm}
          />
          {showCancelButton && (
            <Button
              onClick={this.handleCancel}
              color={colorCancelButton}
              variant={variantCancelButton}
            >
              {cancelText}
            </Button>
          )}
          <Button
          id="buttonConfirmOnPromptDialog"
            onClick={this.handleConfirm}
            variant={variantConfirmButton}
            color={colorConfirmButton}
            className={showConfirmButton ? "" : "d-none"}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
function processModel({ model, BackdropProps = {}, PaperProps = {} }) {
  if (model) {
    [BackdropProps, PaperProps].forEach((item) => {
      if (!item.style) {
        item.style = {};
      }
    });
  }
  switch (model) {
    case "glass":
      Object.assign(BackdropProps.style, {
        background: `rgba(${[Color("white"), Color("black")][+isDark()]
          .array()
          .join(",")}, 0.4)`,
      });
      const op_lumin = [0.5, 1][+isDark()];
      Object.assign(PaperProps.style, {
        boxShadow: Array.from(
          [{ radius: 3, color: Color("gray") }, { radius: 7 }, { radius: 20 }],
          ({ radius, color }) =>
            `inset 0 0 ${radius}px rgba(${(
              color || [getPrimaryColor(), Color("white")][+isDark()]
            )
              .array()
              .join(",")}, ${0.3 * op_lumin})`
        ).join(","),
        border: `2px solid rgba(${getSecondaryColor()
          .rgb()
          .array()
          .join(",")},${op_lumin})`,
        background: `rgba(${[Color("white"), getPrimaryColor()][+isDark()]
          .rgb()
          .array()
          .join(",")},
          0.2
        )`,
        backdropFilter: `url(#effect-glass) brightness(1.2) contrast(${
          1 + 0.02 * [1, -1][+isDark()]
        }) blur(1px)`,
      });
  }

  return { BackdropProps, PaperProps };
}
