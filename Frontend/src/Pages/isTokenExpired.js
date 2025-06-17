import { jwtDecode } from 'jwt-decode'; 


const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    const now = Date.now() / 1000; // in seconds
    return exp < now;
  } catch (e) {
    return true; // if token is invalid or can't be decoded
  }
};

export default isTokenExpired;
