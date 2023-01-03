import Head from 'next/head';
import Layout, { siteTitle } from '../app/components/layout';
import utilStyles from '../app/styles/utils.module.css';
import { getAllCommunities } from '../app/lib/communities';
import Link from 'next/link';
import Date from '../app/components/date';
import LoginButton from '../app/components/login-button';

export async function getStaticProps() {
  const allCommunitiesData = getAllCommunities();
  return {
    props: {
      allCommunitiesData: allCommunitiesData,
    },
  };
}

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
          {allCommunitiesData.map(({ uuid, name, createdAt }) => (
            <li className={utilStyles.listItem} key={uuid}>
            <Link href={`/communities/${uuid}`}>{name}</Link>
            <br />
            <small className={utilStyles.lightText}>
              <Date dateString={createdAt} />
            </small>
          </li>
          ))}
        </ul>
      </section>
      <LoginButton></LoginButton>
    </Layout>
  );
}