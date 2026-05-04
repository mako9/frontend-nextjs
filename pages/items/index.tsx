import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        redirect: {
            destination: '/my-area',
            permanent: false,
        },
    }
}

export default function ItemsIndex() {
    return null
}
