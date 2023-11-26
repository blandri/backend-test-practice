/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable lines-between-class-members */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-unresolved */
/* eslint-disable require-jsdoc */
import { config } from 'dotenv';
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

config();

export default class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async createUser(req, res) {
    try {
        const { name, email, password } = req.body
        const user = await new UserService().createUser({
            name,
            email,
            password: hashPassword(password)
        }, res)
        const token = generateToken({ id: user.id }, '1d');

        const text = `
         Hello, thanks for registering on Barefoot Nomad site.
         Please copy and paste the address below into address bar to verify your account.
         $${process.env.BASE_URL}/api/users/verify-email/${token}
         `;

      const code = `
      <h1><strong>Account created require verification</strong></h1>
      <p style="text-align: center;">Thank you for registering into Barefoot Nomad. Click the link below to verify and activate your account.</p>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
            <tbody>
              <tr>
                <td align="center">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td> <a href="${process.env.FRONT_END_URL}/verify?token=${token}" target="_blank">Verify email</a> </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
      `;
      const html = message(code);

      await nodemailer('landrybrok3@gmail.com', 'Email Verification', text, html);

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

  static async getAllUsers(req, res) {
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
    } catch (error) {
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
      /* istanbul ignore next */
      if (user.name) {
        return res.status(200).json({
          message: `You have been logged out ${user.name}`
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: error.message,
        message: 'error occured while logging you out'
      });
    }
  }

  async verifyNewUser(req, res) {
    try {
      const { token } = req.params;

      const userInfo = decodeToken(token.split('=')[1]);

      const userId = userInfo.id;

      const user = await new UserService().findById(userId)

    //   await user.update({ isVerified: true }, { where: { id: userId } });
      return res.status(200).json({
        status: 200,
        message: 'Your email has been verified successfully',
        redirect: `${process.env.BASE_URL}/api/user/verified`,
        data: user
      });

    //   return res.redirect(`${process.env.BASE_URL}/api/user/verified`);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  async googleLogin(req, res) {
    try {
      const profile = req.user;
console.log(profile)
      let user = await new UserService().getUser(profile.emails[0].value);

      if (!user) {
        user = await new UserService().createUser({
          email: profile.emails && profile.emails[0].value,
          password: null,
          name: profile.name && profile.name.familyName
        });
      }

      const token = generateToken(
        {
          email: user.email,
          userId: user.id,
          firstName: user.name,
        },
        '1d'
      );

      const params = new URLSearchParams();
      params.set('email', user.email);
      params.set('first_name', user.name);
      params.set('token', token);

      return res
        .status(200)
        .json({
            status: 200,
            message: 'Your have logged in successfully',
            token
        });
        // .send(
        //   `<script> window.location = "${fs.readFileSync(
        //     'FE_BASE_URL'
        //   )}/?${params}"</script>`
        // );
    } catch (error) {
      return res.status(500).json({
        message: 'Error occured while logging in',
        data: error.message
      });
    }
  }

//   static async passwordResetRequest(req, res) {
//     try {
//       const exist = await new UserService().userExist(req.body.email);
//       if (exist.email) {
//         const tokenid = generateToken({ id: exist.id }, '10m');
//         const code = `
//         <h1><strong>You have requested to reset your password</strong></h1>
//         <p>We cannot simply send you your old password. A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions.</p>
//         <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
//             <tbody>
//               <tr>
//                 <td align="center">
//                   <table role="presentation" border="0" cellpadding="0" cellspacing="0">
//                     <tbody>
//                       <tr>
//                         <td> <a href="${process.env.FRONT_END_URL}/resetPassword?token=${tokenid}" target="_blank">Reset password</a> </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         `;
//         const html = message(code);
//         await nodemailer(
//           exist.email,
//           'Reset password',
//           'Request for reset password',
//           html
//         );
//         return res.status(200).json({
//           status: 200,
//           message: 'Password reset link has been sent to your email'
//         });
//       } else {
//         res.status(404).json({ status: 404, message: 'Email not found' });
//       }
//     } catch (error) {
//       /* istanbul ignore next */
//       console.log(error);
//       return res.status(500).json({ error: error.message });
//     }
//   }

//   static async passwordReset(req, res) {
//     try {
//       const { password } = req.body;
//       const { token } = req.params;
//       const userInfo = jwt.verify(token, process.env.SECRETE);
//       const userId = userInfo.id;
//       const newPassword = await bcryptjs.hash(password, 10);
//       User.update({ password: newPassword }, { where: { id: userId } });
//       return res
//         .status(200)
//         .send({ message: 'Your new password has been set return to Login' });
//     } catch (error) {
//       return res.status(500).send({ message: error.message });
//     }
//   }
}
