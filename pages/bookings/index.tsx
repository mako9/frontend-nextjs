import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next/pages'
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { getMyBookings, getReceivedBookings } from '../../app/lib/bookings'
import { ItemBooking, BookingStatus } from '../../app/models/booking'
import ToggleButton from '../../app/components/toggleButton'
import { formatDate } from '../../app/utils/dates'
import styles from '../../app/styles/utils.module.css'

function statusColor(status: BookingStatus): string {
    switch (status) {
        case 'PENDING': return 'orange'
        case 'CONFIRMED': return 'green'
        case 'DECLINED': return 'red'
        case 'CANCELLED': return 'gray'
        case 'RETURNED': return 'blue'
        default: {
            // a new status on the backend has to be a compile error here, not an invisible colour
            const unhandled: never = status
            return unhandled
        }
    }
}

function BookingList({ bookings }: { bookings: ItemBooking[] }) {
    const { t, i18n } = useTranslation('common')
    if (bookings.length === 0) return <p>{t('bookings.noBookings')}</p>
    return (
        <ul>
            {bookings.map(b => (
                <li key={b.uuid} style={{ marginBottom: '12px' }}>
                    <Link href={`/bookings/${b.uuid}`}>
                        <span style={{ color: statusColor(b.status), fontWeight: 'bold', marginRight: '8px' }}>
                            [{t(`booking.status.${b.status.toLowerCase()}`)}]
                        </span>
                        {formatDate(b.startAt, i18n?.language)} –{' '}
                        {formatDate(b.endAt, i18n?.language)}
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default function BookingsPage({
    myBookings,
    receivedBookings = [],
}: {
    myBookings: ItemBooking[]
    receivedBookings?: ItemBooking[]
}) {
    const { t } = useTranslation('common')
    const [selectedIndex, setSelectedIndex] = useState(0)
    return (
        <>
            <Head><title>{t('bookings.title')}</title></Head>
            <h1 className={styles.headingXl}>{t('bookings.title')}</h1>
            <ToggleButton
                titleOne={t('bookings.myRequests')}
                titleTwo={t('bookings.received')}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
            />
            <br />
            {selectedIndex === 0
                ? <BookingList bookings={myBookings} />
                : <BookingList bookings={receivedBookings} />}
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context)
    if (!session) return { redirect: { destination: '/login', permanent: false } }
    // the two lists are the same shape and neither is useful without the other, so one round trip
    const [mine, received] = await Promise.all([
        getMyBookings(session),
        getReceivedBookings(session),
    ])
    return {
        props: {
            ...(await serverSideTranslations(context.locale || 'en', ['common'])),
            myBookings: mine?.content ?? [],
            receivedBookings: received?.content ?? [],
        }
    }
}
