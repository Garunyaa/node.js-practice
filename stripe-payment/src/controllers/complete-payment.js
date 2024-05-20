import { successResponse, errorResponse } from "../utils/response.js";
import Stripe from 'stripe';

const stripe = new Stripe("sk_test_51OHMnlSD010bwSLtbxEWBTJYuThpDaWOA6vi3tf7nfBsu6fAVy7magTCmrrw1KNFXLD6k4cGuW6BGly0e8Y4mlfF00yNKUnfCv");

export const confirmPaymentIntent = async (req, res) => {
    const { paymentIntentId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

        if (paymentIntent.status === 'requires_action') {
            const clientSecret = paymentIntent.client_secret;

            res.status(200).json({ requiresAction: true, clientSecret });
        } else if (paymentIntent.status === 'succeeded') {
            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ error: 'Unexpected PaymentIntent status' });
        }
    } catch (error) {
        console.error('Error confirming PaymentIntent:', error.message);
        res.status(500).json({ error: error.message });
    }
};