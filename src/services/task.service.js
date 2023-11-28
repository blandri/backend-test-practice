/* eslint-disable no-return-await */
/* eslint-disable require-jsdoc */
import { Project, Task } from '../../database/models';

export default class TaskServices {
  async createTask(data) {
    return await Task.create(data);
  }

  async getTasks(offset, filter, limit) {
    const tasks = await Task.findAndCountAll({
      offset: offset || 0,
      limit: limit || null,
      order: filter && [[filter, 'DESC']] || [['createdAt', 'DESC']],
      include: {
        model: Project,
        as: 'project',
        attributes: ['title', 'description']
      }
    });
    return tasks;
  }

  async updateTask(data, id) {
    const updated = await Task.update(data, {
      where: { id },
      returning: true,
      raw: true
    });
    return updated
  }

  async destroyTask(where) {
    const destroyed = await Task.destroy({
      where: {
        id: where
      }
    });
    return destroyed;
  }
}
