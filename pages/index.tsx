import Head from 'next/head';
import { siteTitle } from '../app/components/layout';
import utilStyles from '../app/styles/utils.module.css';
import { getAllCommunities } from '../app/lib/communities';
import { getAllItemsOfMyCommunities, getItemImage } from '../app/lib/items';
import { ItemImage } from '../app/models/item';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { getServerSideSession } from '../app/utils/session';
import Gallery from '../app/components/gallery';
import { useState } from "react";

export const getServerSideProps = async (context) => {
  const session = await getServerSideSession(context);
  const allCommunitiesData = await getAllCommunities(session);
  const allItemsData = await getAllItemsOfMyCommunities(session);
  return {
    props: {
      allCommunitiesData: allCommunitiesData ? allCommunitiesData.content : [],
      allItemsData: allItemsData ? allItemsData.content : [],
      ...(await serverSideTranslations(context.locale ?? 'en', [
        'common',
      ])),
    },
  };
};

export default function Home({ allCommunitiesData, allItemsData }) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const session = useSession().data;

  useEffect(() => {
    if (session?.status === 'unauthenticated' || !session || new Date(session.expires) < new Date()) {
      router.push('/login')
    }
  }, [session]);

  const [itemImages, setItemImages] = useState<ItemImage[]>([]);

  useEffect(() => {
    async function loadImages() {
        let itemImages: ItemImage[] = [];
        for (const item of allItemsData) {
            const itemImageBlob = await getItemImage(item.firstImageUuid, session);
            if (itemImageBlob) {
              itemImages.push({
                uuid: item.uuid,
                imageUrl: URL.createObjectURL(itemImageBlob)
              }
            )
        }
      }
      setItemImages(itemImages);
    }
    loadImages();
  }, []);

  function onItemClick(uuid) {
    console.log(uuid)
    router.push(`/items/${uuid}`)
  }

  return (
    <div>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>{t('index.header')}</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <ul className={utilStyles.list}>
          <Gallery items={allItemsData} title={t('index.availableItems')} images={itemImages} onClick={onItemClick} />
        </ul>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>{t('index.availableCommunities')}</h2>
        <ul className={utilStyles.list}>
          {allCommunitiesData.map(({ uuid, name }) => (
            <li className={utilStyles.listItem} key={uuid}>
            <Link href={{ pathname: `/communities/${uuid}`, query: { isOwned: false }}}>{name}</Link>
          </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

Home.auth = true;