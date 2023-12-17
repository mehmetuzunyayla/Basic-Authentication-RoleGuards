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
        const {email, username, password} = loginDto;

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
        const { role, ...userDto } = createDto; // Extract role from DTO
        const createUsers = new Users();
        Object.assign(createUsers, userDto); // Assign other properties
        createUsers.password = await bcrypt.hash(createDto.password, 10);
        if (role) {
            // If a role is provided in the DTO, use it
            createUsers.role = role;
        } else {
            // If no role is provided, set a default role (e.g., "user")
            createUsers.role = "user";
        }

        const user = await this.usersService.createUser(createUsers);

        return {
            token: this.jwtService.sign({ username: user.username, role: user.role })
        };
    }
}