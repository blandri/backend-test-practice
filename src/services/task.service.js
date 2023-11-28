/* eslint-disable no-return-await */
/* eslint-disable require-jsdoc */
import { Project, Task } from '../../database/models';

export default class TaskServices {
  async createTask(data) {
    return await Task.create(data);
  }

  async getTasks({ where, offset, order, limit }) {
    const rooms = await Task.findAndCountAll({
      where,
      offset,
      limit,
      order: order || [['createdAt', 'DESC']],
      include: {
        model: Project,
        as: 'project',
        attributes: ['title', 'description']
      }
    });
    return rooms;
  }

  async updateTask(data, id) {
    /* istanbul ignore next */
    return await Task.update(data, {
      where: {
        id: id
      },
      returning: true
    });
  }

  async destroyTask({ where }) {
    const destroyed = await Task.destroy({ where });
    return destroyed;
  }
}
