import * as React from "react";
import axios from "../../../Config/Axios";

import Paypalbutton from "../../../Components/Paypalbutton/Paypalbutton";
import Box from "@mui/material/Box";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import FormControl from "@mui/material/FormControl";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { border, styled } from "@mui/system";
import { PaypalClientid } from "../../../Config/Constants";
import { Farmercontext } from "../../../Functions/FarmerInboxcontext";
import { Button } from "@mui/material";

const FormGrid = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function PaymentForm({ products }) {
  const { activeStep, setActiveStep, setpaymentmethod, paymentmethod } =
    React.useContext(Farmercontext);

  const button1 = {
    backgroundColor: "#009cde",
    color: "white",
    border: paymentmethod === "wallet" ? "1px solid black" : "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
    marginBottom: "25px",
  };
  const button2 = {
    backgroundColor: "#009cde",
    color: "white",
    border: paymentmethod === "Cash on delivery" ? "1px solid black" : "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
    marginBottom: "25px",
  };
  const [wallet, setwallet] = React.useState(0);
  const [walleterror, setwalleterror] = React.useState("");

  setInterval(() => {
    setwalleterror("");
  }, 10000);
  React.useEffect(() => {
    const wallet = async () => {
      const accessToken = localStorage.getItem("access_token");

      const { data } = await axios.get(`customer/profile/wallet/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setwallet(data[0].amount);
    };
    wallet();
  }, []);

  const walletmethod = () => {
    if (wallet < products.price) {
      setwalleterror("Not enough money in wallet");
    } else {
      setpaymentmethod("wallet");
    }
  };

  const Completeorder = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");

      const { data } = await axios.post(
        `customer/profile/complete/payment/
`,

        {
          products: products,
          shipping: JSON.parse(localStorage.getItem("shipaddress")),
          paymentmethod: paymentmethod,
          farmer: products.farmer,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(data);
      setActiveStep((p) => p + 2);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
      <FormControl component="fieldset" fullWidth></FormControl>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box>
          {/* <PayPalScriptProvider options={{ "client-id": PaypalClientid }}>
            <Paypalbutton products={products} />
          </PayPalScriptProvider> */}

          <div>
            <button style={button1} onClick={walletmethod}>
              Wallet payment
            </button>
            {walleterror && <h6 className="text-danger">{walleterror}</h6>}
          </div>

          <div>
            <button
              onClick={() => setpaymentmethod("Cash on delivery")}
              style={button2}
            >
              Cash on delivery
            </button>
          </div>
        </Box>
      </Box>
      <Button
        variant="contained"
        style={{ marginLeft: "auto" }}
        sx={{
          width: { xs: "100%", sm: "fit-content" },
        }}
        onClick={Completeorder}
      >
        Next
      </Button>
    </Stack>
  );
}
