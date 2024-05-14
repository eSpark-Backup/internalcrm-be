import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudStorageService {
  private readonly s3Client = new S3Client({
    endpoint: this.configService.getOrThrow('END_POINT'),
    region: this.configService.getOrThrow('REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('B2_APPLICATION_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow('B2_APPLICATION_KEY'),
    },
  });

  constructor(private readonly configService: ConfigService) {}

  async upload(fileName: string, file: Buffer) {
    return this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow('BUCKET_NAME'),
        Key: fileName,
        Body: file,
      }),
    );
  }

  download(fileName: string) {
    return this.s3Client.send(
      new GetObjectCommand({
        Bucket: this.configService.getOrThrow('BUCKET_NAME'),
        Key: fileName,
      }),
    );
  }
  delete(fileName: string) {
    return this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.configService.getOrThrow('BUCKET_NAME'),
        Key: fileName,
      }),
    );
  }
}
