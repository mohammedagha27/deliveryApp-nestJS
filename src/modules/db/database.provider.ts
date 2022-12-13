import { ConfigService } from '@nestjs/config/dist';
import { Sequelize } from 'sequelize-typescript';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        ...configService.get('database'),
      });
      sequelize.addModels([]);
      await sequelize.sync();
      return sequelize;
    },
    inject: [ConfigService],
  },
];
