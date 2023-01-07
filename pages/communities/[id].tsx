import Layout from '../../app/components/layout'
import { getCommunity } from '../../app/lib/communities'
import Head from 'next/head'
import utilStyles from '../../app/styles/utils.module.css'

export async function getServerSideProps(context) {
  const { id } = context.params;
  const communityData = await getCommunity(id, context);

  // Pass data to the component props
  return { props: { communityData } }
}

export default function Community({ communityData }) {
  if (!communityData) {
    return null;
  }
  return (
    <Layout home={undefined}>
      <Head>
        <title>{communityData.name}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{communityData.name}</h1>
      </article>
    </Layout>
  );
}