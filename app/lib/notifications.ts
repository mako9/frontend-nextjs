import { AppNotification, UnreadCount } from '../models/notification'
import { Page } from '../models/pageModel'
import { HttpMethod, request } from '../utils/request'

const notifPath = (p: string) => `${process.env.BACKEND_BASE_URL}/user/notification${p}`

export async function getNotifications(session?): Promise<Page<AppNotification> | null> {
    const result = await request<Page<AppNotification>>(notifPath('/'), session)
    return result.data
}

export async function getUnreadCount(session?): Promise<number> {
    const result = await request<UnreadCount>(notifPath('/unread-count'), session)
    return result.data?.count ?? 0
}

export async function markAllRead(session?) {
    await request(notifPath('/read-all'), session, HttpMethod.Patch)
}

export async function markRead(uuid: string, session?) {
    await request(notifPath(`/${uuid}/read`), session, HttpMethod.Patch)
}
