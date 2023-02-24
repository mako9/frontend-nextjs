import Head from 'next/head';
import { siteTitle } from '../app/components/layout';
import utilStyles from '../app/styles/utils.module.css';
import { useSession, signIn } from "next-auth/react";
import { useEffect } from 'react';
import Router from 'next/router';
import styles from '../app/styles/layout.module.css';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Button from '../app/components/button';

export default function Login() {
  const { t } = useTranslation('common');
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
          />
          <h1 className={utilStyles.heading2Xl}>ComShare</h1>
      </header>
      <section className={utilStyles.headingMd}>
        <p>{t('login.greeting')}</p>
        <p>{t('login.signupMessage')}</p>
        <br/><br/>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <Button title={t('login.goToSignup')} onClick={() => signIn('keycloak', { callbackUrl: '/' })} />
      </section>
    </div>
  );
}

export const getServerSideProps = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', [
      'common',
    ])),
  },
})