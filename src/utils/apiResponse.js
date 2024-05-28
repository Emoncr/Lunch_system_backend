export const errorResponse = (statusCode, message) => {
  const err = new Error();
  err.statusCode = statusCode;
  err.message = message;
  return err;
};

export const successResponse = (resMsg, data) => {
  const message = resMsg || "success";
  const responseObj = {
    success: true,
    message,
  };
  if (data !== undefined) {
    responseObj.result = data;
  }

  return responseObj;
};
