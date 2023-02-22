import Head from "next/head";
import utilStyles from '../../app/styles/utils.module.css';

export default function foreignCommunity(session, itemData, t) {
    return (
        <div>
          <Head>
            <title>{itemData.name}</title>
          </Head>
          <article>
            <h1 className={utilStyles.headingXl}>{itemData.name}</h1>
          </article>
        </div>
      );
}