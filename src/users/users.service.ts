import { ConflictException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Users } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UsersService{

    constructor(private prisma: PrismaService){}
    
    async createUser(user: Omit<Users, 'id'>): Promise<Users> {
        const existing = await this.prisma.users.findUnique({
            where: {
                username: user.username
            }
        });


        if(existing){
            throw new ConflictException("username already exists")
        }

        return this.prisma.users.create({
            data:user
        })
    }
    async checkAdminExists(): Promise<boolean> {
        const adminUser = await this.prisma.users.findFirst({
          where: {
            role: 'admin',
          },
        });
      
        return !!adminUser;
      }
    
    async setRole(username: string, role: string): Promise<Users> {
        const updatedUser = await this.prisma.users.update({
            where: {
                username: username
            },
            data: {
                role: role
            }
    });

    return updatedUser;
    }

    async getAllUser(minAge?: number, maxAge?: number, name?: string):Promise<{ name: string; email: string; age: number }[]>{
        const where: any = {};

        if (name !== undefined) {
            where.name = { contains: name };
        } 
    
        if (minAge !== undefined || maxAge !== undefined) {
            where.age = {};
    
            if (minAge !== undefined) {
                where.age.gte = parseInt(minAge as any, 10);
            }
    
            if (maxAge !== undefined) {
                where.age.lte = parseInt(maxAge as any, 10);
            }
        }
    
        const users = await this.prisma.users.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                age: true,
                role: true
            }
        });
    
        if (users.length === 0) {
            throw new HttpException('No users found', HttpStatus.NOT_FOUND);
        }
    
        return users;
    }

    async getProfileInfo(username: string):Promise<Users | null>{
        return this.prisma.users.findUnique({
            where: {
                username:username
            },
        });
    }

    async updateName(username: string, newName: string ): Promise<Users> {
        // Check if the user with the provided username exists
        const existingUser = await this.prisma.users.findUnique({
            where: {
                username: username
            }
        });
    
        // If the user does not exist, you might want to handle this case accordingly.
        if (!existingUser) {
            throw new HttpException(`User with username ${username} not found.`, HttpStatus.NOT_FOUND);
        }
    
        // Update the user's name
        const updatedUser = await this.prisma.users.update({
            where: {
                username: username
            },
            data: {
                name: newName
            }
        });
    
        return updatedUser;
    }
   
    async updateAge(username: string, newAge: number): Promise<Users>{
        const existingUser = await this.prisma.users.findUnique({
            where: {
                username: username
            }
        });
        
        // If the user does not exist, you might want to handle this case accordingly.
        if (!existingUser) {
            throw new HttpException(`User with username ${username} not found.`, HttpStatus.NOT_FOUND);
        }

        //Update the user's age
        const updatedUser = await this.prisma.users.update({
            where: {
                username: username
            },
            data:{
                age: newAge
            }
        });
        return updatedUser
    }

}