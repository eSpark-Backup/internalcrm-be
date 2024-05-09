import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1714736474752 implements MigrationInterface {
    name = 'Init1714736474752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` enum ('super-admin', 'team-lead') NOT NULL, \`description\` text NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`superuser\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(100) NOT NULL, \`lastName\` varchar(100) NOT NULL, \`gender\` enum ('M', 'F') NOT NULL, \`employee_id\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`job_title\` varchar(255) NOT NULL, \`image\` varchar(255) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`roleId\` int NULL, INDEX \`IDX_450a05c0c4de5b75ac8d34835b\` (\`password\`), UNIQUE INDEX \`IDX_9760615d88ed518196bb79ea03\` (\`employee_id\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`teams\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`archived\` tinyint NOT NULL DEFAULT 0, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`head\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`team_members\` (\`id\` int NOT NULL AUTO_INCREMENT, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`userId\` int NULL, \`teamId\` int NULL, INDEX \`IDX_b2f17b533905e0a94390c5e220\` (\`userId\`, \`teamId\`), UNIQUE INDEX \`REL_0a72b849753a046462b4c5a8ec\` (\`userId\`), UNIQUE INDEX \`REL_6d1c8c7f705803f0711336a5c3\` (\`teamId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`project_members\` (\`id\` int NOT NULL AUTO_INCREMENT, \`deletedAt\` datetime(6) NULL, \`projectId\` int NULL, \`userId\` int NOT NULL, UNIQUE INDEX \`IDX_326b2a901eb18ac24eabc9b058\` (\`userId\`, \`projectId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`projects\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`startingDate\` timestamp NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deletedAt\` datetime(6) NULL, \`createdBy\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cards\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deletedAt\` datetime(6) NULL, \`projectId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tasks\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`startDate\` timestamp NOT NULL, \`endDate\` timestamp NOT NULL, \`status\` enum ('pending', 'active', 'incomplete', 'completed') NOT NULL DEFAULT 'pending', \`completedAt\` timestamp NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`assignedTo\` int NULL, \`assignedBy\` int NULL, \`cardId\` int NULL, INDEX \`IDX_396d500ff7f1b82771ddd812fd\` (\`name\`), INDEX \`IDX_f2b688af66b04f73a6c5426af9\` (\`startDate\`), INDEX \`IDX_8f1ef0ed0be1d4d5537ab84d6e\` (\`endDate\`), INDEX \`IDX_3b34ce2db713f0be359768db81\` (\`assignedTo\`), INDEX \`IDX_61ed3a78dffe78e734fe4c696e\` (\`assignedBy\`), INDEX \`IDX_10f8a3df60c9e7771cefba6c35\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`task_comments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`comment\` text NOT NULL, \`edited\` tinyint NOT NULL DEFAULT 0, \`deleted\` timestamp NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`userId\` int NULL, \`taskId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`project_assets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`resource\` text NOT NULL, \`type\` enum ('link', 'document') NOT NULL DEFAULT 'link', \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deletedAt\` datetime(6) NULL, \`projectId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`permissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`showOnFrontend\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_permissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NULL, \`permissionId\` int NULL, INDEX \`IDX_4d0e283b03781d1796e62dc619\` (\`userId\`, \`permissionId\`), UNIQUE INDEX \`REL_f05ccc7935f14874d7f89ba030\` (\`userId\`), UNIQUE INDEX \`REL_cf38f85e52ee274ba9a01901ed\` (\`permissionId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`teams\` ADD CONSTRAINT \`FK_d7cbaad752df11befc8c619716e\` FOREIGN KEY (\`head\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`team_members\` ADD CONSTRAINT \`FK_0a72b849753a046462b4c5a8ec2\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`team_members\` ADD CONSTRAINT \`FK_6d1c8c7f705803f0711336a5c33\` FOREIGN KEY (\`teamId\`) REFERENCES \`teams\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_members\` ADD CONSTRAINT \`FK_d19892d8f03928e5bfc7313780c\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_members\` ADD CONSTRAINT \`FK_08d1346ff91abba68e5a637cfdb\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD CONSTRAINT \`FK_4fcfae511b4f6aaa67a8d325968\` FOREIGN KEY (\`createdBy\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cards\` ADD CONSTRAINT \`FK_4a664d3af55fab593cceb5cb69a\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_3b34ce2db713f0be359768db816\` FOREIGN KEY (\`assignedTo\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_61ed3a78dffe78e734fe4c696ed\` FOREIGN KEY (\`assignedBy\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_430b9c8f42db9bc89ece8520f08\` FOREIGN KEY (\`cardId\`) REFERENCES \`cards\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task_comments\` ADD CONSTRAINT \`FK_be77588a6727c9a27075b590048\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task_comments\` ADD CONSTRAINT \`FK_ba265816ca1d93f51083e06c520\` FOREIGN KEY (\`taskId\`) REFERENCES \`tasks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_assets\` ADD CONSTRAINT \`FK_5529071de26d3313ac9759259ae\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_permissions\` ADD CONSTRAINT \`FK_f05ccc7935f14874d7f89ba030f\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_permissions\` ADD CONSTRAINT \`FK_cf38f85e52ee274ba9a01901ed2\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_permissions\` DROP FOREIGN KEY \`FK_cf38f85e52ee274ba9a01901ed2\``);
        await queryRunner.query(`ALTER TABLE \`user_permissions\` DROP FOREIGN KEY \`FK_f05ccc7935f14874d7f89ba030f\``);
        await queryRunner.query(`ALTER TABLE \`project_assets\` DROP FOREIGN KEY \`FK_5529071de26d3313ac9759259ae\``);
        await queryRunner.query(`ALTER TABLE \`task_comments\` DROP FOREIGN KEY \`FK_ba265816ca1d93f51083e06c520\``);
        await queryRunner.query(`ALTER TABLE \`task_comments\` DROP FOREIGN KEY \`FK_be77588a6727c9a27075b590048\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_430b9c8f42db9bc89ece8520f08\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_61ed3a78dffe78e734fe4c696ed\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_3b34ce2db713f0be359768db816\``);
        await queryRunner.query(`ALTER TABLE \`cards\` DROP FOREIGN KEY \`FK_4a664d3af55fab593cceb5cb69a\``);
        await queryRunner.query(`ALTER TABLE \`projects\` DROP FOREIGN KEY \`FK_4fcfae511b4f6aaa67a8d325968\``);
        await queryRunner.query(`ALTER TABLE \`project_members\` DROP FOREIGN KEY \`FK_08d1346ff91abba68e5a637cfdb\``);
        await queryRunner.query(`ALTER TABLE \`project_members\` DROP FOREIGN KEY \`FK_d19892d8f03928e5bfc7313780c\``);
        await queryRunner.query(`ALTER TABLE \`team_members\` DROP FOREIGN KEY \`FK_6d1c8c7f705803f0711336a5c33\``);
        await queryRunner.query(`ALTER TABLE \`team_members\` DROP FOREIGN KEY \`FK_0a72b849753a046462b4c5a8ec2\``);
        await queryRunner.query(`ALTER TABLE \`teams\` DROP FOREIGN KEY \`FK_d7cbaad752df11befc8c619716e\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`DROP INDEX \`REL_cf38f85e52ee274ba9a01901ed\` ON \`user_permissions\``);
        await queryRunner.query(`DROP INDEX \`REL_f05ccc7935f14874d7f89ba030\` ON \`user_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_4d0e283b03781d1796e62dc619\` ON \`user_permissions\``);
        await queryRunner.query(`DROP TABLE \`user_permissions\``);
        await queryRunner.query(`DROP TABLE \`permissions\``);
        await queryRunner.query(`DROP TABLE \`project_assets\``);
        await queryRunner.query(`DROP TABLE \`task_comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_10f8a3df60c9e7771cefba6c35\` ON \`tasks\``);
        await queryRunner.query(`DROP INDEX \`IDX_61ed3a78dffe78e734fe4c696e\` ON \`tasks\``);
        await queryRunner.query(`DROP INDEX \`IDX_3b34ce2db713f0be359768db81\` ON \`tasks\``);
        await queryRunner.query(`DROP INDEX \`IDX_8f1ef0ed0be1d4d5537ab84d6e\` ON \`tasks\``);
        await queryRunner.query(`DROP INDEX \`IDX_f2b688af66b04f73a6c5426af9\` ON \`tasks\``);
        await queryRunner.query(`DROP INDEX \`IDX_396d500ff7f1b82771ddd812fd\` ON \`tasks\``);
        await queryRunner.query(`DROP TABLE \`tasks\``);
        await queryRunner.query(`DROP TABLE \`cards\``);
        await queryRunner.query(`DROP TABLE \`projects\``);
        await queryRunner.query(`DROP INDEX \`IDX_326b2a901eb18ac24eabc9b058\` ON \`project_members\``);
        await queryRunner.query(`DROP TABLE \`project_members\``);
        await queryRunner.query(`DROP INDEX \`REL_6d1c8c7f705803f0711336a5c3\` ON \`team_members\``);
        await queryRunner.query(`DROP INDEX \`REL_0a72b849753a046462b4c5a8ec\` ON \`team_members\``);
        await queryRunner.query(`DROP INDEX \`IDX_b2f17b533905e0a94390c5e220\` ON \`team_members\``);
        await queryRunner.query(`DROP TABLE \`team_members\``);
        await queryRunner.query(`DROP TABLE \`teams\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_9760615d88ed518196bb79ea03\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_450a05c0c4de5b75ac8d34835b\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
    }

}
