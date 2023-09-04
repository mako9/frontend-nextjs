import Head from "next/head";
import utilStyles from '../../styles/utils.module.css';
import inputStyles from '../../styles/input.module.css';
import keyStyles from '../../styles/keyValue.module.css';
import Input from "../input";
import { useEffect, useState } from "react";
import Button from "../button";
import { getItemImage, deleteItem, editItem, uploadItemImage, deleteItemImage } from "../../lib/items";
import Dropdown, { DropdownOption } from "../dropdown";
import { clientSideRequest } from "../../utils/request";
import { useStateValue } from "../../components/context";
import { useRouter } from 'next/router';
import ImageGallery from "../imageGallery";
import FileUpload from "../FileUpload";

export default function ownedItem(session, itemData, itemImageData, myCommunities, t) {
    const { state, setState } = useStateValue();
    const router = useRouter();

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
    const [community, setCommunity] = useState<DropdownOption | null>(initialCommunity ? { id: initialCommunity.uuid, label: initialCommunity.name } : null);
    const initialCategories = itemData.categories.map(category => itemCategories.find(e => e.id === category));
    const [categories, setCategories] = useState(initialCategories);
    const [images, setImages] = useState<String[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        async function loadImages() {
            let itemImages: String[] = [];
            for (const itemImageUuid of itemImageData) {
                const itemImageBlob: Blob | null = await getItemImage(itemImageUuid, session);
                if(itemImageBlob) itemImages.push(URL.createObjectURL(itemImageBlob));
            }
            setImages(itemImages);
        }
        loadImages();
    }, []);

    const editItemWithLoading = clientSideRequest(editItem, state, setState);
    const deleteItemWithLoading = clientSideRequest(deleteItem, state, setState);
    const deleteItemImageWithLoading = clientSideRequest(deleteItemImage, state, setState);
    const uploadImageWithLoading = clientSideRequest(uploadItemImage, state, setState);
    const onHandleImageUpload = async (uploadImage) => {
        await uploadImageWithLoading(itemData.uuid, uploadImage, session);
        const newImages = images.concat([URL.createObjectURL(uploadImage)]);
        setImages(newImages);
        const newIndex = newImages.length - 1;
        setCurrentImageIndex(newIndex);
    }
    const onHandleItemDelete = async () => {
        await deleteItemWithLoading(itemData.uuid, session);
        router.back();
    }
    const onHandleItemImageDelete = async () => {
        await deleteItemImageWithLoading(itemImageData[currentImageIndex], session);
        const newIndex = currentImageIndex - 1;
        setCurrentImageIndex(newIndex);
        images.splice(currentImageIndex, 1)
        setImages(images);
    }
    
    return (
        <div>
          <Head>
            <title>{itemData.name}</title>
            </Head>
            <article>
            <h1 className={utilStyles.headingXl}>{itemData.name}</h1>
            </article>
            <h3>{t('item.images')}</h3>
            <div>
                {images.length > 0 ? <div className="horizontal_container">
                    <ImageGallery images={images} currentImageIndex={currentImageIndex} setCurrentImageIndex={setCurrentImageIndex} t={t} />
                    <div>
                        <Button title={t('item.deleteImage')} onClick={onHandleItemImageDelete} />
                    </div>
                </div> : null}
                {images.length > 0 ? <br/> : null}
                <FileUpload title={t('item.uploadImage')} handleUploadedFile={onHandleImageUpload} t={t} />
            </div>
            <br/>
            <h3>{t('name')}</h3>
            <Input input={name} setInput={setName} placeholder={t('name')} className={'input_left'}/>
            <br/><br/>
            <h3>{t('address')}</h3>
            <div className="horizontal_container">
            <Input input={street} setInput={setStreet} placeholder={t('street')} className={'input_left'}/>
            <Input input={houseNumber} setInput={setHouseNumber} placeholder={t('houseNumber')}className={'input_right'}/>
            </div>
            <div className="vertical_spacer"/>
            <div className="horizontal_container">
            <Input input={postalCode} setInput={setPostalCode} placeholder={t('postalCode')} className={'input_left'}/>
            <Input input={city} setInput={setCity} placeholder={t('city')} className={'input_right'}/>
            </div>
            <br/>
            <div className="horizontal_container">
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
                initialOption={community ? [community] : []}
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
            <Button title={t('save')} onClick={() => editItemWithLoading({
                street,
                houseNumber,
                postalCode,
                city,
                uuid: itemData.uuid,
                name: name,
                active: isActive,
                categories: categories.map((category) => category.id),
                communityUuid: community ? community.id : null,
                userUuid: itemData.userUuid,
                availability: itemData.availability,
                availableUntil: itemData.availableUntil,
                description: itemData.desciption,
                communityName: ""
            }, session)} />
            <Button title={t('delete')} onClick={onHandleItemDelete} />
            </div>
        </div>
      );
}
