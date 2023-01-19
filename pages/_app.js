import '../app/styles/globals.css';
import { SessionProvider, unstable_getServerSession, useSession } from "next-auth/react"
import { authOptions } from './api/auth/[...nextauth]'

export default function App({
    Component,
    pageProps: { session, ...pageProps },
  }) {
    return (
      <SessionProvider session={session}>
       {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )
        }
      </SessionProvider>
    )
  }

  function Auth({ children }) {
    // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
    const { data, status } = useSession()
    console.log(status);
  
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
        session: await unstable_getServerSession(req, res, authOptions)
      }
    }
  }