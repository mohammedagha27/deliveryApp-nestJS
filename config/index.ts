import devConfig from './development.config';
import prodConfig from './production.config';
import testConfig from './test.config';

const NODE_ENV = process.env.NODE_ENV;
let config;
switch (NODE_ENV) {
  case 'development':
    config = devConfig;
    break;
  case 'production':
    config = prodConfig;
    break;
  case 'testing':
    config = testConfig;
    break;
  default:
    config = devConfig;
    break;
}
export default config;
