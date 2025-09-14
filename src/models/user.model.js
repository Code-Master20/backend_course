import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    userEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    avatar: {
      type: String, //cloudinry url
      required: true,
    },

    coverImage: {
      type: String,
    },

    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    password: {
      type: String,
      required: [true, "Password is required"],
      min: [5, "must be atleast 5 char"],
      max: [13, "must not exceed 13 char"],
    },

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware (also called pre and post hooks) are functions which are passed control during execution of asynchronous functions. Middleware is specified on the schema level and is useful for writing plugins.

// pre middleware:
// Runs before the main action (save, find, remove, etc.) happens.
// Used for validations, modifications, transformations (like hashing passwords before saving).

// post middleware:
// Runs after the main action has completed.
// Used for logging, notifications, cleanup, error handling, etc.
// It cannot modify the document before saving (because the operation is already done)

// Key Difference:
// pre → before the action, can change data (like hashing password).
// post → after the action, can react to result (like logging, sending emails, analytics).

// Types of Mongoose Middleware:

//(1) Document middleware → runs on individual documents (like save, validate, remove, updateOne when called on a doc).
// Example: userSchema.pre("save", ...)
// Runs before saving a document with .save() or .create().

//(2) Query middleware → runs before/after queries (like find, findOne, updateOne, etc.).
// Example: userSchema.pre("find", ...)

//(3) Aggregate middleware → runs before/after .aggregate().
// Example: userSchema.pre("aggregate", ...)

//(4) Model middleware → runs on the model level for functions like insertMany.

//it is a Document Middleware (also called pre-save hook) in Mongoose. used to do something before model creation
//password encryption with bcrypt- an npm library

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});

// schema.methods → defines instance methods (available on individual documents). for a particular user(or doc)
// schema.statics → defines static methods (available on the model itself).

//injecting methods (custom-method) or you can say "a document instance method"
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); //this will return true or false on the basis of user-input pasword and the password encrypted by bcrypt
};

// Access Token → short-lived (e.g., 15 min, 1 hour). Used for actual API requests.
// Refresh Token → long-lived (e.g., 7 days, 30 days). Used only to get new Access Tokens when the old one expires.

// Idea: You don’t want access tokens to live too long (security risk), but you also don’t want users logging in every 15 min.So, refresh tokens balance this out.

// jwt.sign(payload, secret, options) creates a JWT token.
userSchema.methods.generateAccesToken = async function () {
  //jwt.sign used to generate token
  return jwt.sign(
    //payloads
    {
      _id: this._id, //this id will be generateed by mongodb
      userEmail: this.userEmail,
      userName: this.userName,
      fullName: this.fullName,
    },
    //secret
    process.env.ACCESS_TOKEN_SECRET,
    // Options (expiry, etc.)
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Used only to get new Access Tokens when the old one expires.
userSchema.methods.generateRefreshToken = async function () {
  //jwt.sign used to generate token
  return jwt.sign(
    //payloads
    {
      _id: this._id, //this id will be generateed by mongodb
    },
    //secret
    process.env.REFRESH_TOKEN_SECRET,

    // Options (expiry, etc.)
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = model("User", userSchema);
