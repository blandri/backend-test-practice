/* eslint-disable no-return-await */
/* eslint-disable require-jsdoc */
import { Project, Task } from '../../database/models';

export default class ProjectServices {

  async createProject(data) {
    return await Project.create(data);
  }

  async getProjects() {
    const projects = await Project.findAll()
    return projects;
  }
}
