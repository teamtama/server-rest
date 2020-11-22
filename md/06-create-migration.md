# root/ormconfig.js
```js
module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pass123',
  database: 'postgres',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

```

# cli
```bash
npx typeorm migration:create -n CoffeeRefactor
```
### miragtions/xxx-CoffeeRefactor.ts
```ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CoffeeRefactor1605970185102 implements MigrationInterface {
  // run
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffee" RENAME COLUMN "name" TO "title"`,
    );
  }
  
  // revert
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffee" RENAME COLUMN "title" TO "name"`,
    );
  }
}
```
### npm run build
### npx typeorm migration:run
### npx typeorm migration:generate -n SchemaSync

# RUNNING MIGRATIONS
💡 Remember 💡
You must BUILD your Nest project (so that everything is output to the `/dist/` folder,
before a Migration can run, it needs compilated files.
 
### Compile project first 
```npm run build```

### Run migration(s) 
```npx typeorm migration:run```

### REVERT migration(s)
```npx typeorm migration:revert```

### Let TypeOrm generate migrations (for you)
```npx typeorm migration:generate -n SchemaSync```