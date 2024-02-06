import { IUser } from "@interfaces/user.interface";
import UserModel from "@infra/database/mongodb/models/user.model";
import { UnprocessableEntity } from "@utils/errors";

class UpdateUserService {
  async update(id: string, user: Partial<IUser>): Promise<IUser> {
    const getUser = await UserModel.findOne({ _id: id }, {password: 0}).exec();
    if (!getUser) {
      throw UnprocessableEntity("Something went wrong");
    }
    Object.assign(getUser, user);
    const updatedUser = await getUser.save();

    return updatedUser;
  }
}

export default new UpdateUserService();
