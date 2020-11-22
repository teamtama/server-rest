import { registerAs } from '@nestjs/config';

const coffeesConfig = registerAs('coffees', () => ({
  foo: 'bar',
}));

export default coffeesConfig;
