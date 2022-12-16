import { REPOS } from 'src/common/constants';
import { Address } from './address.model';

export const AddressProvider = [
  {
    provide: REPOS.ADDRESSES_REPOSITORY,
    useValue: Address,
  },
];
