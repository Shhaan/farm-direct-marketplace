import React from "react";
import toast from "react-hot-toast";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Farmercontext } from "../../Functions/FarmerInboxcontext";
import axios from "../../Config/Axios";
const Paypalbutton = ({ products }) => {
  const { activeStep, setActiveStep } = React.useContext(Farmercontext);

  return (
    <div>
      <PayPalButtons
        style={{ layout: "horizontal" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",

            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: (products.price * products.quantity).toFixed(2),
                  breakdown: {
                    item_total: {
                      currency_code: "USD",
                      value: (products.price * products.quantity).toFixed(2),
                    },
                  },
                },

                items: products.items,
              },
            ],
            application_context: {
              shipping_preference: "NO_SHIPPING",
              user_action: "PAY_NOW",
              return_url: "http://localhost:3000/",
              cancel_url: "http://localhost:3000/",
            },
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(function (details) {
            const GetResponse = async () => {
              try {
                const accessToken = localStorage.getItem("access_token");

                const response = await axios.post(
                  "/customer/profile/paypal/",
                  {
                    details: details,
                    shipping: JSON.parse(localStorage.getItem("shipaddress")),
                    productid: products.productid,
                    categoryid: products.categoryid,
                    farmer: products.farmer,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                );
                setActiveStep(activeStep + 2);
              } catch (e) {
                console.log(e);
              }
            };

            GetResponse();

            toast.success(
              "Payment completed. Thank you, " + details.payer.name.given_name,
              { duration: 6000 }
            );
          });
        }}
        onCancel={() =>
          toast.error(
            "You cancelled the payment. Try again by clicking the PayPal button",
            {
              duration: 6000,
            }
          )
        }
        onError={(err) => {
          toast.error(
            "There was an error processing your payment. If this error please contact support.",
            { duration: 6000 }
          );
        }}
      />
    </div>
  );
};

export default Paypalbutton;
