import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema({
  customer_name: {
    type: String
  },
  customer_email: {
    type: String
  },
  customer_id: {
    type: String
  },
  payment_id: {
    type: String
  }
});
export const Payment = mongoose.model("Payment", paymentSchema);
//# sourceMappingURL=payment-model.js.map