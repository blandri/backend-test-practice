import express from 'express';
import { checkEmailExist, retrieveFEBaseUrl } from '../../middlewares/user.middleware';
import registerValidation from '../../validations/register.validations';
import UserController from '../../controllers/user.controller';
import path from 'path';
import passport from '../../middlewares/passport.middleware'

const routes = express.Router();

routes.post(
    '/register',
    registerValidation,
    checkEmailExist,
    // passport.authenticate('local', { session: false }),
    async (req, res) => {
      await new UserController().createUser(req, res)
    }
);

routes.post('/login', async (req, res) => {
    await new UserController().userLogin(req, res)
})

routes.get(
    '/google/login',
    retrieveFEBaseUrl,
    passport.authenticate('google', {
      session: false,
      scope: ['profile', 'email'],
      prompt: 'select_account'
    }),
);

routes.post('/logout', async (req, res) => {
    await new UserController().Logout(req, res)
})

routes.get('/verify-email/:token', async (req, res) => {
    await new UserController().verifyNewUser(req, res);
  });

routes.get('/verified', async (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/verified.html'));
});

export default routes;