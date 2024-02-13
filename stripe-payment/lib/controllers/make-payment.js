import { successResponse, errorResponse } from "../utils/response.js";
import Stripe from 'stripe';
const stripe = new Stripe("sk_test_51OHMnlSD010bwSLtbxEWBTJYuThpDaWOA6vi3tf7nfBsu6fAVy7magTCmrrw1KNFXLD6k4cGuW6BGly0e8Y4mlfF00yNKUnfCv");
export const makePayment = async (req, res) => {
  try {
    const customerId = "cus_PY21lMxQ0BUrKS";
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 4000,
      currency: "usd",
      payment_method: "pm_1OixSVSD010bwSLtXkeSIdln",
      confirm: true,
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never"
      },
      return_url: "https://localhost:3000/success"
    });
    return successResponse(res, 200, "Payment made", paymentIntent);
  } catch (error) {
    return errorResponse(res, 500, "Failed to made payment", {
      error: error.message
    });
  }
};
//# sourceMappingURL=make-payment.js.map