import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Theme } from "@jeff-aporta/theme-manager";

import { useState } from "react";
import { Chip, Tooltip, Typography } from "@mui/material";

export default FyxDialog;

function FyxDialog(props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { children, text, title_text, button_text, placement } = props;

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
        <DialogTitle>
          <Chip label={title_text} />
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">{text}</Typography>
        </DialogContent>
        <DialogActions className="mt-20px">
          <Button variant="contained" onClick={handleClose}>
            {button_text ?? "Entendido"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
