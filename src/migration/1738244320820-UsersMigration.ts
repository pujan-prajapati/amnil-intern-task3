import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersMigration1738244320820 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "user_email" TO "email"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "email" TO "user_email"`
    );
  }
}
