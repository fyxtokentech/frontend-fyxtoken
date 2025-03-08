import { PaperP } from "@components/containers";

export default Footer;

function Footer() {
  return (
    <PaperP
      elevation={0}
      className="content-container d-end-wrap gap-10px min-h-200px footer"
    >
      <span>El futuro es digital y tokenizado.</span>
      <strong className="c-deepskyblue">
        &copy; {new Date().getFullYear()} Fixtoken
      </strong>
    </PaperP>
  );
}
