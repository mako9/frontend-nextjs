import Head from "next/head";
import utilStyles from '../../styles/utils.module.css';
import inputStyles from '../../styles/input.module.css';
import keyStyles from '../../styles/keyValue.module.css';
import Input from "../input";
import { useState } from "react";
import Button from "../button";
import { deleteItem, editItem } from "../../lib/items";
import Dropdown from "../dropdown";

export default function ownedCommunity(session, itemData, myCommunities, t) {
    const itemCategories = [
        { id: 'HOUSEKEEPING', label: t('item.category.housekeeping') },
        { id: 'GARDENING', label: t('item.category.gardening') },
        { id: 'TOOL', label: t('item.category.tool') },
        { id: 'ELECTRIC_DEVICE', label: t('item.category.electicDevice') },
        { id: 'OTHER', label: t('item.category.other') }
    ];

    const [name, setName] = useState(itemData.name);
    const [street, setStreet] = useState(itemData.street);
    const [houseNumber, setHouseNumber] = useState(itemData.houseNumber);
    const [postalCode, setPostalCode] = useState(itemData.postalCode);
    const [city, setCity] = useState(itemData.city);
    const [isActive, setIsActive] = useState(itemData.active);
    const initialCommunity = myCommunities.find(e => e.uuid === itemData.communityUuid);
    const [community, setCommunity] = useState(initialCommunity ? { id: initialCommunity.uuid, label: initialCommunity.name } : null);
    const initialCategories = itemData.categories.map(category => itemCategories.find(e => e.id === category));
    const [categories, setCategories] = useState(initialCategories);
    
    return (
        <div>
          <Head>
            <title>{itemData.name}</title>
            </Head>
            <article>
            <h1 className={utilStyles.headingXl}>{itemData.name}</h1>
            </article>
            <br/>
            <h3>{t('name')}</h3>
            <Input input={name} setInput={setName} placeholder={t('name')} className={'input_left'}/>
            <br/><br/>
            <h3>{t('address')}</h3>
            <div className={inputStyles.input_horizontal_container}>
            <Input input={street} setInput={setStreet} placeholder={t('street')} className={'input_left'}/>
            <Input input={houseNumber} setInput={setHouseNumber} placeholder={t('houseNumber')}className={'input_right'}/>
            </div>
            <div className="spacer"/>
            <div className={inputStyles.input_horizontal_container}>
            <Input input={postalCode} setInput={setPostalCode} placeholder={t('postalCode')} className={'input_left'}/>
            <Input input={city} setInput={setCity} placeholder={t('city')} className={'input_right'}/>
            </div>
            <br/>
            <div className={inputStyles.input_horizontal_container}>
                <text className={keyStyles.key}>{t('item.isActive')}</text>
                <input
                    className={inputStyles.input_right}
                    type="checkbox"
                    onChange={(e) => setIsActive(!isActive)}
                    checked={isActive}
                />
            </div>
            <br/>
            <h3>{t('item.relatedCommunity')}</h3>
            <Dropdown
                options={myCommunities.map(e => ({ id: e.uuid, label: e.name }))}
                placeHolder={t('pleaseSelect')}
                isMulti={false}
                isSearchable={true}
                onChange={(value) => setCommunity(value)}
                initialOption={community}
            />
            <br/>
            <h3>{t('item.category.category')}</h3>
            <Dropdown
                options={itemCategories}
                placeHolder={t('pleaseSelect')}
                isMulti={true}
                isSearchable={true}
                onChange={(values) => setCategories(values)}
                initialOption={categories}
            />
            <br/><br/>
            <div style={{display: 'flex'}}>
            <Button title={t('save')} onClick={() => editItem({
                street,
                houseNumber,
                postalCode,
                city,
                uuid: itemData.uuid,
                name: name,
                active: isActive,
                categories: categories.map((category) => category.id),
                communityUuid: community.id,
                userUuid: itemData.userUuid,
                availability: itemData.availability,
                availableUntil: itemData.availableUntil,
                description: itemData.desciption,
                communityName: ""
            }, session)} />
            <Button title={t('delete')} onClick={() => deleteItem(itemData.uuid, session)} />
            </div>
        </div>
      );
}