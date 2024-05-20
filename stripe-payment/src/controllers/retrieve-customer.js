import { successResponse, errorResponse } from "../utils/response.js";
import Stripe from 'stripe';

const stripe = new Stripe("sk_test_51OHMnlSD010bwSLtbxEWBTJYuThpDaWOA6vi3tf7nfBsu6fAVy7magTCmrrw1KNFXLD6k4cGuW6BGly0e8Y4mlfF00yNKUnfCv");

export const retrieveCustomer = async (req, res) => {
    try {
        const customerId = "cus_PY21lMxQ0BUrKS";
        const customer = await stripe.customers.retrieve(customerId);
        return successResponse(res, 200, "Customer retrieved", customer);
    } catch (error) {
        return errorResponse(res, 500, "Failed to retrieve customer", { error: error.message });
    }
};