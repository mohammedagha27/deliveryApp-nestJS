import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { verifyToken } from 'src/common/utils';
import { UserService } from 'src/modules/user/user.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;
    if (!authorization) return false;

    const decoded = verifyToken(authorization, process.env.SECRET_KEY);
    if (!decoded) {
      return false;
    }

    const dbUser = await this.userService.findOne(decoded.id);
    if (!dbUser) {
      return false;
    }

    request.user = dbUser;
    return true;
  }
}
