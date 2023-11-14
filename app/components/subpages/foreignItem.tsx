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

export default function foreignCommunity(
    session: Session | null,
    itemData: Item,
    itemImageData: [String],
    t
) {
    const [images, setImages] = useState<String[]>([])
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const categories = itemData.categories.map((category) =>
        itemCategories(t).find((e) => e.id === category)
    )

    useEffect(() => {
        async function loadImages() {
            let itemImages: String[] = []
            for (const itemImageUuid of itemImageData) {
                const itemImageBlob: Blob | null = await getItemImage(
                    itemImageUuid,
                    session
                )
                if (itemImageBlob)
                    itemImages.push(URL.createObjectURL(itemImageBlob))
            }
            setImages(itemImages)
        }
        loadImages()
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
            <KeyValue
                name={t('item.desiredBookingStartDate')}
                value={
                    <CustomDatePicker
                        selectedDate={startDate}
                        setSelectedDate={setStartDate}
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
                    />
                }
            />
            <br />
            <Button
                title={t('item.requestItem')}
                onClick={() =>
                    bookItem(itemData.uuid, startDate, endDate, session)
                }
                isDisabled={false}
                type="button"
            />
        </div>
    )
}
