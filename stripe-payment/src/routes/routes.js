import express from "express";
import { createCustomer } from "../controllers/create-customer.js";
import { retrieveCustomer } from "../controllers/retrieve-customer.js";
import { createToken } from "../controllers/create-token.js";
import { addCardToCustomer } from "../controllers/add-card-to-customer.js";
import { createPaymentMethod } from "../controllers/create-payment-method.js";
import { makePayment } from "../controllers/make-payment.js";
import { chargeCustomer } from "../controllers/charge-customer.js";
import { createSession } from "../controllers/create-checkout-session.js";
import { paymentSuccess } from "../controllers/payment-success.js";
import { confirmPaymentIntent } from "../controllers/complete-payment.js";

const router = express.Router();

router.post('/create-customer', createCustomer);
router.get('/retrieve-customer', retrieveCustomer);
router.post('/create-token', createToken);
router.post('/add-card', addCardToCustomer);
router.post('/create-payment-method', createPaymentMethod);
router.post('/make-payment', makePayment);
router.post('/charge-customer', chargeCustomer);
router.post('/create-checkout-session', createSession);
router.get('/payment-success', paymentSuccess);
router.post('/confirm-payment', confirmPaymentIntent);

export default router;