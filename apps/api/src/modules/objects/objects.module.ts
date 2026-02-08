import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectsService } from './objects.service';
import { ObjectsController } from './objects.controller';
import { ObjectItem, ObjectItemSchema } from './schemas/object.schema';
import { StorageModule } from '../storage/storage.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ObjectItem.name, schema: ObjectItemSchema }]),
    StorageModule,
    forwardRef(() => WebsocketModule),
  ],
  controllers: [ObjectsController],
  providers: [ObjectsService],
  exports: [ObjectsService],
})
export class ObjectsModule {}
