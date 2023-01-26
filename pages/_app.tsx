import '../app/styles/globals.css';
import { SessionProvider, useSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from './api/auth/[...nextauth]';
import Layout from '../app/components/layout';
import { appWithTranslation } from 'next-i18next';

const App = ({
    Component,
    pageProps: { session, ...pageProps },
  }) => (
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Auth>
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )
      }
    </SessionProvider>
  );
  export default appWithTranslation(App);

  function Auth({ children }) {
    // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
    const { data, status } = useSession()
  
    if (status === "loading") {
      return <div>Loading...</div>
    } else  if (status === "unauthenticated" || !data) {
      window.location.href = '/login';
      return;
    }
  
    return children
  }

  export async function getServerSideProps({ req, res }) {
    return {
      props: {
        session: await unstable_getServerSession(req, res, authOptions),
      }
    }
  }