import Head from 'next/head';
import Layout, { siteTitle } from '../app/components/layout';
import utilStyles from '../app/styles/utils.module.css';
import { getAllCommunities } from '../app/lib/communities';
import Link from 'next/link';
import LoginButton from '../app/components/login-button';

export const getServerSideProps = async (context) => {
  const allCommunitiesData = await getAllCommunities(context);
  return {
    props: {
      allCommunitiesData: allCommunitiesData ? allCommunitiesData.content : [],
    },
  };
};

export default function Home({ allCommunitiesData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>This is the beginning of something bigger.</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Communities:</h2>
        <ul className={utilStyles.list}>
          {allCommunitiesData.map(({ uuid, name }) => (
            <li className={utilStyles.listItem} key={uuid}>
            <Link href={`/communities/${uuid}`}>{name}</Link>
          </li>
          ))}
        </ul>
      </section>
      <LoginButton></LoginButton>
    </Layout>
  );
}