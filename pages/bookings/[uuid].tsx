import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next/pages'
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ItemBooking } from '../../app/models/booking'
import { getBooking, approveBooking, declineBooking, cancelBooking, returnBooking } from '../../app/lib/bookings'
import Button from '../../app/components/button'
import { formatDate } from '../../app/utils/dates'
import styles from '../../app/styles/utils.module.css'

export default function BookingDetailPage({ booking }: { booking: ItemBooking | null }) {
    const { t, i18n } = useTranslation('common')
    const { data: session } = useSession()
    const router = useRouter()

    if (!booking) return <p>{t('bookings.notFound')}</p>

    // the server tells us which side of the booking the caller is on; without this the owner's
    // approve/decline controls were dead code
    const isOwner = booking.isItemOwner
    const canCancel = (booking.status === 'PENDING' || booking.status === 'CONFIRMED') && new Date(booking.startAt) > new Date()

    return (
        <>
            <Head><title>{t('bookings.detail')}</title></Head>
            <h1 className={styles.headingXl}>{t('bookings.detail')}</h1>
            <p><strong>{t('booking.status.label')}:</strong> {t(`booking.status.${booking.status.toLowerCase()}`)}</p>
            <p><strong>{t('booking.from')}:</strong> {formatDate(booking.startAt, i18n?.language)}</p>
            <p><strong>{t('booking.to')}:</strong> {formatDate(booking.endAt, i18n?.language)}</p>
            <br />
            {booking.status === 'PENDING' && isOwner && (
                <>
                    <Button title={t('booking.approve')} onClick={async () => {
                        await approveBooking(booking.uuid, session)
                        router.push('/bookings')
                    }} isDisabled={false} type="button" />
                    <Button title={t('booking.decline')} onClick={async () => {
                        await declineBooking(booking.uuid, session)
                        router.push('/bookings')
                    }} isDisabled={false} type="button" />
                </>
            )}
            {booking.status === 'CONFIRMED' && (
                <Button title={t('booking.return')} onClick={async () => {
                    await returnBooking(booking.uuid, session)
                    router.push('/bookings')
                }} isDisabled={false} type="button" />
            )}
            {canCancel && (
                <Button title={t('booking.cancel')} onClick={async () => {
                    await cancelBooking(booking.uuid, session)
                    router.push('/bookings')
                }} isDisabled={false} type="button" />
            )}
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context)
    if (!session) return { redirect: { destination: '/login', permanent: false } }
    const { uuid } = context.params!
    const booking = await getBooking(uuid as string, session)
    return {
        props: {
            ...(await serverSideTranslations(context.locale || 'en', ['common'])),
            booking,
        }
    }
}
