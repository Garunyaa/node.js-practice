import express from "express";
import { createCustomer } from "../controllers/create-customer";
const router = express.Router();
router.post('/create-customer', createCustomer);
router.get('/get-customer', retrieveCustomer);
router.post('/create-token', createToken);
router.post('/add-card', addCardToCustomer);
router.post('/create-payint', createPaymentIntent);
router.post('/add-address', addAddressToCustomer);
router.post('/charge-customer', chargeCustomerThroughID);
export default router;
//# sourceMappingURL=routes.js.map