import Layout from '../../app/components/layout';
import { getAllCommunities, getAllCommunityUuids, getCommunity } from '../../app/lib/communities';
import Head from 'next/head';
import Date from '../../app/components/date';
import utilStyles from '../../app/styles/utils.module.css';


export default function Community({ communityData }) {
    return (
      <Layout>
        <Head>
          <title>{communityData.name}</title>
        </Head>
        <article>
          <h1 className={utilStyles.headingXl}>{communityData.name}</h1>
          <div className={utilStyles.lightText}>
            <Date dateString={communityData.createdAt} />
          </div>
        </article>
      </Layout>
    );
  }

export async function getStaticPaths() {
    const paths = getAllCommunityUuids();
    return {
      paths,
      fallback: false,
    };
  }

  export async function getStaticProps({ params }) {
    const communityData = await getCommunity(params.id);
    return {
      props: {
        communityData,
      },
    };
  }