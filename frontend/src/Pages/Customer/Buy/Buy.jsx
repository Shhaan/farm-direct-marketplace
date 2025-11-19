import UserHeader from "../../../Components/athenticationHeader/Header";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { UserRegistered } from "../../../Slices/UserSlice";
import axios from "../../../Config/Axios";
import { useDispatch } from "react-redux";
import * as React from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AddressForm from "./AddressForm";
import getCheckoutTheme from "./getCheckoutMode";
import Info from "./Info";
import InfoMobile from "./InfoMobile";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import ToggleColorMode from "./ToggleColorMode";
import { Farmercontext } from "../../../Functions/FarmerInboxcontext";

function ToggleCustomTheme({ showCustomTheme, toggleCustomTheme }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100dvw",
        position: "fixed",
        bottom: 24,
      }}
    >
      <ToggleButtonGroup
        color="primary"
        exclusive
        value={showCustomTheme}
        onChange={toggleCustomTheme}
        aria-label="Platform"
        sx={{
          backgroundColor: "background.default",
          "& .Mui-selected": {
            pointerEvents: "none",
          },
        }}
      ></ToggleButtonGroup>
    </Box>
  );
}

ToggleCustomTheme.propTypes = {
  showCustomTheme: PropTypes.shape({
    valueOf: PropTypes.func.isRequired,
  }).isRequired,
  toggleCustomTheme: PropTypes.func.isRequired,
};

const steps = ["Shipping address", "Payment details", "Review your order"];

const logoStyle = {
  width: "140px",
  height: "56px",
  marginLeft: "-4px",
  marginRight: "-8px",
};

export default function Checkout() {
  const { filladrress, activeStep, setActiveStep } =
    React.useContext(Farmercontext);

  const [mode, setMode] = React.useState("light");
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const checkoutTheme = createTheme(getCheckoutTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const [item, setItem] = React.useState({});
  const { slug } = useParams();
  const { state } = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [shippingaddress, setshippingaddres] = React.useState([]);
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        const getuser = await axios.get(`currentuser/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        dispatch(UserRegistered(getuser.data));
      } catch (e) {
        console.log(e);

        navigate("/");
      }
    };

    fetchUser();

    const fetchshipping = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        if (accessToken) {
          const getshipping = await axios.get(`customer/profile/getshipping/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          setshippingaddres(getshipping.data);
        } else {
          navigate("/");
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchshipping();

    const fetchCrop = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const { data } = await axios.get(
          `customer/profile/edit/cart/${state}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setItem(data);
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchCrop();
  }, [slug]);

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <AddressForm handleNext={handleNext} />;
      case 1:
        return (
          <PaymentForm
            products={{
              cropName: item?.crop?.cropName,
              productid: item?.crop?.id,
              categoryid: item?.id,
              farmer: item?.crop?.farmer?.id,
              quantity: item?.quantity,
              price: item?.crop?.price,
              items: [
                {
                  name: item?.crop?.cropName,
                  quantity: item?.quantity,
                  price: item?.crop?.price,
                  unit_amount: {
                    currency_code: "USD",
                    value: item?.crop?.price.toFixed(2),
                  },
                },
              ],
            }}
          />
        );
      case 2:
        return (
          <Review
            totalPrice={{
              total: item?.crop?.price * item?.quantity,
              quantity: item?.quantity,
              price: item?.crop?.price,
              farmername:
                item?.crop?.farmer?.user?.First_name +
                " " +
                item?.crop?.farmer?.user?.Last_name,
              Crop: item?.crop?.cropName,
            }}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  }
  console.log(item);
  return (
    <ThemeProvider theme={showCustomTheme ? checkoutTheme : defaultTheme}>
      <CssBaseline />
      <UserHeader />
      <Grid container sx={{ height: { xs: "100%", sm: "100dvh" } }}>
        <Grid
          item
          xs={12}
          sm={5}
          lg={4}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            backgroundColor: "background.paper",
            borderRight: { sm: "none", md: "1px solid" },
            borderColor: { sm: "none", md: "divider" },
            alignItems: "start",
            pt: 4,
            px: 10,
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "end",
              height: 150,
            }}
          ></Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              maxWidth: 500,
            }}
          >
            <Info
              totalPrice={{
                total: item?.crop?.price * item?.quantity,
                quantity: item?.quantity,
                price: item?.crop?.price,
                farmername:
                  item?.crop?.farmer?.user?.First_name +
                  " " +
                  item?.crop?.farmer?.user?.Last_name,
                Crop: item?.crop?.cropName,
              }}
            />
          </Box>
        </Grid>
        <Grid
          item
          sm={12}
          md={7}
          lg={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "100%",
            width: "100%",
            backgroundColor: { xs: "transparent", sm: "background.default" },
            alignItems: "start",
            pt: { xs: 2, sm: 4 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: { sm: "space-between", md: "flex-end" },
              alignItems: "center",
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
            }}
          >
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexGrow: 1,
                height: 150,
              }}
            >
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
              <Stepper
                id="desktop-stepper"
                activeStep={activeStep}
                sx={{
                  width: "100%",
                  height: 40,
                }}
              >
                {steps.map((label) => (
                  <Step
                    sx={{
                      ":first-child": { pl: 0 },
                      ":last-child": { pr: 0 },
                    }}
                    key={label}
                  >
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Box>
          <Card
            sx={{
              display: { xs: "flex", md: "none" },
              width: "100%",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                ":last-child": { pb: 2 },
              }}
            >
              <div>
                <Typography variant="subtitle2" gutterBottom>
                  Selected products
                </Typography>
                <Typography variant="body1">
                  {item?.crop?.price * item?.quantity}
                </Typography>
              </div>
              <InfoMobile
                totalPrice={{
                  total: item?.crop?.price * item?.quantity,
                  quantity: item?.quantity,
                  price: item?.crop?.price,
                  farmername:
                    item?.crop?.farmer?.user?.First_name +
                    " " +
                    item?.crop?.farmer?.user?.Last_name,
                  Crop: item?.crop?.cropName,
                }}
              />
            </CardContent>
          </Card>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
              maxHeight: "720px",
              gap: { xs: 5, md: "none" },
            }}
          >
            <Stepper
              id="mobile-stepper"
              activeStep={activeStep}
              alternativeLabel
              sx={{ display: { sm: "flex", md: "none" } }}
            >
              {steps.map((label) => (
                <Step
                  sx={{
                    ":first-child": { pl: 0 },
                    ":last-child": { pr: 0 },
                    "& .MuiStepConnector-root": { top: { xs: 6, sm: 12 } },
                  }}
                  key={label}
                >
                  <StepLabel
                    sx={{
                      ".MuiStepLabel-labelContainer": { maxWidth: "70px" },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <Stack spacing={2} useFlexGap>
                <Typography variant="h1">📦</Typography>
                <Typography variant="h5">Thank you for your order!</Typography>
                <Typography variant="body1" color="text.secondary">
                  We have emailed your order confirmation and will update you
                  once its shipped.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    alignSelf: "start",
                    width: { xs: "100%", sm: "auto" },
                  }}
                  onClick={() => navigate("/")}
                >
                  Go back to shopping
                </Button>
              </Stack>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column-reverse", sm: "row" },
                    justifyContent:
                      activeStep !== 0 ? "space-between" : "flex-end",
                    alignItems: "end",
                    flexGrow: 1,
                    gap: 1,
                    pb: { xs: 12, sm: 0 },
                    mt: { xs: 2, sm: 0 },
                    mb: "60px",
                  }}
                >
                  {activeStep !== 0 && (
                    <Button
                      onClick={handleBack}
                      variant="text"
                      sx={{
                        display: { xs: "none", sm: "flex" },
                      }}
                    >
                      Previous
                    </Button>
                  )}

                  {activeStep !== 0 && (
                    <Button
                      onClick={handleBack}
                      variant="outlined"
                      fullWidth
                      sx={{
                        display: { xs: "flex", sm: "none" },
                      }}
                    >
                      Previous
                    </Button>
                  )}

                  {activeStep > 0 && activeStep != 1 && (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{
                        width: { xs: "100%", sm: "fit-content" },
                      }}
                    >
                      {activeStep === steps.length - 1 ? "Place order" : "Next"}
                    </Button>
                  )}
                </Box>
              </React.Fragment>
            )}
          </Box>
        </Grid>
      </Grid>
      <ToggleCustomTheme
        toggleCustomTheme={toggleCustomTheme}
        showCustomTheme={showCustomTheme}
      />
    </ThemeProvider>
  );
}
