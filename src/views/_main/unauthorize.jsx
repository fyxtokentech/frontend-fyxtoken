import React, { useState, useEffect, Component } from "react";
import {
  PaperP,
  driverParams,
  href,
  showError,
  NavigationLink,
} from "@jeff-aporta/camaleon";
import {
  Button,
  CircularProgress,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { Main } from "@theme/main.jsx";
import HomeIcon from "@mui/icons-material/Home";

export default (props) => <Unauthorize {...props} />;

export const settings = {
  subtitle: "Sin acceso",
  theme: { name: "darkred", luminance: "dark" },
};

class Unauthorize extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if (this.props.message) {
      showError(this.props.message, { showConsole: false });
    }
  }
  render() {
    return (
      <Main bgtype="portal" h_init="0">
        <CountdownRedirect message={this.props.message || "Acceso denegado"} />
      </Main>
    );
  }
}

function CountdownRedirect({ message }) {
  const [counter, setCounter] = useState(15);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
    document.getElementById("goto-home").click();
  }, [counter]);

  return (
    <div
      className="flex col-direction justify-space-between align-center"
      style={{
        minHeight: "80vh",
      }}
    >
      <Alert variant="filled" severity="error" sx={{ width: "100%", mb: 2 }}>
        {message}. Será redirigido en {counter} segundos.
      </Alert>
      <PaperP className="flex align-center fit-content col-direction wrap">
        <CircularProgressWithLabel
          value={counter}
          maxvalue={15}
          label={counter.toString().padStart(2, "0") + "s"}
        />
        <br />
        <NavigationLink
          isButton
          color="error"
          startIcon={<HomeIcon />}
          to={"@home"}
          id="goto-home"
        >
          Ir al inicio
        </NavigationLink>
      </PaperP>
      <span />
    </div>
  );
}

function CircularProgressWithLabel(props) {
  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <CircularProgress
        size="100px"
        variant="determinate"
        color="error"
        {...{
          ...props,
          value: (props.value / props.maxvalue) * 100,
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: "text.secondary" }}
        >
          {props.label}
        </Typography>
      </Box>
    </Box>
  );
}
