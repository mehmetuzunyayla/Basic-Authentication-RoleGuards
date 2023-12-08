import { IsOptional, IsString, Length } from "class-validator";

export class LoginDto{
    
    @IsString()
    @Length(5,20)
    @IsOptional()
    email: string;

    @IsString()
    @Length(5,20)
    @IsOptional()
    username: string;

    @IsString()
    @Length(6,12)
    password: string;
}