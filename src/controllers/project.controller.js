/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable lines-between-class-members */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-unresolved */
/* eslint-disable require-jsdoc */
import { config } from 'dotenv';
import ProjectServices from '../services/project.service';

config();

export default class UserController {
  constructor() {
    this.userService = new ProjectServices()
  }

  async createProject(req, res) {
    try {
        const { title, description } = req.body

        const project = await new ProjectServices().createProject({ title, description })

      return res.status(201).json({
          message: 'Created project successfully',
          data: project
      });
    } catch (error) {
        return res.status(500).json({
            message: 'Error occured while creating the project',
            error: error.message
          });
    }
  }

  static async getAllProjects(req, res) {
    try {
      const projects = await new ProjectServices().getProjects()
      return res.status(200).json({
        message: 'Retrieved all projects successfully',
        data: projects
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error occured while retrieving aprojects',
        error: error.message
      });
    }
  }
}
