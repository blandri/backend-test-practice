import express from 'express';
import home from './api/home.route';
import userRoutes from './api/user.route'
import authent from './api/auth.route';


const routes = express.Router();

routes.use('/home', home);
routes.use('/user', userRoutes)
routes.use('/auth', authent)

export default routes;
