export const successResponse = (res, statusCode, message, data) => {
  const response = {
    status: true,
    status_code: statusCode,
    message: message,
    data: data
  };
  return res.status(statusCode).json(response);
};
export const errorResponse = (res, statusCode, message, data) => {
  const response = {
    status: false,
    status_code: statusCode,
    message: message,
    data: data
  };
  return res.status(statusCode).json(response);
};
//# sourceMappingURL=response.js.map