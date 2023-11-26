import fs from 'fs';
import { User } from '../../database/models'

export const checkEmailExist = async (req, res, next) => {
    const { email } = req.body;
    const emailExist = await User.findOne({
      where: {
        email
      }
    });
    if (emailExist)
      return res
        .status(409)
        .json({ message: `User with email ${email} already exist` });
  
    return next();
};

export const retrieveFEBaseUrl = async (req, res, next) => {
    const { BASE_URL } = req.query;
  
    if (BASE_URL) {
      fs.writeFileSync('FE_BASE_URL', BASE_URL);
    }
  
    return next();
};