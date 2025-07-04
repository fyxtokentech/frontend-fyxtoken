import React from "react";
import {
  ImageLocal,
  DivM,
  PaperP,
  isDark,
  controlComponents,
  NavigationLink,
  fluidCSS,
  showPromptDialog,
  getSelectedPalette,
} from "@jeff-aporta/camaleon";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Link,
  Paper,
  Rating,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

// Iconos
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SpeedIcon from "@mui/icons-material/Speed";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";

import { Main } from "@theme/main";

export default function () {
  return <WelcomePage />;
}

function WelcomePage() {
  const palette = getSelectedPalette();
  return (
    <Main bgtype="default">
      <div className="welcome-page">
        {/* Hero Section */}
        <HeroSection />

        {/* Benefits Section */}
        <BenefitsSection />

        {/* Expert Reviews */}
        <ExpertReviewsSection />

        {/* Call to Action */}
        <CTASection />

        {/* Stats Section */}
        <StatsSection />
      </div>
    </Main>
  );
}

function HeroSection() {
  return (
    <Box
      sx={{
        padding: "60px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: "absolute",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "primary.main",
          top: "15%",
          right: "5%",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "15px",
          height: "15px",
          borderRadius: "50%",
          backgroundColor: "success.main",
          top: "15%",
          left: "15%",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: "warning.main",
          bottom: "15%",
          left: "30%",
        }}
      />

      <Container>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ maxWidth: "500px" }}>
              <div className="color-bg-opposite">
                <Typography variant="caption">
                  <b>El futuro es digital y tokenizado</b>
                </Typography>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{ fontWeight: "bold", my: 2 }}
                >
                  Automatización y seguridad
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, mb: 3 }}>
                  Procesos automáticos y transacciones descentralizadas gracias
                  a la tecnología blockchain en mercados tokenizados.
                </Typography>
              </div>
              <Box sx={{ display: "flex", gap: 2 }}>
                <NavigationLink to="/login">
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                    borderRadius: "20px",
                    px: 3,
                  }}
                >
                  Comenzar ahora
                </Button>
                </NavigationLink>
                <NavigationLink to="/pricing">
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{
                    borderRadius: "20px",
                    px: 3,
                  }}
                >
                  ¿Cómo funciona?
                </Button>
                </NavigationLink>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: "relative", textAlign: "center", mt: "20px" }}>
              {/* Gráficos y elementos decorativos alrededor del teléfono */}
              <Box
                sx={{
                  position: "absolute",
                  top: "-30px",
                  right: "10%",
                  textAlign: "left",
                }}
              >
                <div className="color-bg-opposite">
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    $425
                  </Typography>
                  <Typography variant="caption">Beneficio total</Typography>
                  <Box
                    className="d-center"
                    sx={{
                      width: "100px",
                      height: "30px",
                      bgcolor: "warning.main",
                      borderRadius: "10px",
                      mt: 1,
                    }}
                  >
                    <CurrencyBitcoinIcon />
                    BTC
                  </Box>
                </div>
              </Box>

              {/* Teléfono central */}
              <Paper
                elevation={24}
                sx={{
                  width: "220px",
                  height: "400px",
                  borderRadius: "30px",
                  margin: "0 auto",
                  padding: "15px",
                  boxShadow: 3,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "20px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    padding: "15px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography variant="caption">Balance</Typography>
                    <Typography variant="caption" color="secondary.main">
                      USD
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                    $1,234.56
                  </Typography>

                  {/* Tarjeta de crédito simulada */}
                  <Paper
                    elevation={10}
                    sx={{
                      borderRadius: "10px",
                      padding: "10px",
                      mb: 2,
                    }}
                  >
                    <Typography variant="caption">
                      **** **** **** 4567
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      <Typography variant="caption">05/28</Typography>
                    </Box>
                  </Paper>

                  {/* Botón de acción */}
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    sx={{
                      borderRadius: "20px",
                      alignSelf: "center",
                      mt: "auto",
                    }}
                  >
                    Transferir
                  </Button>
                </Paper>
              </Paper>

              {/* Elementos decorativos a la derecha */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: "20px",
                  right: "5%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Button
                  sx={{
                    width: "80px",
                    height: "30px",
                    bgcolor: "error.main",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "error.contrastText",
                    fontSize: "12px",
                  }}
                >
                  VENTA
                </Button>
                <Button
                  sx={{
                    width: "80px",
                    height: "30px",
                    bgcolor: "ok.main",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "12px",
                  }}
                >
                  COMPRA
                </Button>
                <Box
                  sx={{
                    width: "80px",
                    height: "80px",
                    bgcolor: "text.secondary",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    className="d-center"
                    sx={{
                      width: "60px",
                      height: "60px",
                      bgcolor: "success.main",
                      borderRadius: "5px",
                    }}
                  >
                    <MonetizationOnIcon sx={{ fontSize: 30 }} color="blanco" />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function BenefitsSection() {
  return (
    <Box
      sx={{
        padding: "80px 0",
      }}
    >
      <Container>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          color="contrast"
          sx={{
            fontWeight: "bold",
            mb: 5,
          }}
        >
          Beneficios de la tokenización de activos
        </Typography>

        <Typography
          variant="body1"
          align="center"
          className="color-bg-opposite"
          sx={{
            maxWidth: "700px",
            margin: "0 auto",
            opacity: 0.8,
            mb: 6,
          }}
        >
          La tokenización permite la división de activos físicos en tokens
          digitales, facilitando su comercialización y gestión.
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: "10px",
                boxShadow: 2,
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-10px)",
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 4 }}>
                <Box
                  sx={{
                    width: "80px",
                    height: "80px",
                    margin: "0 auto 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MonetizationOnIcon
                    sx={{ fontSize: 50, color: "warning.main" }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ fontWeight: "bold", mb: 2 }}
                >
                  Generación de ingresos desde la plataforma
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  Obtén rendimientos económicos a través de la participación en
                  el ecosistema y las transacciones realizadas.
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                >
                  Leer más
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: "10px",
                boxShadow: 2,
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-10px)",
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 4 }}>
                <Box
                  sx={{
                    width: "80px",
                    height: "80px",
                    margin: "0 auto 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShowChartIcon
                    sx={{ fontSize: 50, color: "secondary.main" }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ fontWeight: "bold", mb: 2 }}
                >
                  Negociación en línea con big data
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  Potencia tus decisiones con análisis avanzados basados en
                  grandes volúmenes de datos del mercado.
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                >
                  Leer más
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: "10px",
                boxShadow: 2,
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-10px)",
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 4 }}>
                <Box
                  sx={{
                    width: "80px",
                    height: "80px",
                    margin: "0 auto 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AccountBalanceWalletIcon
                    sx={{ fontSize: 50, color: "secondary.main" }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ fontWeight: "bold", mb: 2 }}
                >
                  Canal para llegar a los clientes
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  Establece conexiones directas con tus clientes a través de
                  nuestra plataforma segura y eficiente.
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                >
                  Leer más
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Nota de seguridad */}
        <Paper
          elevation={24}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            maxWidth: "700px",
            margin: "50px auto 0",
            padding: "15px",
            borderRadius: "30px",
          }}
        >
          <Paper
            className="invert-nohue"
            sx={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircleOutlineIcon />
          </Paper>
          <Typography variant="body2" color="warning.main">
            La tokenización garantiza la seguridad y trazabilidad en la
            propiedad mediante tecnología blockchain.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

function ExpertReviewsSection() {
  return (
    <Paper
      elevation={0}
      sx={{
        padding: "80px 0",
      }}
    >
      <Container>
        <Typography
          variant="h5"
          component="h2"
          align="center"
          color="primary"
          sx={{
            fontWeight: "bold",
            mb: 5,
          }}
        >
          Reviews de expertos
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                bgcolor: "action.hover",
                borderRadius: "10px",
                backdropFilter: "blur(10px)",
                textAlign: "center",
                padding: "20px",
              }}
            >
              <Typography variant="caption">ICO Investor</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
                4.7
              </Typography>
              <Rating value={4.7} readOnly precision={0.1} />
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                bgcolor: "action.hover",
                borderRadius: "10px",
                backdropFilter: "blur(10px)",
                textAlign: "center",
                padding: "20px",
              }}
            >
              <Typography variant="caption">Lending</Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold", my: 1 }}>
                Stable A+
              </Typography>
              <Rating value={5} readOnly />
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                bgcolor: "action.hover",
                borderRadius: "10px",
                backdropFilter: "blur(10px)",
                textAlign: "center",
                padding: "20px",
              }}
            >
              <Typography variant="caption">CoinBase</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
                4.3
              </Typography>
              <Rating value={4.3} readOnly precision={0.1} />
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                bgcolor: "action.hover",
                borderRadius: "10px",
                backdropFilter: "blur(10px)",
                textAlign: "center",
                padding: "20px",
              }}
            >
              <Typography variant="caption">ICO Market</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
                9.3
              </Typography>
              <Rating value={5} readOnly />
            </Card>
          </Grid>
        </Grid>

        <Typography
          variant="caption"
          align="center"
          sx={{
            display: "block",
            mt: 4,
            opacity: 0.7,
          }}
        >
          Valoraciones reales verificadas por "Coinbase y el usuario"
        </Typography>
      </Container>
    </Paper>
  );
}

function CTASection() {
  return (
    <Box
      sx={{
        padding: "60px 0",
      }}
    >
      <Container>
        <Typography
          variant="h5"
          component="h2"
          align="center"
          className="color-bg-opposite"
          sx={{
            fontWeight: "bold",
            mb: 3,
          }}
        >
          Comienza con Fyxtoken
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <TextField
            placeholder="Ingresa tu correo"
            variant="outlined"
            fullWidth
            sx={{
              bgcolor: "background.paper",
              borderRadius: "5px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "5px",
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{
              height: "56px",
              borderRadius: "5px",
            }}
          >
            Comenzar
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

function StatsSection() {
  return (
    <Box
      sx={{
        padding: "40px 0",
        paddingBottom: "150px",
      }}
    >
      <Container className="color-bg-opposite">
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                +1000 Clientes
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Confían en nuestra plataforma
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                5 Años
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                De experiencia en el sector fintech
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                20x
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Crecimiento anual sostenido
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
