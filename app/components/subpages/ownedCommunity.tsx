import Head from 'next/head'
import { useState } from 'react'
import Input from '../input'
import Button from '../button'
import Table from '../table'
import {
    approveMemberRequests,
    declineMemberRequests,
    deleteCommunity,
    editCommunity,
} from '../../lib/communities'
import inputStyles from '../../styles/input.module.css'
import utilStyles from '../../styles/utils.module.css'
import keyStyles from '../../styles/keyValue.module.css'
import { useStateValue } from '../context'
import { useRouter } from 'next/router'
import { clientSideRequest } from '../../utils/request'

export default function ownedCommunity(
    session,
    communityData,
    members,
    requestingMember,
    t
) {
    const { state, setState } = useStateValue()
    const router = useRouter()

    const [name, setName] = useState(communityData.name)
    const [street, setStreet] = useState(communityData.street)
    const [houseNumber, setHouseNumber] = useState(communityData.houseNumber)
    const [postalCode, setPostalCode] = useState(communityData.postalCode)
    const [city, setCity] = useState(communityData.city)
    const [canBeJoined, setCanBeJoined] = useState(communityData.canBeJoined)
    const [userUuids, setUserUuids] = useState<String[]>([])

    const editCommunityWithLoading = clientSideRequest(
        editCommunity,
        state,
        setState
    )
    const deleteCommunityWithLoading = clientSideRequest(
        deleteCommunity,
        state,
        setState
    )
    const approveMemberRequestsWithLoading = clientSideRequest(
        approveMemberRequests,
        state,
        setState
    )
    const declineMemberRequestsWithLoading = clientSideRequest(
        declineMemberRequests,
        state,
        setState
    )
    const onHandleCommunityDelete = async () => {
        await deleteCommunityWithLoading(communityData.uuid, session)
        router.back()
    }
    const onHandleApproveMemberRequests = async () => {
        await approveMemberRequestsWithLoading(
            communityData.uuid,
            userUuids,
            session
        )
        router.reload()
    }
    const onHandleDeclineMemberRequests = async () => {
        await declineMemberRequestsWithLoading(
            communityData.uuid,
            userUuids,
            session
        )
        router.reload()
    }
    const handleListCheckboxChange = (row, isChecked) => {
        const userUuid = requestingMember.content[row.index]?.uuid as String
        if (userUuid) {
            if (isChecked) {
                setUserUuids(([] as String[]).concat(userUuids, [userUuid]))
            } else {
                setUserUuids(userUuids.filter((value) => value != userUuid))
            }
        }
    }

    const userColumns = [
        {
            Header: t('user.firstName'),
            accessor: 'firstName',
            className: 'th_round_left',
        },
        {
            Header: t('user.lastName'),
            accessor: 'lastName',
        },
    ]

    const requestColumns = ([] as any[]).concat(userColumns, [
        {
            Header: t('select'),
            Cell: ({ row }) => (
                <input
                    type="checkbox"
                    onChange={(e) =>
                        handleListCheckboxChange(row, e.target.checked)
                    }
                    checked={userUuids.includes(
                        requestingMember.content[row.index]?.uuid
                    )}
                />
            ),
            className: 'th_round_right',
        },
    ])

    return (
        <div>
            <Head>
                <title>{communityData.name}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingXl}>{communityData.name}</h1>
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
                <Button
                    title={t('save')}
                    onClick={() =>
                        editCommunityWithLoading(
                            {
                                street,
                                houseNumber,
                                postalCode,
                                city,
                                uuid: communityData.uuid,
                                name: communityData.name,
                                radius: communityData.radius,
                                latitude: communityData.latitude,
                                longitude: communityData.longitude,
                                canBeJoined: canBeJoined,
                            },
                            session
                        )
                    }
                />
                <Button title={t('delete')} onClick={onHandleCommunityDelete} />
            </div>
            <br />
            <br />
            <h3>{t('community.members')}</h3>
            <Table
                columns={userColumns}
                data={members.content}
                noValueText={t('community.noMembersExist')}
            />
            <br />
            <br />
            <h3>{t('community.memberRequests')}</h3>
            <Table
                columns={requestColumns}
                data={requestingMember.content}
                noValueText={t('community.noRequestsExist')}
            />
            <br />
            <Button
                title={t('community.approveRequests')}
                onClick={onHandleApproveMemberRequests}
                isDisabled={requestingMember.size > 0}
            />
            <Button
                title={t('community.declineRequests')}
                onClick={onHandleDeclineMemberRequests}
                isDisabled={requestingMember.size > 0}
            />
        </div>
    )
}
