import { verifyToken } from "./authToken.js";

const checkAuth = (req) => {
    const token = req.headers['authorization'] || req.headers.Authorization;
      
    if (token && token.startsWith('Bearer ')) {
      try {
        const decodedToken = verifyToken(token);
  
        return decodedToken;
      } catch (err) {
        throw new Error("Invalid/Expired token");
      }
    }
  
    throw new Error("Authentication token must be provided");
  };

  export default checkAuth