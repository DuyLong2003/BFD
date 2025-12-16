import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { isValidObjectId, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { hashPasswordHelper } from 'src/helpers/util';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private eventsGateway: EventsGateway,
  ) { }

  // chạy 1 lần khi khởi động Server
  async onModuleInit() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const count = await this.userModel.countDocuments({ role: 'admin' });
    if (count === 0) {
      const defaultPassword = await bcrypt.hash('admin123', 10);

      await this.userModel.create({
        username: 'admin',
        email: 'admin@bfd.com',
        password: defaultPassword,
        role: 'admin',
        name: 'Super Admin'
      });

      console.log('SEED: Tạo thành công tài khoản Admin mặc định (admin / admin123)');
    }
  }
  // ^ Kết thúc phần Seed

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userModel.findOne({ username: createUserDto.username });
    if (existUser) {
      throw new BadRequestException('Username đã tồn tại');
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Thay thế password gốc bằng password đã mã hóa
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    await newUser.save();

    this.eventsGateway.emitNewUser(newUser);

    return newUser;
  }

  async findAll(query: { page?: string; limit?: string; q?: string; sort?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (query.q) {
      filter.$or = [
        { username: { $regex: query.q, $options: 'i' } },
        { email: { $regex: query.q, $options: 'i' } }
      ];
    }

    let sortConfig: any = { createdAt: -1 };
    if (query.sort) {
      const isDesc = query.sort.startsWith('-');
      const field = query.sort.replace('-', '');
      sortConfig = { [field]: isDesc ? -1 : 1 };
    }

    const total = await this.userModel.countDocuments(filter);

    const data = await this.userModel
      .find(filter)
      .select('-password')
      .sort(sortConfig)
      .skip(skip)
      .limit(limit)
      .exec();

    return { data, total };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('ID User không hợp lệ');

    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) throw new NotFoundException('User không tồn tại');

    return user;
  }

  async findOneByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }

  isValidPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id)) throw new BadRequestException('ID User không hợp lệ');

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();

    if (!updatedUser) throw new NotFoundException('User không tồn tại');
    return updatedUser;
  }

  async remove(_id: string) {
    if (!isValidObjectId(_id)) throw new BadRequestException('ID User không hợp lệ');

    const deletedUser = await this.userModel.findByIdAndDelete(_id).exec();
    if (!deletedUser) throw new NotFoundException('User không tồn tại');

    if (deletedUser) {
      this.eventsGateway.emitDeletedUser(_id);
    }

    return deletedUser;
  }

  isUsernameExist = async (username: string) => {
    const user = await this.userModel.exists({ username });
    if (user) return true;
    return false;
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { username, role, password } = registerDto;
    const isExist = await this.isUsernameExist(username);
    if (isExist) {
      throw new BadRequestException(`Username đã tồn tại: ${username}. Vui lòng sửa dụng tên khác`)
    }

    const hashPassword = await hashPasswordHelper(password);

    const user = await this.userModel.create({
      username, role, password: hashPassword,
    })
    return {
      _id: user._id
    }
  }
}
