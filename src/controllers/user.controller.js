/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable lines-between-class-members */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-unresolved */
/* eslint-disable require-jsdoc */
import { config } from 'dotenv';
import { User } from '../../database/models'
import UserService from '../services/user.services'
import {
  generateToken,
  comparePassword,
  hashPassword,
  decodeToken,
} from '../helpers/user.helpers';
import nodemailer from '../helpers/nodemailer.helper'
import message from '../views/verificationMessage';
import fs from 'fs'
import ProfileService from '../services/profile.service';

config();

export default class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async createUser(req, res) {
    try {
        const { first_name, last_name, email, password } = req.body

        const user = await new UserService().createUser({
            first_name, 
            last_name,
            email,
            password: hashPassword(password)
        }, res)
        await new ProfileService().createProfile({ user_id: user.id })
        const token = generateToken({ userId: user.id, email: user.email }, '1d');

      return res.status(201).header('authenticate', token).json({
          message: 'Created user successfully',
          token,
          data: user
      });
    } catch (error) {
        return res.status(500).json({
            message: 'Error occured while creating a user',
            error: error.message
          });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await new UserService().getAllUsers();
      return res.status(200).json({
        message: 'Retrieved all users successfully',
        data: users
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error occured while creating a user',
        error: error.message
      });
    }
  }

  async userLogin(req, res) {
    try {
      const user = await this.userService.userLogin(req.body.email, res);

      if(user){
        const validation = await comparePassword(
          req.body.password,
          user.password
        );
        if (validation) {
          const token = await generateToken(
            {
              email: user.email,
              userId: user.id,
              firstName: user.name,
            },
            '1d'
          );
          return res.status(201).header('authenticate', token).json({
            message: 'Logged in successfully',
            token,
            name: user.name,
          });
        }
        return res.status(400).json({ message: 'Invalid password' });
      }
      return res.status(400).json({ message: 'This account does not exist' });
    } catch (error) {console.log(error)
      return res.status(404).json({
        message: 'Error occured while logging in',
        error
      });
    }
  }

  async Logout(req, res) {
    try {
      const user = await this.userService.userLogout(
        req.headers.authorization.split(' ')[1]
      );
      
      if (user.first_name) {
        return res.status(200).json({
          message: `You have been logged out ${user.first_name}`
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: error.message,
        message: 'error occured while logging you out'
      });
    }
  }

  async passwordResetRequest(req, res) {console.log('==>', req)
    try {
      const exist = await new UserService().userExist(req.body.email);
      if (exist.email) {
        const tokenid = generateToken({ userId: exist.id }, '10m');
        const code = `
        <h1><strong>You have requested to reset your password</strong></h1>
        <p>We cannot simply send you your old password. A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions.</p>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
            <tbody>
              <tr>
                <td align="center">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td> <a href="${process.env.FRONT_END_URL}/reset-password/token?${tokenid}" target="_blank">Reset password</a> </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        `;
        const html = message(code);
        await nodemailer(
          'bishingalandry@gmail.com',
          'Reset password',
          'Request for reset password',
          html
        );
        return res.status(200).json({
          status: 200,
          message: 'Password reset link has been sent to your email'
        });
      } else {
        res.status(404).json({ status: 404, message: 'Email not found' });
      }
    } catch (error) {
      /* istanbul ignore next */
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }

  async passwordReset(req, res) {
    try {
      const { password } = req.body;
      const { token } = req.params;
      const userInfo = decodeToken(token)

      const userId = userInfo.userId;
      const newPassword = hashPassword(password)

      User.update({ password: newPassword }, { where: { id: userId } });
    
      return res
        .status(200)
        .send({ message: 'Your new password has been set return to Login' });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

async profileUpdate(req, res) {
  try {
    const { user } = req;
    const {
      occupation,
      language,
      age,
      gender,
      country
    } = req.body;
  
    const updatedUser = await new ProfileService().updateProfile(
      {
        occupation,
        language,
        age,
        gender,
        country
      },
      user.id
    );
    
    return res.status(200).json({
      message: 'Profile updated',
      data: updatedUser
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error occured while updating your profile',
      error
    });
  }
}
}
