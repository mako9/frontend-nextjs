import { getCommunity, getMemberOfCommunity, getReguestingMemberOfCommunity } from '../../app/lib/communities'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { getServerSideSession } from '../../app/utils/session';
import { useSession } from 'next-auth/react';
import ownedCommunity from '../../app/components/subpages/ownedCommunity';
import foreignCommunity from '../../app/components/subpages/foreignCommunity';

export async function getServerSideProps(context) {
  const session = await getServerSideSession(context);
  const { id } = context.params;
  const { isOwned } = context.query;
  const communityData = await getCommunity(id, session);
  const members = await getMemberOfCommunity(id, session);
  const requestingMember = await getReguestingMemberOfCommunity(id, session);

  // Pass data to the component props
  return { props: { 
    communityData,
    members,
    isOwned,
    requestingMember,
    ...(await serverSideTranslations(context.locale ?? 'en', [
      'common',
    ])),
  } }
}

export default function Community({ communityData, members, requestingMember, isOwned }) {
  const { t } = useTranslation('common');
  const session = useSession().data;
  
  if (!communityData) {
    return null;
  }
  return isOwned === 'true' ? ownedCommunity(session, communityData, members, requestingMember, t) : foreignCommunity(session, communityData, t)
}