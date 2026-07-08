import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next/pages'
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations'
import Head from 'next/head'
import Link from 'next/link'
import { getMyBookings } from '../../app/lib/bookings'
import { ItemBooking, BookingStatus } from '../../app/models/booking'
import styles from '../../app/styles/utils.module.css'

function statusColor(status: BookingStatus): string {
    switch (status) {
        case 'PENDING': return 'orange'
        case 'CONFIRMED': return 'green'
        case 'DECLINED': return 'red'
        case 'CANCELLED': return 'gray'
    }
}

export default function BookingsPage({ myBookings }: { myBookings: ItemBooking[] }) {
    const { t } = useTranslation('common')
    return (
        <>
            <Head><title>{t('bookings.title')}</title></Head>
            <h1 className={styles.headingXl}>{t('bookings.title')}</h1>
            {myBookings.length === 0 ? <p>{t('bookings.noBookings')}</p> : (
                <ul>
                    {myBookings.map(b => (
                        <li key={b.uuid} style={{ marginBottom: '12px' }}>
                            <Link href={`/bookings/${b.uuid}`}>
                                <span style={{ color: statusColor(b.status), fontWeight: 'bold', marginRight: '8px' }}>
                                    [{t(`booking.status.${b.status.toLowerCase()}`)}]
                                </span>
                                {new Date(b.startAt).toLocaleDateString()} – {new Date(b.endAt).toLocaleDateString()}
                            </Link>
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
    const page = await getMyBookings(session)
    return {
        props: {
            ...(await serverSideTranslations(context.locale || 'en', ['common'])),
            myBookings: page?.content ?? [],
        }
    }
}
