import Head from 'next/head';
import { siteTitle } from '../app/components/layout';
import utilStyles from '../app/styles/utils.module.css';
import { getAllCommunities } from '../app/lib/communities';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Router from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export const getServerSideProps = async (context) => {
  const allCommunitiesData = await getAllCommunities(context);
  return {
    props: {
      allCommunitiesData: allCommunitiesData ? allCommunitiesData.content : [],
      ...(await serverSideTranslations(context.locale ?? 'en', [
        'common',
      ])),
    },
  };
};

export default function Home({ allCommunitiesData }) {
  const { t } = useTranslation('common');
  const { data } = useSession();

  useEffect(() => {
    if (data?.status === 'unauthenticated') {
      Router.push('/login')
    }
  }, [data]);

  return (
    <div>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>{t('index.header')}</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>{t('index.tableHeader')}</h2>
        <ul className={utilStyles.list}>
          {allCommunitiesData.map(({ uuid, name }) => (
            <li className={utilStyles.listItem} key={uuid}>
            <Link href={`/communities/${uuid}`}>{name}</Link>
          </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

Home.auth = true;