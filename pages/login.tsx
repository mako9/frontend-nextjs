import Head from 'next/head';
import { siteTitle } from '../app/components/layout';
import utilStyles from '../app/styles/utils.module.css';
import { useSession, signIn } from "next-auth/react";
import { useEffect } from 'react';
import Router from 'next/router';
import styles from '../app/styles/layout.module.css';

export default function Login() {
    const { data } = useSession();
  
    useEffect(() => {
      if (data && data.status === 'authenticated') {
        Router.push('/')
      }
    }, [data]);
    
    return (
      <div>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <header className={styles.header}>
            <img
              src="/images/quokka_logo.png"
              height={144}
              width={144}
              alt=""
            />
            <h1 className={utilStyles.heading2Xl}>ComShare</h1>
        </header>
        <section className={utilStyles.headingMd}>
          <p>Hey there!</p>
          <p>Please login or sign up here:</p>
          <br/><br/>
        </section>
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <button className='button' onClick={() => signIn('keycloak', { callbackUrl: '/' })}>Go to sign up page</button>
        </section>
    </div>
  );
}