import * as React from "react";

import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/system";
import { Farmercontext } from "../../../Functions/FarmerInboxcontext";
import * as yup from "yup";
import axios from "../../../Config/Axios";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  FormControl,
  RadioGroup,
  Typography,
  getLinearProgressUtilityClass,
} from "@mui/material";
const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function AddressForm({ handleNext }) {
  const { setfilladrress } = React.useContext(Farmercontext);
  const [fatchshipaddress, setfatchshipaddress] = React.useState([]);
  const [toggleshi, settoggleship] = React.useState(false);

  const [selectedId, setSelectedId] = React.useState(null);
  const [error, seterror] = React.useState({});
  const [shipaddress, setshipaddress] = React.useState(
    localStorage.getItem("shipaddress")
      ? JSON.parse(localStorage.getItem("shipaddress"))
      : {
          First_name: "",
          Last_name: "",
          Address: "",
          Country: "",
          city: "",
          State: "",
          postal_code: "",
          District: "",
        }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedId(null);
    seterror((p) => ({ ...p, [name]: false }));
    setshipaddress((p) => ({ ...p, [name]: value }));
  };

  React.useEffect(() => {
    const fetchshippingaddress = async () => {
      try {
        const accesstoken = localStorage.getItem("access_token");
        const shipp = await axios.get("customer/profile/getshipping/", {
          headers: {
            Authorization: `Bearer ${accesstoken}`,
          },
        });
        if (shipp.status == 200) {
          console.log(shipp);
          setfatchshipaddress(shipp.data);
          settoggleship(true);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchshippingaddress();
  }, []);

  const handleSelect = (id) => {
    setshipaddress({});
    setSelectedId(id);
  };

  const validatedata = yup.object({
    First_name: yup.string().trim().required("First name is required"),
    Last_name: yup.string().trim().required("Last name is required"),

    city: yup.string().trim().required("city is required"),
    Address: yup.string().trim().required("Address is required"),
    Country: yup.string().trim().required("Country is required"),
    State: yup.string().trim().required("State is required"),
    District: yup.string().trim().required("District is required"),
    postal_code: yup
      .number()
      .typeError("must be number")
      .required("postal_code is required"),
  });

  const next = async () => {
    if (selectedId) {
      const selectedAddress = fatchshipaddress.find(
        (obj) => obj.id === selectedId
      );

      localStorage.setItem("shipaddress", JSON.stringify(selectedAddress));
    } else {
      try {
        await validatedata.validate(shipaddress, { abortEarly: false });
        localStorage.setItem("shipaddress", JSON.stringify(shipaddress));
      } catch (e) {
        const er = {};

        if (e.inner) {
          e.inner.forEach((element) => {
            er[element.path] = true;
          });
        }

        console.log(er);

        return seterror(er);
      }
    }

    return handleNext();
  };

  return (
    <>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          aria-label="Payment options"
          sx={{
            flexDirection: { sm: "column", md: "row" },
            gap: 2,
          }}
        >
          <Card
            sx={{
              maxWidth: { sm: "100%", md: "50%" },
              flexGrow: 1,
              outline: "1px solid",
            }}
            style={{ border: !toggleshi ? "blue" : "" }}
          >
            <CardActionArea onClick={() => settoggleship(false)}>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography fontWeight="medium">
                  Add shipping address
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card
            sx={{
              maxWidth: { sm: "100%", md: "50%" },
              flexGrow: 1,
              outline: "1px solid",
            }}
            style={{ border: toggleshi ? "blue" : "" }}
          >
            <CardActionArea onClick={() => settoggleship(true)}>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography fontWeight="medium">Shipping address</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </RadioGroup>
      </FormControl>
      <Grid container spacing={3}>
        {toggleshi ? (
          <div>
            {fatchshipaddress.map((obj) => (
              <div
                key={obj.id}
                onClick={() => handleSelect(obj.id)}
                style={{
                  padding: "10px",
                  margin: "5px",
                  cursor: "pointer",
                  backgroundColor:
                    obj.id === selectedId ? "lightblue" : "white",
                  border:
                    obj.id === selectedId ? "2px solid blue" : "1px solid gray",
                }}
              >
                {obj.First_name} ,{obj.Last_name} ,{obj.Address}, {obj.Country},
                {obj.State}, {obj.District},{obj.city}, {obj.postal_code}
              </div>
            ))}
          </div>
        ) : (
          <>
            <FormGrid item xs={12} md={6}>
              <FormLabel className="ms-0" htmlFor="First_name" required>
                First name
              </FormLabel>
              <OutlinedInput
                id="First_name"
                name="First_name"
                type="name"
                placeholder="John"
                autoComplete="first name"
                required
                value={shipaddress.First_name}
                onChange={(e) => handleChange(e)}
                style={{
                  border: error.First_name ? "2px solid red" : "",
                }}
              />
            </FormGrid>
            <FormGrid item xs={12} md={6}>
              <FormLabel className="ms-0" htmlFor="Last_name" required>
                Last name
              </FormLabel>
              <OutlinedInput
                id="Last_name"
                name="Last_name"
                type="Last_name"
                placeholder="Snow"
                autoComplete="last name"
                required
                value={shipaddress.Last_name}
                onChange={(e) => handleChange(e)}
                style={{
                  border: error.Last_name ? "2px solid red" : "",
                }}
              />
            </FormGrid>

            <FormGrid item xs={12}>
              <FormLabel className="ms-0" htmlFor="Address" required>
                Address line 1
              </FormLabel>
              <OutlinedInput
                id="Address"
                name="Address"
                type="Address"
                placeholder="Street name and number"
                autoComplete="shipping Address-line1"
                required
                value={shipaddress.Address}
                onChange={(e) => handleChange(e)}
                style={{
                  border: error.Address ? "2px solid red" : "",
                }}
              />
            </FormGrid>
            <FormGrid item xs={12}>
              <FormLabel className="ms-0" htmlFor="Country">
                Country
              </FormLabel>
              <OutlinedInput
                id="Country"
                name="Country"
                type="addresCountrys2"
                placeholder="India"
                autoComplete="Country  "
                required
                value={shipaddress.Country}
                onChange={(e) => handleChange(e)}
                style={{
                  border: error.Country ? "2px solid red" : "",
                }}
              />
            </FormGrid>
            <FormGrid item xs={6}>
              <FormLabel className="ms-0" htmlFor="city" required>
                City
              </FormLabel>
              <OutlinedInput
                id="city"
                name="city"
                type="city"
                placeholder="New York"
                autoComplete="City"
                required
                value={shipaddress.city}
                onChange={(e) => handleChange(e)}
                style={{
                  border: error.city ? "2px solid red" : "",
                }}
              />
            </FormGrid>
            <FormGrid item xs={6}>
              <FormLabel className="ms-0" htmlFor="State" required>
                State
              </FormLabel>
              <OutlinedInput
                id="State"
                name="State"
                type="State"
                placeholder="NY"
                autoComplete="State"
                required
                value={shipaddress.State}
                onChange={(e) => handleChange(e)}
                style={{
                  border: error.State ? "2px solid red" : "",
                }}
              />
            </FormGrid>
            <FormGrid item xs={6}>
              <FormLabel htmlFor="postal_code" className="ms-0" required>
                postal_code / Postal code
              </FormLabel>
              <OutlinedInput
                id="postal_code"
                name="postal_code"
                type={"number"}
                placeholder="12345"
                autoComplete="shipping postal-code"
                required
                value={shipaddress.postal_code}
                onChange={(e) => handleChange(e)}
                style={{
                  border: error.postal_code ? "2px solid red" : "",
                }}
              />
            </FormGrid>
            <FormGrid item xs={6}>
              <FormLabel className="ms-0" htmlFor="District" required>
                District
              </FormLabel>
              <OutlinedInput
                id="District"
                name="District"
                type="District"
                placeholder="United States"
                autoComplete="shipping District"
                required
                value={shipaddress.District}
                onChange={(e) => handleChange(e)}
                style={{
                  border: error.District ? "2px solid red" : "",
                }}
              />
            </FormGrid>
          </>
        )}
      </Grid>{" "}
      <Button
        onClick={() => next()}
        variant="contained"
        style={{ marginLeft: "auto" }}
        sx={{
          width: { xs: "100%", sm: "fit-content" },
        }}
      >
        Next
      </Button>
    </>
  );
}
