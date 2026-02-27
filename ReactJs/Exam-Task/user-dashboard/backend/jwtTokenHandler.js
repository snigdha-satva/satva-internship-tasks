import { SignJWT, jwtVerify } from "jose"

const SECRET_KEY = new TextEncoder().encode("react_exam_task_key_26")

export const signToken = async (payload) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET_KEY);
};

export const verifyToken = async (token) => {
  const { payload } = await jwtVerify(token, SECRET_KEY);
  return payload;
};

export const decodeToken = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(window.atob(base64));
};