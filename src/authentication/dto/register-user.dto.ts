import { IsEmail, IsInt, IsNumber, IsString, Length, Max, Min, min } from "class-validator";


export class RegisterUsersDto {
    @IsString()
    @Length(5,10)
    username: string;

    @IsString()
    @Length(6,12)
    password: string;

    @IsString()
    @Length(5,20)
    name: string;

    @IsEmail()
    @Length(5,25)
    email: string;

    @IsNumber()
    @Min(1)
    @Max(105)
    age: number;
}