import { getItem, getItemImageUuids } from '../../app/lib/items'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getServerSideSession } from '../../app/utils/session';
import ownedItem from '../../app/components/subpages/ownedItem';
import foreignItem from '../../app/components/subpages/foreignItem';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { getMyCommunities } from '../../app/lib/communities';

export async function getServerSideProps(context) {
  const session = await getServerSideSession(context);
  const { id } = context.params;
  const isOwned = context.query.isOwned ?? 'false';
  const itemData = await getItem(id, session);
  const itemImageData = await getItemImageUuids(id, session)
  const myCommunities = await getMyCommunities(session);

  // Pass data to the component props
  return { props: { 
    session,
    itemData,
    itemImageData,
    myCommunities,
    isOwned,
    ...(await serverSideTranslations(context.locale ?? 'en', [
      'common',
    ])),
  } }
}

export default function Item({ itemData, itemImageData, myCommunities, isOwned = 'false' }) {
  const { t } = useTranslation('common');
  const session = useSession().data;

  if (!itemData) {
    return null;
  }
  return isOwned === 'true' ? ownedItem(session, itemData, itemImageData, myCommunities.content, t) : foreignItem(session, itemData, t)
}