import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { isValidObjectId, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { hashPasswordHelper } from 'src/helpers/util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    // Check trùng username trước
    const existUser = await this.userModel.findOne({ username: createUserDto.username });
    if (existUser) {
      throw new BadRequestException('Username đã tồn tại');
    }

    // Mã hóa mật khẩu (Hashing)
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Thay thế password gốc bằng password đã mã hóa
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return newUser.save();
  }

  findAll() {
    return this.userModel.find().select('-password').exec();
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

    // Nếu user update password thì phải hash lại
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

    //hash password
    const hashPassword = await hashPasswordHelper(password);

    //Lưu user vào MongoDB
    const user = await this.userModel.create({
      username, role, password: hashPassword,
    })
    return {
      _id: user._id
    }
  }
}
