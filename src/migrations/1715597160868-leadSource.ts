import { MigrationInterface, QueryRunner } from "typeorm";

export class LeadSource1715597160868 implements MigrationInterface {
    name = 'LeadSource1715597160868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`lead_sources\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`deletedAt\` datetime(6) NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`lead\` (\`id\` int NOT NULL AUTO_INCREMENT, \`documentName\` varchar(255) NOT NULL, \`metaData\` json NULL, \`deletedAt\` datetime(6) NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` int NOT NULL, \`sourceId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`name\` \`name\` enum ('super-admin', 'team-lead', 'member') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`lead_sources\` ADD CONSTRAINT \`FK_2390e14e77928b10fdeed857546\` FOREIGN KEY (\`createdBy\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lead\` ADD CONSTRAINT \`FK_4ad990d3288f58af8636579c6f2\` FOREIGN KEY (\`createdBy\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lead\` ADD CONSTRAINT \`FK_09d9cd6f5ca716b596a8acf3168\` FOREIGN KEY (\`sourceId\`) REFERENCES \`lead_sources\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`lead\` DROP FOREIGN KEY \`FK_09d9cd6f5ca716b596a8acf3168\``);
        await queryRunner.query(`ALTER TABLE \`lead\` DROP FOREIGN KEY \`FK_4ad990d3288f58af8636579c6f2\``);
        await queryRunner.query(`ALTER TABLE \`lead_sources\` DROP FOREIGN KEY \`FK_2390e14e77928b10fdeed857546\``);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`name\` \`name\` enum ('super-admin', 'team-lead') NOT NULL`);
        await queryRunner.query(`DROP TABLE \`lead\``);
        await queryRunner.query(`DROP TABLE \`lead_sources\``);
    }

}
