import type { NotificationResponseDTO } from "../../DTO/socket/notificationDTO";
import type { INotification } from "../../interfaces/socket/ISocket";

export class NotificationMapper {
    static toDTO(n: INotification): NotificationResponseDTO {
        return {
            id: n.id,
            senderId: n.senderId.toString(),
            title: n.title,
            type: n.type,
            message: n.message,
            ...(n.activeId && { activeId: n.activeId.toString() }),
            isRead: n.isRead,
            createdAt: n.createdAt.toLocaleTimeString()
        };
    }

    static toDTOList(list: INotification[]): NotificationResponseDTO[] {
        return list.map(NotificationMapper.toDTO);
    }
}