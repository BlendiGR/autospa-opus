import bcrypt from "bcryptjs";

/**
 * Hashes a password with a generated salt.
 */
export const saltAndHashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

/**
 * Verifies a password against a hash.
 */
export const verifyPassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};
