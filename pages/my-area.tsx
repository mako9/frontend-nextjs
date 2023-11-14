import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useState } from 'react'
import Table from '../app/components/table'
import { getOwnedCommunities } from '../app/lib/communities'
import { getOwnedItems } from '../app/lib/items'
import ToggleButton from '../app/components/toggleButton'
import { useTranslation } from 'next-i18next'
import { getServerSideSession } from '../app/utils/session'
import Button from '../app/components/button'
import Router from 'next/router'

export const getServerSideProps = async (context) => {
    const session = await getServerSideSession(context)
    const ownedCommunitiesData = await getOwnedCommunities(session)
    const ownedItemsData = await getOwnedItems(session)
    return {
        props: {
            ownedCommunitiesData: ownedCommunitiesData
                ? ownedCommunitiesData.content
                : [],
            ownedItemsData: ownedItemsData ? ownedItemsData.content : [],
            ...(await serverSideTranslations(context.locale ?? 'en', [
                'common',
            ])),
        },
    }
}

const MyArea = ({ ownedCommunitiesData, ownedItemsData }) => {
    const { t } = useTranslation('common')
    const [selectedIndex, setSelectedIndex] = useState(0)

    const communityColumns = [
        {
            Header: t('name'),
            accessor: 'name',
            className: 'th_round_left_right',
            linkParams: { href: '/communities', query: { isOwned: true } },
        },
    ]

    const itemColumns = [
        {
            Header: t('name'),
            accessor: 'name',
            className: 'th_round_left',
            linkParams: { href: '/items', query: { isOwned: true } },
        },
        {
            Header: t('community.community'),
            accessor: 'communityName',
            className: 'th_round_right',
        },
    ]

    function handleButtonClick() {
        const path =
            selectedIndex === 0 ? '/communities/create' : '/items/create'
        Router.push(path)
    }

    return (
        <div className="center">
            <ToggleButton
                titleOne={t('myArea.communities')}
                titleTwo={t('myArea.items')}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
            />
            <br />
            <Table
                columns={selectedIndex === 0 ? communityColumns : itemColumns}
                data={
                    selectedIndex === 0 ? ownedCommunitiesData : ownedItemsData
                }
            />
            <br />
            {selectedIndex === 0 ? (
                <Button
                    title={t('myArea.createCommunity')}
                    onClick={handleButtonClick}
                />
            ) : (
                <Button
                    title={t('myArea.createItem')}
                    onClick={handleButtonClick}
                />
            )}
        </div>
    )
}
export default MyArea
