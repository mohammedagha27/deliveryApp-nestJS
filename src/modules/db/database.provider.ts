import { ConfigService } from '@nestjs/config/dist';
import { Sequelize } from 'sequelize-typescript';
import { DATABASE_CONFIG, SEQUELIZE } from 'src/common/constants';
import { User } from '../user/user.model';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        ...configService.get(DATABASE_CONFIG),
      });
      sequelize.addModels([User]);
      await sequelize.sync();
      return sequelize;
    },
    inject: [ConfigService],
  },
];
