import { Paper } from "@mui/material";

export default Footer;

function Footer() {
  return (
    <Paper
      elevation={0}
      className="content-container d-flex jc-end ai-end gap-10px pad-20px min-h-250px footer"
    >
      <span>El futuro es digital y tokenizado.</span>
      <strong className="c-deepskyblue">
        &copy; {new Date().getFullYear()} Fixtoken
      </strong>
    </Paper>
  );
}
