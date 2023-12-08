import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma.service";
import { UsersService } from "src/users/users.service";
import { LoginDto } from "./dto/login-user.dto";
import * as bcrypt from 'bcrypt';
import { RegisterUsersDto } from "./dto/register-user.dto";
import { Users } from "src/users/users.model";

@Injectable()
export class AuthService{
    
    constructor(
        private readonly prismaService: PrismaService,
        private jwtService: JwtService,
        private readonly usersService: UsersService){}

    
    async login(loginDto: LoginDto):Promise<any>{
        const {email,username, password} = loginDto;

        let user;
        if (email) {
            user = await this.prismaService.users.findUnique({
                where: { email }
            });
        } else if (username) {
            user = await this.prismaService.users.findUnique({
                where: { username }
            });
        }

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const validatePassword = await bcrypt.compare(password, user.password);

        if (!validatePassword) {
            throw new NotFoundException('Invalid password');
        }

        return {
            token: this.jwtService.sign({ email: user.email, username: user.username })
        };
    }
    

    async register (createDto: RegisterUsersDto): Promise<any>{
        const createUsers = new Users()
        createUsers.name = createDto.name
        createUsers.email = createDto.email
        createUsers.username = createDto.username
        createUsers.age = createDto.age
        createUsers.password = await bcrypt.hash(createDto.password,10)

        const user = await this.usersService.createUser(createUsers)
        
        
        return {
            token: this.jwtService.sign({username: user.username})
        }
    }
}