import express from 'express';
import { checkEmailExist, retrieveFEBaseUrl } from '../../middlewares/user.middleware';
import registerValidation from '../../validations/register.validations';
import UserController from '../../controllers/user.controller';
import { checkLoggedInUser } from '../../middlewares/access.middleware';
import resetValidation from '../../validations/reset.validation';
import resetRequestValidation from '../../validations/resetRequest.validation';

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

routes.get('/users', async (req, res) => {
  await new UserController().getAllUsers(req, res)
})

routes.post('/login', async (req, res) => {
    await new UserController().userLogin(req, res)
})

routes.post('/logout', 
checkLoggedInUser,
async (req, res) => {
    await new UserController().Logout(req, res)
})

routes.post('/update-profile',
 checkLoggedInUser,
 async (req, res) => {
  await new UserController().profileUpdate(req, res)
})

routes.patch(
  '/reset-password/:token',
  resetValidation,
  async (req, res) => {
    await new UserController().passwordReset(req, res)
  }
);

routes.post(
  '/reset-password-request', 
  resetRequestValidation,
  async (req, res) => {
    await new UserController().passwordResetRequest(req, res)
  }
);

export default routes;