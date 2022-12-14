import { REPOS } from 'src/common/constants';
import { User } from './user.model';

export const UserProvider = [
  {
    provide: REPOS.USER_REPOSITORY,
    useValue: User,
  },
];
