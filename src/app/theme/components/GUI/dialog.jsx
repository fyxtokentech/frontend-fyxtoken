import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Theme } from "@jeff-aporta/theme-manager";

import { useState } from "react";

function FyxDialog(props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { children, text, title_text, button_text } = props;

  return (
    <>
      <div
        {...props}
        className={`d-inline-block ${props.className ?? ""}`}
        onClick={handleClickOpen}
      >
        {children}
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title_text}</DialogTitle>
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            {button_text ?? "Entendido"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FyxDialog;
