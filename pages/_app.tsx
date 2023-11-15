import '../app/styles/globals.css'
import '../app/styles/colors.css'
import { SessionProvider, useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'
import Layout from '../app/components/layout'
import { appWithTranslation } from 'next-i18next'
import { StateProvider } from '../app/components/context'
import Spinner from '../app/components/spinner'

const App = ({ Component, pageProps: { session, ...pageProps } }) => (
    <StateProvider>
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
            )}
        </SessionProvider>
    </StateProvider>
)
export default appWithTranslation(App)

function Auth({ children }) {
    // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
    const { data, status } = useSession()

    if (status === 'loading') {
        return <Spinner />
    } else if (status === 'unauthenticated' || !data) {
        window.location.href = '/login'
        return
    }

    return children
}

export async function getServerSideProps({ req, res }) {
    return {
        props: {
            session: await getServerSession(req, res, authOptions),
        },
    }
}
