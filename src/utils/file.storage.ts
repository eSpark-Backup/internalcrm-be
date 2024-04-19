import { Injectable } from '@nestjs/common';
const B2 = require('backblaze-b2');

@Injectable()
export class CloudStorageService {
  private b2: any;
  constructor() {
    this.b2 = new B2({
      applicationKeyId: process.env.B2_APPLICATION_KEY_ID,
      applicationKey: process.env.B2_APPLICATION_KEY,
    });
  }
  async uploadAsset(file: Express.Multer.File, path: string) {
    await this.b2.authorize();
    const data = await this.b2.getUploadUrl({
      bucketId: process.env.bucketID,
    });
    const response = await this.b2.uploadFile({
      uploadUrl: data.data.uploadUrl,
      uploadAuthToken: data.data.authorizationToken,
      fileName: path,
      data: file.buffer,
    });
    return { fileId: response.data.fileId, fileName: response.data.fileName };
  }
  async downloadAsset(fileName: string) {
    await this.b2.authorize();
    return this.b2.downloadFileByName({
      bucketName: process.env.bucketName,
      fileName: fileName,
      responseType: 'arraybuffer',
    });
  }
}
