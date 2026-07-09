import Head from 'next/head'
import { useState } from 'react'
import { getServerSideSession } from '../../app/utils/session'
import { getMyCommunities } from '../../app/lib/communities'
import Input from '../../app/components/input'
import Button from '../../app/components/button'
import { createItem, uploadItemImage } from '../../app/lib/items'
import utilStyles from '../../app/styles/utils.module.css'
import inputStyles from '../../app/styles/input.module.css'
import keyStyles from '../../app/styles/keyValue.module.css'
import { useStateValue } from '../../app/components/context'
import { useRouter } from 'next/router'
import { clientSideRequest } from '../../app/utils/request'
import { useTranslation } from 'next-i18next/pages'
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations'
import { useSession } from 'next-auth/react'
import ImageGallery from '../../app/components/imageGallery'
import FileUpload from '../../app/components/FileUpload'
import Dropdown, { DropdownOption } from '../../app/components/dropdown'

export async function getServerSideProps(context) {
    const session = await getServerSideSession(context)
    const myCommunities = await getMyCommunities(session)
    // Pass data to the component props
    return {
        props: {
            myCommunities,
            ...(await serverSideTranslations(context.locale ?? 'en', [
                'common',
            ])),
        },
    }
}

export default function createItemPage({ myCommunities }) {
    const { t } = useTranslation('common')
    const session = useSession().data
    const { state, setState } = useStateValue()
    const router = useRouter()

    const itemCategories = [
        { id: 'HOUSEKEEPING', label: t('item.category.housekeeping') },
        { id: 'GARDENING', label: t('item.category.gardening') },
        { id: 'TOOL', label: t('item.category.tool') },
        { id: 'ELECTRIC_DEVICE', label: t('item.category.electicDevice') },
        { id: 'OTHER', label: t('item.category.other') },
    ]

    const [name, setName] = useState(null)
    const [street, setStreet] = useState(null)
    const [houseNumber, setHouseNumber] = useState(null)
    const [postalCode, setPostalCode] = useState(null)
    const [city, setCity] = useState(null)
    const [isActive, setIsActive] = useState(true)
    const [requiresApproval, setRequiresApproval] = useState(false)
    const [categories, setCategories] = useState<DropdownOption[]>([])
    const [community, setCommunity] = useState<DropdownOption | null>(
        myCommunities.content.length > 0
            ? {
                  id: myCommunities.content[0].uuid,
                  label: myCommunities.content[0].name,
              }
            : null
    )
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const onHandleItemImageDelete = async () => {
        URL.revokeObjectURL(imageUrls[currentImageIndex])
        setImageUrls(imageUrls.filter((_, i) => i !== currentImageIndex))
        setImageFiles(imageFiles.filter((_, i) => i !== currentImageIndex))
        setCurrentImageIndex(Math.max(0, currentImageIndex - 1))
    }
    const onHandleImageUpload = async (uploadImageFile: File) => {
        const newImageUrls = imageUrls.concat([
            URL.createObjectURL(uploadImageFile),
        ])
        setImageUrls(newImageUrls)
        const newImageFiles = imageFiles.concat([uploadImageFile])
        setImageFiles(newImageFiles)
        const newIndex = newImageUrls.length - 1
        setCurrentImageIndex(newIndex)
    }
    const uploadImages = async (itemUuid: string) => {
        for (const imageFile of imageFiles) {
            await uploadItemImage(itemUuid, imageFile, session)
        }
    }

    const createItemWithLoading = clientSideRequest(createItem, state, setState)
    const onHandleItemCreate = async () => {
        const createdItem = await createItemWithLoading(
            {
                street,
                houseNumber,
                postalCode,
                city,
                uuid: null,
                name: name,
                active: isActive,
                requiresApproval,
                categories: categories.map((category) => category.id),
                communityUuid: community?.id ?? null,
                userUuid: null,
                availability: [],
                availableUntil: null,
                description: null,
                communityName: '',
            },
            session
        )

        await uploadImages(createdItem.uuid)
        router.back()
    }

    return (
        <div>
            <Head>
                <title>{t('myArea.createItem')}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingXl}>
                    {t('myArea.createItem')}
                </h1>
            </article>
            <br />
            <h3>{t('name')}</h3>
            <Input
                input={name}
                setInput={setName}
                placeholder={t('name')}
                className={'input_left'}
            />
            <br />
            <br />
            <h3>{t('address')}</h3>
            <div className="horizontal_container">
                <Input
                    input={street}
                    setInput={setStreet}
                    placeholder={t('street')}
                    className={'input_left'}
                />
                <Input
                    input={houseNumber}
                    setInput={setHouseNumber}
                    placeholder={t('houseNumber')}
                    className={'input_right'}
                />
            </div>
            <div className="vertical_spacer" />
            <div className="horizontal_container">
                <Input
                    input={postalCode}
                    setInput={setPostalCode}
                    placeholder={t('postalCode')}
                    className={'input_left'}
                />
                <Input
                    input={city}
                    setInput={setCity}
                    placeholder={t('city')}
                    className={'input_right'}
                />
            </div>
            <br />
            <div className="horizontal_container">
                <text className={keyStyles.key}>{t('item.isActive')}</text>
                <input
                    className={inputStyles.input_right}
                    type="checkbox"
                    onChange={(e) => setIsActive(!isActive)}
                    checked={isActive}
                />
            </div>
            <br />
            <div className="horizontal_container">
                <text className={keyStyles.key}>{t('item.requiresApproval')}</text>
                <input
                    className={inputStyles.input_right}
                    type="checkbox"
                    onChange={() => setRequiresApproval(!requiresApproval)}
                    checked={requiresApproval}
                />
            </div>
            <br />
            <br />
            <h3>{t('item.relatedCommunity')}</h3>
            <Dropdown
                options={myCommunities.content.map((e) => ({
                    id: e.uuid,
                    label: e.name,
                }))}
                placeHolder={t('pleaseSelect')}
                isMulti={false}
                isSearchable={true}
                onChange={(value) => setCommunity(value)}
                initialOption={community ? [community] : []}
            />
            <br />
            <h3>{t('item.category.category')}</h3>
            <Dropdown
                options={itemCategories}
                placeHolder={t('pleaseSelect')}
                isMulti={true}
                isSearchable={true}
                onChange={(values) => setCategories(values)}
                initialOption={categories}
            />
            <br />
            <br />
            <div className="vertical_spacer" />
            <h3>{t('item.images')}</h3>
            <div>
                {imageUrls.length > 0 ? (
                    <div className="horizontal_container">
                        <ImageGallery
                            images={imageUrls}
                            currentImageIndex={currentImageIndex}
                            setCurrentImageIndex={setCurrentImageIndex}
                            t={t}
                        />
                        <div>
                            <Button
                                title={t('item.deleteImage')}
                                onClick={onHandleItemImageDelete}
                            />
                        </div>
                    </div>
                ) : null}
                {imageUrls.length > 0 ? <br /> : null}
                <FileUpload
                    title={t('item.uploadImage')}
                    handleUploadedFile={onHandleImageUpload}
                    t={t}
                />
            </div>
            <br />
            <br />
            <div style={{ display: 'flex' }}>
                <Button title={t('save')} onClick={onHandleItemCreate} />
            </div>
        </div>
    )
}

createItemPage.auth = true
