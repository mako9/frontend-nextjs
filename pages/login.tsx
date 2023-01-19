import Head from 'next/head';
import Layout, { siteTitle } from '../app/components/layout';
import utilStyles from '../app/styles/utils.module.css';
import { useSession, signIn } from "next-auth/react"
import { useEffect } from 'react';
import Router from 'next/router'

export default function Login() {
    const { data } = useSession();
  
    useEffect(() => {
      if (data && data.status === 'authenticated') {
        Router.push('/')
      }
    }, [data]);
    
    return (
        <Layout home>
          <Head>
            <title>{siteTitle}</title>
          </Head>
          <section className={utilStyles.headingMd}>
            <p>Hey there!</p>
            <p>Please login or sign up here:</p>
          </section>
          <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <button onClick={() => signIn('keycloak', { callbackUrl: '/' })}>Sign in</button>
          </section>
        </Layout>
      );
}