import { User } from '../../database/models'
import { decodeToken } from '../helpers/user.helpers';

export const checkLoggedInUser = async (req, res, next) => {
    try {
      const token =
        req.headers.authorization && req.headers.authorization.split(' ')[1];
    
      if (!token) return res.status(403).json({ message: 'User not logged in' });
  
      const decoded = decodeToken(token);
      const freshUser = await User.findByPk(decoded.userId);
      req.user = freshUser;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Access denied' });
    }
  };