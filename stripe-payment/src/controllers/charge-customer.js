import { successResponse, errorResponse } from "../utils/response.js";
import Stripe from 'stripe';

const stripe = new Stripe("sk_test_51OHMnlSD010bwSLtbxEWBTJYuThpDaWOA6vi3tf7nfBsu6fAVy7magTCmrrw1KNFXLD6k4cGuW6BGly0e8Y4mlfF00yNKUnfCv");

export const chargeCustomer = async (req, res) => {
    try {
        const customerEmail = "abc@gmail.com";
        const customerName = "abc";
        const billingAddress = {
            line1: "14, Xyz",
            line2: "Vkl",
            city: "Erode",
            state: "Tamilnadu",
            postal_code: "630002",
            country: "India"
        };

        const customerId = "cus_PY21lMxQ0BUrKS";

        let paymentIntent = await stripe.paymentIntents.create({
            payment_method: "pm_1OixSVSD010bwSLtXkeSIdln",
            amount: 75 * 100,
            currency: "inr",
            confirm: true,
            customer: customerId,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never"
            },
            return_url: "https://localhost:3000/success",
            receipt_email: customerEmail
        });

        return successResponse(res, 200, "Payment made", paymentIntent);
    } catch (error) {
        return errorResponse(res, 500, "Failed to made payment", { error: error.message });
    }
};