import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};


export const comparePassword = async (password: string, hashed: string): Promise<boolean> => {
  const result = await bcrypt.compare(password, hashed);
  return result
}