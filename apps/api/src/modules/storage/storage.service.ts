import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly endpoint: string;
  private readonly publicEndpoint: string;

  constructor(private configService: ConfigService) {
    this.endpoint = this.configService.get<string>('s3.endpoint') || '';
    this.publicEndpoint = this.configService.get<string>('s3.publicEndpoint') || '';
    this.bucket = this.configService.get<string>('s3.bucket') || 'heyama-uploads';

    this.s3Client = new S3Client({
      endpoint: this.endpoint || undefined,
      region: this.configService.get<string>('s3.region') || 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get<string>('s3.accessKey') || '',
        secretAccessKey: this.configService.get<string>('s3.secretKey') || '',
      },
      forcePathStyle: true,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const key = `images/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    this.logger.log(`Image uploaded: ${key}`);

    const base = this.publicEndpoint || this.endpoint;
    if (base) {
      return `${base}/${this.bucket}/${key}`;
    }
    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const key = this.extractKeyFromUrl(imageUrl);

      if (!key) {
        this.logger.warn(`Could not extract key from URL: ${imageUrl}`);
        return;
      }

      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`Image deleted: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete image: ${imageUrl}`, error);
    }
  }

  private extractKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;

      const parts = pathname.split('/').filter(Boolean);
      if (parts[0] === this.bucket) {
        parts.shift();
      }

      return parts.join('/');
    } catch {
      return null;
    }
  }
}
