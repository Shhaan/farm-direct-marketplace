import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import React, {useState} from "react";
import  { api } from "../../Config/AxiosStrip";
import './Checkout.css'
const CheckoutForm = ({otp}) => {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const stripe = useStripe();
  const elements = useElements();
 
const handleChange = (event) => {
  if (event.error) {
    setError(event.error.message);
  } else {
    setError(null);
     
  }
}

// Handle form submission.
const handleSubmit = async (event) => {
  event.preventDefault();
  const card = elements.getElement(CardElement);

  const {paymentMethod, error} = await stripe.createPaymentMethod({
    type: 'card',
    card: card
        });
         
try{

       const payment = await api.post(`farmer/save-stripe-info/`, {email, payment_method_id: paymentMethod.id,otp}) 

       console.log(payment);

       if (payment){
             const data = payment.data.data
       console.log(payment);
        if (data.payment_intent.status === 'requires_action') {
          
          const action = data.payment_intent.next_action;

          if (action && action.type === 'redirect_to_url') {
             

            window.location = action.redirect_to_url.url;
        
            
          }

          // try{ 
          //   const {paymentIntent} = await stripe.retrievePaymentIntent(data.payment_intent.client_secret);
          //   console.log(paymentIntent);
          //   const id  = {'id':paymentIntent.id}

          //   const res = await api.post('farmer/confirm-payment/',id)

          //   console.log(res);

          // }
          // catch(e){
          //     console.log(e);
          // }
        
        } else if (data.payment_intent.status === 'succeeded') {
          // Payment succeeded
          console.log('Payment succeeded!');
        } else {
          // Handle other statuses
          console.log('Payment status:', data.payment_intent.status);
        }

       }
         
      }
      catch(e){
        console.log(e);
      }

};
return (
  <form onSubmit={handleSubmit} className="stripe-form">
  <div className="form-row">
    <label htmlFor="email">Email Address</label>
    <input className="form-input" id="email" name="name" type="email" placeholder="Email" required value={email} onChange={(event) => { setEmail(event.target.value) }} />
  </div>
  <div className="form-row">
    <label htmlFor="card-element">Credit or debit card</label>
    <CardElement id="card-element" onChange={handleChange} />
    <div className="card-errors" role="alert">{error}</div>
  </div>
  <button type="submit" className="submit-btn">
    Submit Payment
  </button>
</form>
 );
};
export default CheckoutForm;