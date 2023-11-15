import Head from 'next/head'
import styles from '../styles/layout.module.css'
import NavBar from './navBar'
import Footer from './footer'
import { useStateValue } from './context'
import Spinner from './spinner'
import React from 'react'

export const siteTitle = 'ComShare'

export default function Layout({ children }) {
    const { state } = useStateValue()

    return (
        <div>
            <NavBar />
            <div className={styles.container}>
                <Head>
                    <link rel="icon" href="/quokka_logo.ico" />
                    <meta
                        name="description"
                        content="This is the beginning of something bigger."
                    />
                    <meta
                        property="og:image"
                        content={`https://og-image.vercel.app/${encodeURI(
                            siteTitle
                        )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                    />
                    <meta name="og:title" content={siteTitle} />
                    <meta name="twitter:card" content="summary_large_image" />
                </Head>
                <main className={styles.content}>
                    {state.isLoading ? <Spinner /> : null}
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    )
}
