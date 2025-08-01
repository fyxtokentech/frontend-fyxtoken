import {
  PaperF,
  NavigationLink,
  getAllThemesRegistered,
  getThemeName,
  isRegistered,
  ImageLocal,
  configUseViewId,
  getUseViewId,
  ToolsCustomizeInFooter,
} from "@jeff-aporta/camaleon";
import {
  Box,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Typography,
  Checkbox,
} from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

export function Footer({ updateThemeName }) {
  return (
    <>
      <FooterNavSection />
      <ToolsCustomizeInFooter updateThemeName={updateThemeName} />
    </>
  );
}

function CheckUseViewID() {
  return (
    <FormControlLabel
      control={
        <Checkbox
          defaultChecked={getUseViewId()}
          onChange={(e) => configUseViewId(e.target.checked)}
        />
      }
      label="Use View Id"
    />
  );
}

function SelectThemeName({ themeName, updateThemeName }) {
  return (
    <FormControl style={{ width: "150px" }}>
      <InputLabel id="label-select-theme-name">Nombre tema</InputLabel>
      <Select
        labelId="label-select-theme-name"
        id="select-theme-name"
        value={isRegistered(themeName) ?? ""}
        onChange={(e) => updateThemeName(e.target.value)}
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

function FooterNavSection() {
  const year = new Date().getFullYear();
  return (
    <PaperF hm rhm={2}>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Navegación
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <NavigationLink color="inherit" underline="hover" to="@wallet">
                Wallet
              </NavigationLink>
              <NavigationLink
                color="inherit"
                underline="hover"
                to="/welcome/pricing"
              >
                Precios
              </NavigationLink>
              <NavigationLink
                color="inherit"
                underline="hover"
                to="/users/login"
              >
                Acceder
              </NavigationLink>
              <NavigationLink
                color="inherit"
                underline="hover"
                to="/dev/resume"
              >
                Panel Resumen
              </NavigationLink>
              <NavigationLink color="inherit" underline="hover" to="@bot">
                Panel robot
              </NavigationLink>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: "right" }}>
              <ImageLocal
                src="img/metadata/logo-main.svg"
                alt="Logo"
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
          {`© ${year} FyxToken – Consulting, Bitcoin, Blockchain and Cryptocurrency.`}
        </Typography>
      </Container>
    </PaperF>
  );
}
