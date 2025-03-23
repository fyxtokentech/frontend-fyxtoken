import { PaperP } from "@containers";
import { href } from "@jeff-aporta/theme-manager";
import { FormControl, InputLabel, Link, MenuItem, Select } from "@mui/material";

export default Footer;

function Footer({ updateThemeName, getThemeName }) {
  return (
    <PaperP elevation={0} className="content-container min-h-200px footer">
      <div className="d-flex-col gap-20px">
        <SelectThemeName {...{ getThemeName, updateThemeName }} />
        <Link color="inherit" underline="hover" href={href("/lab/panel-robot")}>
          Panel robot
        </Link>
        <Link color="inherit" underline="hover" href={href("/pricing")}>
          Pricing
        </Link>
      </div>
      <div className="d-end-wrap gap-10px">
        <span>El futuro es digital y tokenizado.</span>
        <strong className="c-deepskyblue">
          &copy; {new Date().getFullYear()} Fixtoken
        </strong>
      </div>
    </PaperP>
  );
}
function SelectThemeName({ getThemeName, updateThemeName }) {
  return (
    <FormControl style={{ width: "150px" }}>
      <InputLabel id="label-select-theme-name">Nombre tema</InputLabel>
      <Select
        labelId="label-select-theme-name"
        id="select-theme-name"
        value={getThemeName()}
        onChange={(e) => updateThemeName(e.target.value)}
      >
        <MenuItem value="main">Main</MenuItem>
        <MenuItem value="skygreen">Verde cielo</MenuItem>
        <MenuItem value="lemongreen">Verde lima</MenuItem>
        <MenuItem value="springgreen">Verde primavera</MenuItem>
      </Select>
    </FormControl>
  );
}
