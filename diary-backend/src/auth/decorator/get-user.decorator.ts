import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserMember } from '../entities/user-member.entity';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): UserMember => {
    const req = ctx.switchToHttp().getRequest();
    const user: UserMember = req.user;
    return data ? user?.[data] : user;
  },
);
