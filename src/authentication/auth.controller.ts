import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {Request, Response} from 'express'
import { RegisterUsersDto } from "./dto/register-user.dto";
import { LoginDto } from "./dto/login-user.dto";

@Controller('/auth')
export class AuthController{

    constructor(private readonly authService: AuthService){}


    @Post('/login')
    async login(@Req() request:Request, @Res() response: Response, @Body() loginDto: LoginDto):Promise<any>{
        try{
            const result = await this.authService.login(loginDto);
            return response.status(200).json({
                status: 'Ok!',
                message: 'Succesfully login!',
                result: result

            })

        }catch(err){
            return response.status(500).json({
                status: 'Alert!',
                message: 'Wrong email, username or password!',
            })
        }
    }

    @Post('/register')
    async register(@Req() request:Request, @Res() response: Response, @Body() registerUsersDto: RegisterUsersDto):Promise<any>{
        try{
            const result = await this.authService.register(registerUsersDto);
            return response.status(200).json({
                status: 'Ok!',
                message: 'Succesfully register users!',
                result: result

            })

        }catch(err){
            return response.status(500).json({
                status: 'Problem!',
                message: 'Internal Server Error!',
            })
        }
    }
}