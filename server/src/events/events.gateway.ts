import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*', // Cho phép Client kết nối
    },
})
export class EventsGateway {
    @WebSocketServer()
    server: Server;

    // Articles
    emitNewArticle(data: any) { this.server.emit('events.article.created', data); }
    emitDeletedArticle(id: string) { this.server.emit('events.article.deleted', { id }); }

    // Users
    emitNewUser(data: any) { this.server.emit('events.user.created', data); }
    emitDeletedUser(id: string) { this.server.emit('events.user.deleted', { id }); }

    // Categories
    emitNewCategory(data: any) { this.server.emit('events.category.created', data); }
    emitDeletedCategory(id: string) { this.server.emit('events.category.deleted', { id }); }
}