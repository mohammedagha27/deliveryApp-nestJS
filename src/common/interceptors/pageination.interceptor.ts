import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { response } from 'express';
import { map, Observable } from 'rxjs';
import { resourceLimits } from 'worker_threads';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../constants';
import { toNumber } from '../utils/cast';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { limit, offset } = request.query;
    return next.handle().pipe(
      map((data) => {
        const pageInfo = {
          offset: toNumber(offset, DEFAULT_OFFSET),
          limit: toNumber(limit, DEFAULT_LIMIT),
        };
        const newResponse = {
          data,
          pageInfo,
        };
        return newResponse;
      }),
    );
  }
}
