import React from "react";
import { PaperF } from "../components/containers.jsx";
import {
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { configUseViewId, getUseViewId } from "../../router/storage.js";
import {
  isRegistered,
  getAllThemesRegistered,
  getThemeName,
} from "../../rules/manager/index.js";
import { showPromptDialog } from "../PromptDialog.jsx";

export function ToolsCustomizeInFooter({ updateThemeName }) {
  const themeName = getThemeName();
  return (
    <PaperF
      elevation={0}
      className="footer flex align-center pad-10px gap-10px"
    >
      <SelectThemeName />
      <CheckUseViewID />
    </PaperF>
  );

  function CheckUseViewID() {
    const [checked, setChecked] = React.useState(getUseViewId());

    const handleChange = async (e) => {
      const newChecked = e.target.checked;
      const { value } = await showPromptDialog({
        title: "Cambio de desarrollo",
        description: (
          <>
            Escriba <b>'OK'</b> para cambiar
            <br />
            <br />
            <Typography component="span" variant="body2" color="secondary">
              Esta acción puede afectar la funcionalidad de su página
            </Typography>
            <br />
          </>
        ),
        input: "text",
        label: "Texto",
        onValidate: (value) =>
          ["Escribe 'OK' para confirmar", true][+(value.toLowerCase() == "ok")],
      });
      if (value) {
        configUseViewId(newChecked);
        setChecked(newChecked);
      } else {
        setChecked((prev) => prev);
      }
    };

    return (
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={handleChange} />}
        label="Use View Id"
      />
    );
  }

  function SelectThemeName() {
    return (
      <FormControl style={{ width: "150px" }}>
        <InputLabel id="label-select-theme-name">Nombre tema</InputLabel>
        <Select
          labelId="label-select-theme-name"
          id="select-theme-name"
          value={isRegistered(themeName) ?? ""}
          onChange={(e) => {
            updateThemeName(e.target.value);
          }}
        >
          {getAllThemesRegistered()
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((themeRegister, i) => (
              <MenuItem key={i} value={themeRegister.name}>
                {themeRegister.label}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    );
  }
}
