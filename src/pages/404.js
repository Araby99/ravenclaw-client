import Nav from "@/components/Nav"
import Head from "next/head"
import Link from "next/link"

export default () => {
    return (
        <>
            <Head>
                <title>ريفنكلاو | الصفحة غير موجودة</title>
            </Head>
            <div className="h-screen">
                <Nav />
                <div className="h-full flex justify-center items-center">
                    <p className="text-3xl font-medium">هل تهت ! يمكنك العودة إلى <Link className="underline text-raven font-bold" href={"/"}>الصفحة الرئيسة</Link></p>
                </div>
            </div>
        </>
    )
}