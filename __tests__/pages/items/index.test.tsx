import { getServerSideProps } from '../../../pages/items/index'

describe('Items index page — getServerSideProps', () => {
    test('redirects to /my-area', async () => {
        const result = await getServerSideProps({} as any)
        expect(result).toEqual({
            redirect: {
                destination: '/my-area',
                permanent: false,
            },
        })
    })
})
