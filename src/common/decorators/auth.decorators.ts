import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { ROLES } from '../constants';
import { AuthGuard } from '../guards';
import { RolesGuard } from '../guards';

export const Auth = (...roles: any) => {
  return applyDecorators(
    SetMetadata(ROLES, roles),
    UseGuards(AuthGuard, RolesGuard),
  );
};
