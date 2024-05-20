import { successResponse, errorResponse } from "../utils/response.js";
import Stripe from 'stripe';
const stripe = new Stripe("sk_test_51OHMnlSD010bwSLtbxEWBTJYuThpDaWOA6vi3tf7nfBsu6fAVy7magTCmrrw1KNFXLD6k4cGuW6BGly0e8Y4mlfF00yNKUnfCv");
export const createToken = async (req, res) => {
  try {
    const testCardToken = 'tok_visa';
    const token = await stripe.tokens.retrieve(testCardToken);
    return successResponse(res, 200, "Token created", token);
  } catch (error) {
    return errorResponse(res, 500, "Failed to create token", {
      error: error.message
    });
  }
};
//# sourceMappingURL=create-token.js.map