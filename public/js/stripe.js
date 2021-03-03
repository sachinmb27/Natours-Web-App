/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51IQLHVAtvbfdd2EFafbWIygEC3fholwQuBIGUOv8D9IYNVip2x3iuV7k4hT4J0x0zNa4dymGYslziS7dXLun9DrO00Wbu3I31i');

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
