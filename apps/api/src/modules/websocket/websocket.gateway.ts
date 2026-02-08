import {
  WebSocketGateway as WSGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ObjectItem } from '@heyama/shared';

const WS_EVENTS = {
  CREATED: 'object.created',
  DELETED: 'object.deleted',
} as const;

@WSGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  namespace: '/',
})
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(WebsocketGateway.name);

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  emitObjectCreated(object: ObjectItem) {
    this.server.emit(WS_EVENTS.CREATED, { object });
    this.logger.log(`Emitted ${WS_EVENTS.CREATED} for object: ${object._id}`);
  }

  emitObjectDeleted(objectId: string) {
    this.server.emit(WS_EVENTS.DELETED, { objectId });
    this.logger.log(`Emitted ${WS_EVENTS.DELETED} for object: ${objectId}`);
  }
}
