import '../app/styles/globals.css'
import '../app/styles/colors.css'
import { SessionProvider, useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'
import Layout from '../app/components/layout'
import { appWithTranslation } from 'next-i18next/pages'
import { StateProvider } from '../app/components/context'
import Spinner from '../app/components/spinner'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

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
    const { data, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated' || (status !== 'loading' && !data)) {
            router.replace('/login')
        }
    }, [status, data, router])

    if (status === 'loading' || !data) {
        return <Spinner />
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
