# install
```bash
yarn add @nestjs/typeorm typeorm pg
```

# src/app.module.ts
imports 부분
```
imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        port: 5432,
        username: 'postgres',
        password: 'pass123',
        database: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    CoffeesModule,
  ],
```