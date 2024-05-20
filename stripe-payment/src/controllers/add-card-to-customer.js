import { successResponse, errorResponse } from "../utils/response.js";
import Stripe from 'stripe';

const stripe = new Stripe("sk_test_51OHMnlSD010bwSLtbxEWBTJYuThpDaWOA6vi3tf7nfBsu6fAVy7magTCmrrw1KNFXLD6k4cGuW6BGly0e8Y4mlfF00yNKUnfCv");

export const addCardToCustomer = async (req, res) => {
    try {
        const customerId = "cus_PY21lMxQ0BUrKS";
        const cardToken = "tok_1Oix7hSD010bwSLtwS6Qv3qs";

        const card = await stripe.customers.createSource(customerId, {
            source: cardToken
        });
        return successResponse(res, 200, "Card added to customer", card);
    } catch (error) {
        return errorResponse(res, 500, "Failed to add card to customer", { error: error.message });
    }
};