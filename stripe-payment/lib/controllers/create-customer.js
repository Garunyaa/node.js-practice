import { createCustomers } from "../services/stripe-service";
import { successResponse, errorResponse } from "../utils/response";
export const createCustomer = async (req, res) => {
  try {
    const {
      email,
      name,
      description,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country
    } = req.body;
    const customer = await stripe.customers.create({
      email,
      name,
      description,
      phone,
      address: {
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country
      }
    });
    return successResponse(res, 200, "Customer created", customer);
  } catch (error) {
    return errorResponse(res, 500, "Failed to create customer", {
      error: error.message
    });
  }
};
//# sourceMappingURL=create-customer.js.map