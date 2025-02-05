export const sendSuccessReponse = (data: any, message: string = 'Success') => {
  return {
    data,
    message: message,
  };
};

export const sendCreatedResponse = (
  data: any,
  message: string = 'Resource created successfully',
) => {
  return {
    data,
    message: message,
  };
};
