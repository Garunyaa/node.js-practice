import { successResponse, errorResponse } from "../utils/response.js";
import Stripe from 'stripe';
const stripe = new Stripe("sk_test_51OHMnlSD010bwSLtbxEWBTJYuThpDaWOA6vi3tf7nfBsu6fAVy7magTCmrrw1KNFXLD6k4cGuW6BGly0e8Y4mlfF00yNKUnfCv");
export const createPaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: "tok_1OixS7SD010bwSLtukpt3DnU"
      }
    });
    const customerId = "cus_PY21lMxQ0BUrKS";
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customerId
    });
    return successResponse(res, 200, "Payment method created", paymentMethod);
  } catch (error) {
    return errorResponse(res, 500, "Failed to create payment method", {
      error: error.message
    });
  }
};
//# sourceMappingURL=create-payment-method.js.map