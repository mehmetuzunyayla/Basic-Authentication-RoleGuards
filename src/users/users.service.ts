import { ConflictException, Injectable } from "@nestjs/common";
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
    
    async getAllUser(minAge?: number, maxAge?: number):Promise<{ name: string; email: string; age: string }[]>{
        const where: any = {};

        if (minAge !== undefined) {
            where.age = { gte: minAge };
        }

        if (maxAge !== undefined) {
            where.age = { ...where.age, lte: maxAge };
        }

        return this.prisma.users.findMany({
            where,
            select: {
                name: true,
                email: true,
                age: true
            }
        });
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
            throw new Error(`User with username ${username} not found.`);
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
   
    async updateAge(username: string, newAge: string): Promise<Users>{
        const existingUser = await this.prisma.users.findUnique({
            where: {
                username: username
            }
        });
        
        // If the user does not exist, you might want to handle this case accordingly.
        if (!existingUser) {
            throw new Error(`User with username ${username} not found.`);
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