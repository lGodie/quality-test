import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class vehiclesTable1602022661900 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'vehicles',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'plaque',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'model',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'colour',
            type: 'varchar',
            isNullable: true,
            length: '32',
          },
          {
            name: 'picturePath',
            type: 'varchar',
            isNullable: true,
            length: '256',
          },
          {
            name: 'insertDate',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'updateDate',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'active',
            type: 'bit',
            isNullable: true,
          },
          {
            name: 'price',
            type: 'decimal',
            isNullable: true,
            default: 0,
            precision: 9,
            scale: 2,
            unsigned: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('vehicles');
  }
}
