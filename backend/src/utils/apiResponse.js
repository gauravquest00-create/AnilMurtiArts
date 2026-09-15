/**
 * Consistent API response helper
 */
const sendResponse = (res, statusCode = 200, message = 'Success', data = null, pagination = null) => {
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  if (pagination !== null) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode = 500, message = 'An error occurred', errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  sendResponse,
  sendError
};
