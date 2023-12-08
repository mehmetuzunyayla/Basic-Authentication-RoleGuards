import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/authentication/auth.guard";
import { Users } from "@prisma/client";


@Controller('users')
export class UsersController {
    constructor(private readonly userService : UsersService){}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllUsers(
                    @Query('minAge') minAge: number,
                    @Query('maxAge') maxAge: number,
                    @Req() request: Request, 
                    @Res() response: Response
                ):Promise<any>{
        try{
            const result = await this.userService.getAllUser(minAge, maxAge);
            return response.status(200).json({
                status: 'Ok!',
                message: 'Succesfully fetch data!',
                result: result
            })
        }catch(err){
            return response.status(500).json({
                status: 'Unauthorized access',
                message: 'Internal Server Error!'
            })
        }
    }


    @Get("/info")
    @UseGuards(JwtAuthGuard)
    async getProfileInfos(
        @Query('username') username: string,
        @Req() request: Request, 
        @Res() response: Response
    ): Promise<any> {
        try{
            
            const profile = await this.userService.getProfileInfo(username);

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
    async updateNames(@Body() { username, newName }: { username: string, newName: string }): Promise<Users> {        
        try {
            // Call the service method to update the user's name
            const updatedUser = await this.userService.updateName(username, newName);
            return updatedUser;
        } catch (error) {
            // Handle errors and return an appropriate response
            throw new Error(`Error updating user name: ${error.message}`);
        }
    }

    @Post("/updateAges")
    async updateAges(@Body() {username, newAge}: {username: string, newAge: string}):Promise<Users>{
        try{
            const updatedUser = await this.userService.updateAge(username, newAge);
            return updatedUser;
        }catch(error){
            throw new Error(`Error updating user name: ${error.message}`);
        }
    }


    
}