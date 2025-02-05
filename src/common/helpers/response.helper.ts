export const sendSuccessReponse = (data: any) => {
  return {
    ...data,
  };
};

export const sendCreatedResponse = (
  data: any,
  message: string = 'Resource created successfully',
) => {
  return {
    ...data,
    message: message,
  };
};
