import express from 'express';
import { checkEmailExist, retrieveFEBaseUrl } from '../../middlewares/user.middleware';
import registerValidation from '../../validations/register.validations';
import UserController from '../../controllers/user.controller';
import { checkLoggedInUser } from '../../middlewares/access.middleware';
import resetValidation from '../../validations/reset.validation';
import resetRequestValidation from '../../validations/resetRequest.validation';
import ProjectController from '../../controllers/project.controller';
import TaskController from '../../controllers/task.controller';

const routes = express.Router();

routes.post(
    '/create-project', 
    checkLoggedInUser,
    async (req, res) => {
    await new ProjectController().createProject(req, res)
})

routes.get(
    '/projects', 
    checkLoggedInUser,
    async (req, res) => {
    await new ProjectController().getAllProjects(req, res)
})

routes.post(
  '/create-task', 
  checkLoggedInUser,
  async (req, res) => {
  await new TaskController().createTask(req, res)
})

routes.get(
  '/tasks/:offset/:limit/:filter', 
  checkLoggedInUser,
  async (req, res) => {
  await new TaskController().getAllTasks(req, res)
})

routes.delete(
  '/:id',
  checkLoggedInUser,
  async (req, res) => {
  await new TaskController().deleteTask(req, res)
})

routes.patch(
  '/:id',
  checkLoggedInUser,
  async (req, res) => {
  await new TaskController().updateTask(req, res)
})

routes.get(
  '/download-excel',
  checkLoggedInUser,
  async (req, res) => {
  await new TaskController().downloadExcel(req, res)
})

export default routes;