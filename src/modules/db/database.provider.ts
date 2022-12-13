import { ConfigService } from '@nestjs/config/dist';
import { Sequelize } from 'sequelize-typescript';
import { DATABASE_CONFIG, SEQUELIZE } from 'src/common/constants';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        ...configService.get(DATABASE_CONFIG),
      });
      sequelize.addModels([]);
      await sequelize.sync();
      return sequelize;
    },
    inject: [ConfigService],
  },
];
