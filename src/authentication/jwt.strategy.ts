import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from "src/prisma.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(private readonly prismaService:PrismaService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        })
    }

    
    async validate(payload: { email?: string; username?: string; role: string }): Promise<any> {
        if (!payload.email && !payload.username) {
            throw new UnauthorizedException('Invalid payload');
        }
    
        const users = await this.prismaService.users.findUnique({
            where: {
                email: payload.email,
                username: payload.username,
                role: payload.role,
            },
        });
    
        if (!users) {
            throw new UnauthorizedException('User not found');
        }
    
    
        return users; 
    }
}