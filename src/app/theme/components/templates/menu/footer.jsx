import { PaperP } from "@containers";
import { href } from "@jeff-aporta/theme-manager";
import {
  Box,
  Container,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { ImageLocal } from "@recurrent";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

export default Footer;

function Footer({ updateThemeName, getThemeName }) {
  return (
    <>
      <FooterNavSection />
      <PaperP elevation={0} className="content-container footer">
        <SelectThemeName {...{ getThemeName, updateThemeName }} />
      </PaperP>
    </>
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
        <MenuItem value="blacknwhite">Blanco y negro</MenuItem>
      </Select>
    </FormControl>
  );
}

function FooterNavSection() {
  return (
    <Paper
      sx={{
        padding: "60px 0 20px",
      }}
    >
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Navegación
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                color="inherit"
                underline="hover"
                href={href("/welcome/pricing")}
              >
                Precios
              </Link>
              <Link color="inherit" underline="hover" href={href("/users/login")}>
                Acceder
              </Link>
              <Link color="inherit" underline="hover" href={href("/dev/resume")}>
                Panel Resumen
              </Link>
              <Link
                color="inherit"
                underline="hover"
                href={href({
                  view: "/dev/bot",
                  params: { "action-id": "main" },
                })}
              >
                Panel robot
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: "right" }}>
              <ImageLocal
                src="img/logo-fyxtoken-main-color.svg"
                alt="Fyxtoken Logo"
                style={{
                  width: "120px",
                  marginBottom: "20px",
                  marginLeft: "auto",
                }}
              />
              <Typography variant="body2" sx={{ mb: 1 }}>
                Fyxtoken
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Registro 310.318.039-5
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Av. 38 #55-85 a 55-37, Niquia,
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Bello, Antioquia, Colombia
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mb: 2,
                }}
              >
                <img
                  src="https://logo.clearbit.com/play.google.com"
                  alt="Google Play"
                  style={{ height: "30px", borderRadius: "4px" }}
                />
                <img
                  src="https://logo.clearbit.com/apple.com"
                  alt="App Store"
                  style={{ height: "30px", borderRadius: "4px" }}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Link href="#" color="inherit">
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      bgcolor: "action.hover",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FacebookIcon fontSize="small" />
                  </Box>
                </Link>
                <Link href="#" color="inherit">
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      bgcolor: "action.hover",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TwitterIcon fontSize="small" />
                  </Box>
                </Link>
                <Link href="#" color="inherit">
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      bgcolor: "action.hover",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <InstagramIcon fontSize="small" />
                  </Box>
                </Link>
                <Link href="#" color="inherit">
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      bgcolor: "action.hover",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <YouTubeIcon fontSize="small" />
                  </Box>
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography
          variant="caption"
          align="center"
          sx={{
            display: "block",
            mt: 4,
            opacity: 0.5,
          }}
        >
          2025 FyxToken – Consulting, Bitcoin, Blockchain and Cryptocurrency.
          Todos los derechos reservados.
        </Typography>
      </Container>
    </Paper>
  );
}
