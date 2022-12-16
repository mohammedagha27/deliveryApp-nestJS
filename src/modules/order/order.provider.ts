import { REPOS } from 'src/common/constants';
import { Order } from './order.model';

export const OrderProvider = [
  {
    provide: REPOS.ORDER_REPOSITORY,
    useValue: Order,
  },
];
