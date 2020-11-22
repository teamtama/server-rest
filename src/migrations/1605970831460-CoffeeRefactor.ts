import { MigrationInterface, QueryRunner } from 'typeorm';

export class CoffeeRefactor1605970831460 implements MigrationInterface {
  // npx typeorm migration:run
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffee" RENAME COLUMN "name" TO "title"`,
    );
  }

  // npx typeorm migration:revert
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffee" RENAME COLUMN "title" TO "name"`,
    );
  }
}
