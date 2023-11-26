import express from 'express';
import UserController from '../../controllers/user.controller';
import passport from '../../middlewares/passport.middleware'

const authent = express.Router();

authent.get('/google/redirect', passport.authenticate('google', {
    session: false,
    failureRedirect: '/api/auth/google/failure'
  }), async (req, res) => {console.log('===>')
    /* istanbul ignore next */
    await new UserController().googleLogin(req, res);
})

authent.get('/google/success', async (req, res) => {console.log('===>')
    /* istanbul ignore next */
    await new UserController().googleLogin(req, res);
})

authent.get('/google/failure', async (req, res) => {
    /* istanbul ignore next */
    console.log('google failed')
})

export default authent;
