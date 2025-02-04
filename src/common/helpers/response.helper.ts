export const sendSuccessReponse = (data: any, message: string = 'Success') => {
  return {
    success: true,
    data,
    message: message,
  };
};

export const sendCreatedResponse = (
  data: any,
  message: string = 'Resource created successfully',
) => {
  return {
    success: true,
    data,
    message: message,
  };
};
