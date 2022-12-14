import * as jwt from 'jsonwebtoken';

const generateToken = (id: number, role: string, secretKey: string) => {
  return jwt.sign({ id, role }, secretKey, {
    expiresIn: '24h',
  });
};

const verifyToken = (token, secret): any =>
  jwt.verify(token, secret, (err, decode) => {
    if (err) {
      return false;
    }
    return decode;
  });
export { verifyToken, generateToken };
