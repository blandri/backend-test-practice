/* eslint-disable no-return-await */
/* eslint-disable require-jsdoc */
import { Profile } from '../../database/models';

export default class ProfileServices {
  async createProfile(data) {
    return await Profile.create(data);
  }

  async updateProfile(data, id) {
    /* istanbul ignore next */
    return await Profile.update(data, {
      where: {
        user_id: id
      },
      returning: true
    });
  }
}
