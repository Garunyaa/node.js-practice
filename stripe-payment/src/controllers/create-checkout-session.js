import { successResponse, errorResponse } from "../utils/response.js";
import Stripe from 'stripe';

const stripe = new Stripe("sk_test_51OHMnlSD010bwSLtbxEWBTJYuThpDaWOA6vi3tf7nfBsu6fAVy7magTCmrrw1KNFXLD6k4cGuW6BGly0e8Y4mlfF00yNKUnfCv");

export const createSession = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: "product name",
                        },
                        unit_amount: 1000,
                    },
                    quantity: 1,
                }
            ],
            mode: "payment",
            success_url: "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:3000/cancel"
        });

        const sessionId = session.id;

        return successResponse(res, 200, "Checkout session created", { session_id: sessionId });;
    } catch (error) {
        return errorResponse(res, 500, "Failed to create checkout session", { error: error.message });
    }
};