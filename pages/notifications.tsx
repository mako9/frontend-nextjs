import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations'
import { useTranslation } from 'next-i18next/pages'
import Head from 'next/head'
import { useEffect } from 'react'
import { AppNotification } from '../app/models/notification'
import { getNotifications, markAllRead } from '../app/lib/notifications'
import styles from '../app/styles/utils.module.css'

export default function NotificationsPage({ notifications }: { notifications: AppNotification[] }) {
    const { t } = useTranslation('common')
    const { data: session } = useSession()

    useEffect(() => {
        if (session) {
            markAllRead(session)
        }
    }, [session])

    return (
        <>
            <Head><title>{t('notifications.title')}</title></Head>
            <h1 className={styles.headingXl}>{t('notifications.title')}</h1>
            {notifications.length === 0 ? <p>{t('notifications.empty')}</p> : (
                <ul>
                    {notifications.map(n => (
                        <li key={n.uuid} style={{ marginBottom: '8px', opacity: n.read ? 0.6 : 1 }}>
                            {t(`notification.type.${n.type}`)} — {new Date(n.createdAt).toLocaleString()}
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context)
    if (!session) return { redirect: { destination: '/login', permanent: false } }
    await markAllRead(session)
    const page = await getNotifications(session)
    return {
        props: {
            ...(await serverSideTranslations(context.locale || 'en', ['common'])),
            notifications: page?.content ?? [],
        }
    }
}
