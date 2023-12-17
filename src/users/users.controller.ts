import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/authentication/auth.guard";
import { Users } from "@prisma/client";
import { Roles } from "src/authentication/roles.decorator"; // Import the Roles decorator
import { RolesGuard } from "src/authentication/roles.guard"; // Import the RolesGuard


@Controller('users')
export class UsersController {
    constructor(private readonly userService : UsersService){}

    @Get()
    @Roles('admin',"moderator")
    @UseGuards(JwtAuthGuard,RolesGuard)
    async getAllUsers(
        @Query('minAge') minAge: number,
        @Query('maxAge') maxAge: number,
        @Query('cname') cname: string,
        @Req() request: Request, 
        @Res() response: Response
    ):Promise<any>{
        try {
            const result = await this.userService.getAllUser(minAge, maxAge, cname);
            return response.status(200).json({
                status: 'Ok!',
                message: 'Successfully fetch data!',
                result: result
            });
        } catch (err) {
            if (err instanceof HttpException) {
                return response.status(err.getStatus()).json({
                    status: 'Error',
                    message: err.message
                });
            } else {
                return response.status(500).json({
                    status: 'Internal Server Error',
                    message: 'Something went wrong!'
                });
            }
        }
    }

    @Post("/set-role")
    @Roles('admin')
    @UseGuards(JwtAuthGuard,RolesGuard)
    async setRole(
        @Req() request: Request,
        @Body() { username, role }: { username: string, role: string }
    ): Promise<any> {
        try {
            // Call the service method to set the user's role
            const updatedUser = await this.userService.setRole(username, role);
            return updatedUser;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the HttpException to ensure proper error propagation
            } else {
                // Log the error or handle it appropriately
                console.error(`Error setting user role: ${error.message}`);
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get("/info")
    @UseGuards(JwtAuthGuard)
    async getProfileInfos(
        @Query('username') requestedUsername: string,
        @Req() request: Request, 
        @Res() response: Response
    ): Promise<any> {
        try{
            const currentUser = (request.user as Users).username;
            if (currentUser !== requestedUsername) {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
              }

            const profile = await this.userService.getProfileInfo(requestedUsername);

            if (profile !== null) {
                return response.status(200).json({
                    status: 'Ok!',
                    message: 'Successfully fetched profile data!',
                    result: profile,
                });
            } else {
                return response.status(404).json({
                    status: 'Not Found',
                    message: 'Profile not found',
                });
            }
        }catch(err){
            return response.status(500).json({
                status: 'Unauthorized access',
                message: 'Internal Server Error!'
            })
        
        }
        
    }


    @Post("/updateNames")
    @Roles('moderator')
    @UseGuards(JwtAuthGuard)
    async updateNames(@Body() { username, newName }: { username: string, newName: string }, @Req() request: any,): Promise<Users> {        
        try {
            
            const currentUser = request.user.username;
            if (request.user.role!== "moderator" && currentUser !== username) {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
              }

            // Call the service method to update the user's name
            const updatedUser = await this.userService.updateName(username, newName);
            return updatedUser;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the HttpException to ensure proper error propagation
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
                }    
            
            }
    }

    @Post("/updateAges")
    @Roles('moderator')
    @UseGuards(JwtAuthGuard)
    async updateAges(@Body() {username, newAge}: {username: string, newAge: number}, @Req() request: any,):Promise<Users>{
        try{
            const currentUser = request.user.username;
            if (request.user.role!== "moderator" && currentUser !== username) {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
              }
            const updatedUser = await this.userService.updateAge(username, newAge);
            return updatedUser;
        }catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the HttpException to ensure proper error propagation
            } else {
                // Log the error or handle it appropriately
                console.error(`Error updating age: ${error.message}`);
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
                }    
            
            }
    }
}