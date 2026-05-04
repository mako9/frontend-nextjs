import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations'
import React from 'react'

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
})

const About = () => {
    return (
        <div className="center">
            <h2>About Page</h2>
        </div>
    )
}
export default About
