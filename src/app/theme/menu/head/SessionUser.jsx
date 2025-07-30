import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  ListItemIcon,
  Avatar,
} from "@mui/material";

import { NavigationLink } from "@jeff-aporta/camaleon";
import { handleLogout, isLogged, isLoginPage, user } from "./head";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Link from "@mui/material/Link";

export function SessionUser() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogoutAndClose = () => {
    handleLogout();
    handleClose();
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          gap: 2,
        }}
      >
        {!isLoginPage() && !isLogged && (
          <NavigationLink to="/users/login">
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<LoginIcon />}
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Inicia sesión
            </Button>
          </NavigationLink>
        )}
        {isLogged && (
          <>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleClick}
              sx={{ textTransform: "none", fontWeight: "bold" }}
              endIcon={<AccountCircleIcon />}
            >
              {[user.name, user.last_name].filter(Boolean).join(" ")}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <NavigationLink to="@wallet">
                <MenuItem onClick={handleClose}>
                  Wallet
                  <AccountBalanceWalletIcon fontSize="small" sx={{ ml: 1 }} />
                </MenuItem>
              </NavigationLink>
              <MenuItem onClick={handleLogout}>
                Cerrar sesión
                <LogoutIcon fontSize="small" sx={{ ml: 1 }} />
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>
    </>
  );
}
