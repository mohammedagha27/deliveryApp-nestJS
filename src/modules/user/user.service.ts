import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { ERRORS, REPOS, SECRET_KEY } from 'src/common/constants';
import { checkPassword, generateToken, hashPassword } from 'src/common/utils';
import { Address } from '../address/address.model';
import { AddressService } from '../address/address.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.model';
import { CreateAddressDto } from '../address/dto/create-address.dto';
@Injectable()
export class UserService {
  constructor(
    @Inject(REPOS.USER_REPOSITORY) private readonly userRepository: typeof User,
    private readonly configService: ConfigService,
    private readonly addressService: AddressService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { address, ...userData } = createUserDto;

    const dbUser = await this.findUserByEmail(userData.email);
    if (dbUser) throw new ConflictException(ERRORS.USER_EXIST);

    const hashedPassword = await hashPassword(userData.password);
    const addressId = await this.addressService.checkAddressExist(address);

    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
      addressId,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, role, updatedAt, createdAt, ...resData } =
      user.dataValues;
    const token = generateToken(
      user.id,
      role,
      this.configService.get(SECRET_KEY),
    );

    return { ...resData, token };
  }

  async login(loginDto: LoginDto) {
    const user = await this.findUserByEmail(loginDto.email);
    if (!user) throw new BadRequestException(ERRORS.LOGIN_ERROR);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, role, updatedAt, createdAt, ...resData } =
      user.dataValues;
    const checkPass = await checkPassword(loginDto.password, password);
    if (!checkPass) throw new BadRequestException(ERRORS.LOGIN_ERROR);
    const token = generateToken(
      user.id,
      role,
      this.configService.get(SECRET_KEY),
    );
    return { token, ...resData };
  }

  async findAllUsers() {
    const users = await this.userRepository.scope('basicData').findAll();
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository
      .scope('basicData')
      .findOne({ where: { id } });
    return user;
  }

  async deleteUser(id: number) {
    const user = await this.findOne(id);
    await user.destroy();
    return;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne<User>({ where: { email } });
    return user;
  }
}
