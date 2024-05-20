import { successResponse, errorResponse } from "../utils/response.js";
import Stripe from 'stripe';
const stripe = new Stripe("sk_test_51OHMnlSD010bwSLtbxEWBTJYuThpDaWOA6vi3tf7nfBsu6fAVy7magTCmrrw1KNFXLD6k4cGuW6BGly0e8Y4mlfF00yNKUnfCv");
export const paymentSuccess = async (req, res) => {
  const session_id = req.query.session_id;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === "paid") {
      return successResponse(res, 200, "Payment successful", session);
    } else {
      return errorResponse(res, 400, "Payment not completed yet", session);
    }
  } catch (error) {
    return errorResponse(res, 500, "Failed to retrieve session", {
      error: error.message
    });
  }
};
//# sourceMappingURL=payment-success.js.map