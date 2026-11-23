import Head from 'next/head'
import utilStyles from '../../styles/utils.module.css'
import KeyValue from '../keyValue'
import keyValueStyles from '../../styles/keyValue.module.css'
import Button from '../button'
import { Item, itemCategories } from '../../models/item'
import { bookItem, getItemImage } from '../../lib/items'
import { useEffect, useState } from 'react'
import ImageGallery from '../imageGallery'
import { Session } from 'next-auth'
import CustomDatePicker from '../datePicker'
import { BookingDateRange } from '../../models/booking'

export default function foreignCommunity(
    session: Session | null,
    itemData: Item,
    itemImageData: String[],
    bookedDates: BookingDateRange[],
    t
) {
    const [images, setImages] = useState<String[]>([])
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [booked, setBooked] = useState(false)
    // The picker paints every day cell at midnight, so a raw booking interval would exclude the days its
    // midnight falls inside and skip the day it merely starts on: 09:00 -> 17:00 two days later would
    // block one day out of three. A neighbour reads a calendar in whole days, so the day of handover
    // counts as taken. This is presentation only - the server refuses overlaps by exact timestamp.
    const excludeDateIntervals = bookedDates.map((range) => {
        const start = new Date(range.startAt)
        start.setHours(0, 0, 0, 0)
        const end = new Date(range.endAt)
        end.setHours(23, 59, 59, 999)
        return { start, end }
    })
    const categories = itemData.categories
        .map((category) => itemCategories(t).find((e) => e.id === category))
        .filter((c): c is { id: string; label: string } => c !== undefined)

    useEffect(() => {
        const createdUrls: string[] = []
        async function loadImages() {
            let itemImages: String[] = []
            for (const itemImageUuid of itemImageData) {
                const itemImageBlob: Blob | null = await getItemImage(
                    itemImageUuid,
                    session
                )
                if (itemImageBlob) {
                    const url = URL.createObjectURL(itemImageBlob)
                    createdUrls.push(url)
                    itemImages.push(url)
                }
            }
            setImages(itemImages)
        }
        loadImages()
        return () => {
            createdUrls.forEach((url) => URL.revokeObjectURL(url))
        }
    }, [])

    return (
        <div>
            <Head>
                <title>{itemData.name}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingXl}>{itemData.name}</h1>
            </article>
            <div>
                {images.length > 0 ? (
                    <div className="horizontal_container">
                        <ImageGallery
                            images={images}
                            currentImageIndex={currentImageIndex}
                            setCurrentImageIndex={setCurrentImageIndex}
                            t={t}
                        />
                    </div>
                ) : null}
            </div>
            <br />
            <KeyValue
                name={t('item.category.category')}
                value={categories.map((c) => c.label)}
            />
            <KeyValue
                name={t('item.description')}
                value={itemData.description}
            />
            <br />
            {excludeDateIntervals.length > 0 && (
                <p style={{ color: 'orange' }}>{t('item.alreadyBooked')}</p>
            )}
            <KeyValue
                name={t('item.desiredBookingStartDate')}
                value={
                    <CustomDatePicker
                        selectedDate={startDate}
                        setSelectedDate={setStartDate}
                        excludeDateIntervals={excludeDateIntervals}
                    />
                }
            />
            <br />
            <KeyValue
                name={t('item.desiredBookingEndDate')}
                value={
                    <CustomDatePicker
                        selectedDate={endDate}
                        setSelectedDate={setEndDate}
                        excludeDateIntervals={excludeDateIntervals}
                    />
                }
            />
            <br />
            {itemData.requiresApproval && (
                <p style={{ color: 'orange' }}>{t('item.approvalRequired')}</p>
            )}
            {booked ? (
                <p style={{ color: 'green' }}>{t('item.bookingRequested')}</p>
            ) : (
                <Button
                    title={t('item.requestItem')}
                    onClick={async () => {
                        await bookItem(itemData.uuid, startDate, endDate, session)
                        setBooked(true)
                    }}
                    isDisabled={false}
                    type="button"
                />
            )}
        </div>
    )
}
