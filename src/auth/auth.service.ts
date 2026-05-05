import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        email_verified_at: null,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      },
      token,
    };
  }

  async register(dto: RegisterDto) {
    if (dto.password !== dto.password_confirmation) {
      throw new BadRequestException("Password confirmation does not match");
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException("Email already registered");
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashed,
      },
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        email_verified_at: null,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      },
      token,
    };
  }

  async logout() {
    return { message: "Logged out successfully" };
  }

  async getUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        email_verified_at: null,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      },
    };
  }
}
