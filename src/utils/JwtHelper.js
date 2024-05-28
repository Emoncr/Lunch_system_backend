import jwt from "jsonwebtoken";



export const generateToken = (payload) => {
  console.log(payload);
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "720h", 
    issuer: "localhost",
  });
  return token;
};

