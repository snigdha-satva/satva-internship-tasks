import bcrypt from "bcryptjs";
import api from "./api";
import { signToken } from "../jwtTokenHandler";

export const loginService = async (email, password) => {
  const response = await api.get(`/users?email=${encodeURIComponent(email)}`);
  const users = response.data;
  console.log("1. Users found:", users);
  console.log("2. Email searched:", email);

  if (!users.length) throw new Error("Invalid credentials");

  const user = users[0];
  console.log("3. Stored hash:", user.password);
  console.log("4. Password entered:", password);

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("5. Password match result:", isMatch);

  if (!isMatch) throw new Error("Invalid credentials");

  const { password: _pw, ...safeUser } = user;
  const token = await signToken({ id: user.id, email: user.email, roleId: user.roleId });
  return { user: safeUser, token };
};