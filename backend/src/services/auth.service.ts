import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database.js";
import { ENV } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResult {
  token: string;
  user: PublicUser;
}

function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: Date;
}): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl ?? undefined,
    createdAt: user.createdAt.toISOString(),
  };
}

export class AuthService {
  private signToken(userId: string): string {
    return jwt.sign({}, ENV.JWT_SECRET, {
      subject: userId,
      expiresIn: ENV.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
  }

  async register(name: string, email: string, password: string): Promise<AuthResult> {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      throw new HttpError(409, "An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name: name.trim(), email: normalizedEmail, passwordHash },
    });
    return { token: this.signToken(user.id), user: toPublicUser(user) };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    const valid = user?.passwordHash ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !valid) {
      throw new HttpError(401, "Invalid email or password");
    }
    return { token: this.signToken(user.id), user: toPublicUser(user) };
  }

  async getUser(userId: string): Promise<PublicUser> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new HttpError(404, "User not found");
    return toPublicUser(user);
  }

  /** Returns the user id for a valid, unexpired token whose user still exists; otherwise null. */
  async verifyToken(token: string): Promise<string | null> {
    let userId: string | undefined;
    try {
      const payload = jwt.verify(token, ENV.JWT_SECRET);
      userId = typeof payload === "object" ? payload.sub : undefined;
    } catch {
      return null;
    }
    if (!userId) return null;
    const exists = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    return exists ? userId : null;
  }
}

export const authService = new AuthService();
