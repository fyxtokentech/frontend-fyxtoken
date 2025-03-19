import { PaperP } from "@containers";
import { href } from "@jeff-aporta/theme-manager";
import { Link } from "@mui/material";

export default Footer;

function Footer() {
  return (
    <PaperP elevation={0} className="content-container min-h-200px footer">
      <div className="d-flex-col">
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
