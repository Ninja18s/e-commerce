import { FilterQuery, ProjectionType, QueryOptions } from "mongoose";
import { IPagination } from "@utils/interface";
import { LIMIT } from "@utils/constants";
import { IUser } from "@interfaces/user.interface";
import UserModel from "@infra/database/mongodb/models/user.model";

class GetUserService {
  async findOne(
    whereCondition?: FilterQuery<IUser>,
    projection?: ProjectionType<IUser>,
    option?: QueryOptions<IUser>
  ): Promise<IUser | null> {
    return await UserModel.findOne(whereCondition, projection, option).lean();
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await this.findOne({ _id: id }, { password: 0 });
  }

  async getUserByPhoneOrEmail({
    phone,
    email,
    countryCode,
  }: {
    phone?: string;
    email?: string;
    countryCode?: string;
  }) {
    const whereCondition: FilterQuery<IUser> = {
      $or: [
        {
          email,
        },
        {
          phone,
          countryCode,
        },
      ],
    };
    return this.findOne(whereCondition, { password: 0 });
  }

  async getPaginatedUsers(
    whereCondition: FilterQuery<IUser>,
    pagination: IPagination,
    option: QueryOptions<IUser> = {}
  ) {
    let paginationQuery: FilterQuery<IUser> = {};
    option!.sort = { createdAt: -1, ...(option?.sort || {}) };
    if (pagination?.hasMore) {
      paginationQuery = {
        $or: [
          {
            createdAt: {
              $lte: pagination.nextCreatedAt,
            },
          },
          {
            createdAt: pagination.nextCreatedAt,
            _id: {
              $lte: pagination.nextId,
            },
          },
        ],
      };
    }
    const users = await UserModel.find(
      {
        ...whereCondition,
        ...paginationQuery,
      },
      {},
      option
    )
      .limit(LIMIT + 1)
      .lean();
    const response: {
      users?: IUser[];
      pagination?: IPagination;
    } = {};

    if (users.length > LIMIT) {
      response.pagination = {
        hasMore: true,
        nextCreatedAt: users[LIMIT].createdAt.toISOString(),
        nextId: users[LIMIT]._id.toString(),
      };
    }
    response.users = users.slice(0, LIMIT);
    return response;
  }
}

export default new GetUserService();
