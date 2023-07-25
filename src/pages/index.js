import Nav from '@/components/Nav'
import Head from 'next/head'

export default ({ user, setUser }) => {
    return (
        <>
            <Head>
                <title>ريفنكلاو | الصفحة الرئيسة</title>
            </Head>
            <Nav user={user} setUser={setUser} />
        </>
    )
}
