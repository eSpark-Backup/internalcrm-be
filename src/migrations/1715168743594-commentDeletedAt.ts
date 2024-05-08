import { MigrationInterface, QueryRunner } from "typeorm";

export class CommentDeletedAt1715168743594 implements MigrationInterface {
    name = 'CommentDeletedAt1715168743594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task_comments\` CHANGE \`deleted\` \`deletedAt\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`task_comments\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`task_comments\` ADD \`deletedAt\` datetime(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task_comments\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`task_comments\` ADD \`deletedAt\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`task_comments\` CHANGE \`deletedAt\` \`deleted\` timestamp NULL`);
    }

}
