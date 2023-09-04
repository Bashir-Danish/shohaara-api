import { catchAsync } from "../middlewares.js";
import jwt from "jsonwebtoken";
let decodedData;

export const isAuthenticatedUser = catchAsync(async (req, res, next) => {
  const token =
    req.headers["x-access-token"] ||
    req.headers["authorization"] ||
    req.headers["x-token"] ||
    req.query.token;
  if (!token) {
    res.status(401).send({ message: "Please Login to access this resource" });
  }
  if (jwt.verify(token, process.env.SECRET)) {

    decodedData = jwt.verify(token, process.env.SECRET);
    next();
  }
});
export const isAdmin = catchAsync(async (req, res, next) => {
  if (decodedData) {
    if (decodedData.isAdmin == true) {
      next();
    } else {
      res.status(401).send({ message: "Admin can access this resource" });
    }
  }
});
