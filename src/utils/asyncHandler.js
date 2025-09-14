// In Express, when you write an async route/controller, if it throws an error (or rejects a promise), you normally need to wrap it in a try/catch. Otherwise, Express won’t catch the error and your app can crash.

// asyncHandler is a utility function that takes any async route handler and automatically catches rejected promises and forwards them to Express’s next(error) middleware.

// How It Works
//(1) asyncHandler is a higher-order function → it takes a requestHandler function and returns a new function.
//(2) That returned function is the actual Express middleware signature (req, res, next) or in some variations (error, req, res, next).
//(3) Inside, it calls:Promise.resolve(requestHandler(error, req, res, next))
//(4) Promise.resolve() makes sure that even if requestHandler is an async function (which returns a promise), it will always be handled as a promise.
//(5) If it resolves → nothing special happens (the controller works normally).
//(6) If it rejects (throws an error) → .catch((error) => next(error)) forwards the error to Express’s error handler.
// the returned function should usually be (req, res, next) without error in the first place.

/* Without asyncHandler:
app.get("/users", async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
});


With asyncHandler:
app.get("/users", asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.json(users);
}));

*/
//SEEING PROMISE-WISE
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};

export { asyncHandler };

//SEEING TRY-CATCH
//async is a higher-order function that can accept another function as a parameter and can return it.
// const asyncHandler = (fn) => {async () => {}}

/*
const asyncHandler = (fn) => async (req, res, next) => {
  //we are extracting (error,req, res, next) from passed fn, that passed as a parameter
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      //if user sending error from frontend--> error.code if not --> 500 <--this will depend on situation
      success: false,
      message: error.message,
    });
  }
};

*/
