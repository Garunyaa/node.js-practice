export const stripeErrorHandling = err => {
  let errorMessage = "";
  switch (err.type) {
    case "StripeCardError":
      errorMessage = err.message;
      break;
    case "StripeRateLimitError":
      errorMessage = err.message;
      break;
    case "StripeInvalidRequestError":
      errorMessage = err.message;
      break;
    case "StripeAPIError":
      errorMessage = err.message;
      break;
    case "StripeConnectionError":
      errorMessage = err.message;
      break;
    case "StripeAuthenticationError":
      errorMessage = err.message;
      break;
    default:
      errorMessage = err.message;
      break;
  }
  return errorMessage;
};
//# sourceMappingURL=helper.js.map