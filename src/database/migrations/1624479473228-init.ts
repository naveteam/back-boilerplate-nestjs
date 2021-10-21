import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Init1624479473228 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS CITEXT;`);

    await queryRunner.query(`CREATE OR REPLACE FUNCTION update_updated_at_column() 
    RETURNS TRIGGER AS $$
    BEGIN 
      NEW.updated_at = now(); 
      RETURN NEW; 
    END;
    $$ language 'plpgsql';`);

    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          {
            name: 'id',
            type: 'int4',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'role',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
            default: 'now()',
            onUpdate: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      false,
    );

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int4',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'password_reset_token',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'birthdate',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'role_id',
            type: 'int4',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
            default: 'now()',
            onUpdate: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      false,
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'logs',
        columns: [
          {
            name: 'id',
            type: 'int4',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'level',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'message',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'meta',
            type: 'json',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
            default: 'now()',
            onUpdate: 'now()',
          },
        ],
      }),
      false,
    );

    await queryRunner.query(`CREATE TRIGGER update_users_updated_at BEFORE UPDATE 
    ON users FOR EACH ROW EXECUTE PROCEDURE
    update_updated_at_column();`);
  }
  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TRIGGER update_users_updated_at ON users;`);
    await queryRunner.query(`DROP FUNCTION update_updated_at_column CASCADE;`);
    await queryRunner.dropTable('users');
    await queryRunner.dropTable('roles');
    await queryRunner.dropTable('logs');
  }
}
