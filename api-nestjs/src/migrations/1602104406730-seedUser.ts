import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedUser1602104406730 implements MigrationInterface {
  tableName = 'users';

  public async up(queryRunner: QueryRunner): Promise<any> {
    const queryBuilder = await queryRunner.manager.createQueryBuilder();
    await queryBuilder
      .insert()
      .into(this.tableName, ['username', 'password'])
      .values([{ username: 'admin', password: 'admin' }])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const queryBuilder = await queryRunner.manager.createQueryBuilder();
    await queryBuilder
      .delete()
      .from(this.tableName)
      .execute();
  }
}
