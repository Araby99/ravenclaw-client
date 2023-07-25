import Nav from '@/components/Nav'
import Post from '@/components/Post';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners';


export default () => {
    const router = useRouter();
    const [posts, setPosts] = useState()
    useEffect(() => {
        if (router.query.username !== undefined) {
            axios.get(`/posts/user/${router.query.username}`).then(result => {
                setPosts(result.data)
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 404) {
                        router.push("/404")
                    }
                }
            })
        }
    }, [router.query.username])
    if (!posts) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Head>
                    <title>ريفنكلاو</title>
                </Head>
                <ClipLoader
                    color="#13699c"
                    size={50}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        )
    }
    return (
        <>
            <Head>
                <title>ريفنكلاو | {router.query.username}</title>
            </Head>
            <Nav />
            <div className="container lg:w-3/4 p-10 m-auto">
                <div className="container my-10 flex gap-10 flex-col">
                    {
                        posts?.map((post, index) => <Post key={index} post={post} />)
                    }
                    {
                        !posts?.length && (<h1 className='text-bold'>لا توجد مقالات</h1>)
                    }
                </div>
            </div>
        </>
    )
}