import { getItem, getItemImageUuids } from '../../app/lib/items'
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations'
import { getServerSideSession } from '../../app/utils/session'
import ownedItem from '../../app/components/subpages/ownedItem'
import foreignItem from '../../app/components/subpages/foreignItem'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next/pages'
import { getMyCommunities } from '../../app/lib/communities'
import { getBookingDates } from '../../app/lib/bookings'
import { BookingDateRange } from '../../app/models/booking'

export async function getServerSideProps(context) {
    const session = await getServerSideSession(context)
    const { id } = context.params
    const isOwned = context.query.isOwned ?? 'false'
    const itemData = await getItem(id, session)
    const itemImageData = await getItemImageUuids(id, session)
    const myCommunities = await getMyCommunities(session)
    // only the borrower's view offers dates, so only the borrower needs to know what is taken
    const bookedDates =
        isOwned === 'true' ? [] : await getBookingDates(id, session)

    // Pass data to the component props
    return {
        props: {
            session,
            itemData,
            itemImageData,
            myCommunities,
            bookedDates,
            isOwned,
            ...(await serverSideTranslations(context.locale ?? 'en', [
                'common',
            ])),
        },
    }
}

export default function Item({
    itemData,
    itemImageData,
    myCommunities,
    bookedDates = [] as BookingDateRange[],
    isOwned = 'false',
}) {
    const { t } = useTranslation('common')
    const session = useSession().data

    if (!itemData) {
        return null
    }
    return isOwned === 'true'
        ? ownedItem(session, itemData, itemImageData, myCommunities.content, t)
        : foreignItem(session, itemData, itemImageData, bookedDates, t)
}
