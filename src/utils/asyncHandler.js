//SEEING PROMISE-WISE
const asyncHandler = (requestHandler) => {
  (error, req, res, next) => {
    Promise.resolve(requestHandler(error, req, res, next)).catch((error) =>
      next(error)
    );
  };
};

export { asyncHandler };

/*


//SEEING TRY-CATCH
//async is a higher-order function that can accept another function as a parameter and can return it. 
// const asyncHandler = (fn) => {async () => {}}

const asyncHandler = (fn) => async (error, req, res, next) => {
  //we are extracting (error,req, res, next) from passed fn, that passed as a parameter
  try {
    await fn(error, req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      //if user sending error from frontend--> error.code if not --> 500 <--this will depend on situation
      success: false,
      message: error.message,
    });
  }
};


*/
