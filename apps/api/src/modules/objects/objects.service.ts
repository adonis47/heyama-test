import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ObjectItem, ObjectItemDocument } from './schemas/object.schema';
import { CreateObjectDto } from './dto/create-object.dto';
import { StorageService } from '../storage/storage.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectModel(ObjectItem.name) private objectModel: Model<ObjectItemDocument>,
    private storageService: StorageService,
    private websocketGateway: WebsocketGateway,
  ) {}

  async create(
    createObjectDto: CreateObjectDto,
    file: Express.Multer.File,
    ownerId: string,
  ): Promise<ObjectItemDocument> {
    const imageUrl = await this.storageService.uploadImage(file);

    const object = new this.objectModel({
      ...createObjectDto,
      imageUrl,
      ownerId: new Types.ObjectId(ownerId),
    });

    const savedObject = await object.save();

    this.websocketGateway.emitObjectCreated(
      this.toPublicObject(savedObject as unknown as ObjectItemDocument),
    );

    return savedObject as unknown as ObjectItemDocument;
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const itemsQuery = this.objectModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('ownerId', 'email')
      .exec();

    const totalQuery = this.objectModel.countDocuments();

    const [items, total] = await Promise.all([
      itemsQuery as any as Promise<ObjectItemDocument[]>,
      totalQuery,
    ]);

    return {
      items: items.map((item) => this.toPublicObject(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<ObjectItemDocument> {
    const object = await (this.objectModel
      .findById(id)
      .populate('ownerId', 'email')
      .exec() as any as Promise<ObjectItemDocument | null>);

    if (!object) {
      throw new NotFoundException('Object not found');
    }

    return object;
  }

  async delete(id: string, userId: string): Promise<void> {
    const object = await this.objectModel.findById(id).exec();

    if (!object) {
      throw new NotFoundException('Object not found');
    }

    if (object.ownerId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own objects');
    }

    await this.storageService.deleteImage(object.imageUrl);

    await this.objectModel.findByIdAndDelete(id).exec();

    this.websocketGateway.emitObjectDeleted(id);
  }

  toPublicObject(object: ObjectItemDocument) {
    const obj = object.toObject();
    return {
      _id: obj._id.toString(),
      title: obj.title,
      description: obj.description,
      imageUrl: obj.imageUrl,
      ownerId: obj.ownerId
        ? obj.ownerId._id
          ? obj.ownerId._id.toString()
          : obj.ownerId.toString()
        : '',
      owner:
        obj.ownerId && obj.ownerId.email
          ? { _id: obj.ownerId._id.toString(), email: obj.ownerId.email }
          : undefined,
      createdAt: obj.createdAt ? obj.createdAt.toISOString() : new Date().toISOString(),
    };
  }
}
