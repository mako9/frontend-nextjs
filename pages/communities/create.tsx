import Head from 'next/head'
import { useState } from 'react'
import Input from '../../app/components/input'
import Button from '../../app/components/button'
import { createCommunity } from '../../app/lib/communities'
import inputStyles from '../../app/styles/input.module.css'
import utilStyles from '../../app/styles/utils.module.css'
import keyStyles from '../../app/styles/keyValue.module.css'
import { useStateValue } from '../../app/components/context'
import { useRouter } from 'next/router'
import { clientSideRequest } from '../../app/utils/request'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useSession } from 'next-auth/react'

export async function getServerSideProps(context) {
    // Pass data to the component props
    return {
        props: {
            ...(await serverSideTranslations(context.locale ?? 'en', [
                'common',
            ])),
        },
    }
}

export default function createCommunityPage() {
    const { t } = useTranslation('common')
    const session = useSession().data
    const { state, setState } = useStateValue()
    const router = useRouter()

    const [name, setName] = useState(null)
    const [street, setStreet] = useState(null)
    const [houseNumber, setHouseNumber] = useState(null)
    const [postalCode, setPostalCode] = useState(null)
    const [city, setCity] = useState(null)
    const [radius, setRadius] = useState(50)
    const [canBeJoined, setCanBeJoined] = useState<boolean | undefined>(
        undefined
    )

    const createCommunityWithLoading = clientSideRequest(
        createCommunity,
        state,
        setState
    )
    const onHandleCommunityCreate = async () => {
        await createCommunityWithLoading(
            {
                street,
                houseNumber,
                postalCode,
                city,
                uuid: null,
                name: name,
                radius: radius,
                latitude: null,
                longitude: null,
                canBeJoined: canBeJoined,
            },
            session
        )
        router.back()
    }

    return (
        <div>
            <Head>
                <title>{t('myArea.createCommunity')}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingXl}>
                    {t('myArea.createCommunity')}
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
            <div className="vertical_spacer" />
            <h3>{t('community.radius')}</h3>
            <Input
                input={radius}
                setInput={setRadius}
                placeholder={t('community.radius')}
                className={'input_left'}
            />
            <br />
            <br />
            <div className="horizontal_container">
                <text className={keyStyles.key}>
                    {t('community.canBeJoined')}
                </text>
                <input
                    className={inputStyles.input_right}
                    type="checkbox"
                    onChange={(e) => setCanBeJoined(!canBeJoined)}
                    checked={canBeJoined}
                />
            </div>
            <br />
            <div style={{ display: 'flex' }}>
                <Button title={t('save')} onClick={onHandleCommunityCreate} />
            </div>
        </div>
    )
}
