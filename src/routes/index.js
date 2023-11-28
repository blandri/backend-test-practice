import express from 'express';
import home from './api/home.route';
import userRoutes from './api/user.route'
import taskRoutes from './api/task.route'


const routes = express.Router();

routes.use('/home', home);
routes.use('/user', userRoutes)
routes.use('/task', taskRoutes)

export default routes;
