import dynamic from 'next/dynamic';
import styles from '../../styles/map.module.css';
import keyValueStyles from '../../styles/keyValue.module.css';
import utilStyles from '../../styles/utils.module.css';
import Head from 'next/head';
import KeyValue from '../keyValue';
import Button from '../button';
import { joinCommunity } from '../../lib/communities';

export default function foreignCommunity(session, communityData, t) {
    const Map = dynamic(
      () => import('../map'),
      { 
        loading: () => <div className={`${styles.map} ${styles.map_default_background}`} >
          <p>A map is loading...</p>
        </div>,
        ssr: false
      }
    )
    return (
      <div>
        <Head>
          <title>{communityData.name}</title>
        </Head>
        <article>
          <h1 className={utilStyles.headingXl}>{communityData.name}</h1>
        </article>
        <div className={keyValueStyles.key_value_horizontal_container}>
          <KeyValue name={t('street')} value={communityData.street}/>
          <KeyValue name={t('houseNumber')} value={communityData.houseNumber}/>
        </div>
        <div className={keyValueStyles.key_value_horizontal_container}>
          <KeyValue name={t('postalCode')} value={communityData.postalCode}/>
          <KeyValue name={t('city')} value={communityData.city}/>
        </div>
        <br/>
        <Map name={communityData.name} latitude={communityData.latitude} longitude={communityData.longitude} radius={communityData.radius} />
        <br/>
        <Button title={t('community.requestMembership')} onClick={() => joinCommunity(communityData.uuid, session)} isDisabled={!communityData.canBeJoined} />
      </div>
    );
  }