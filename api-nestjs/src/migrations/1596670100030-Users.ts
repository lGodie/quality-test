import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Users1596670100030 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'username',
            type: 'varchar',
            isUnique: true,
            length: '16',
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
            length: 'MAX',
          },
          {
            name: 'isActive',
            type: 'bit',
            default: 1,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Users');
  }
}
