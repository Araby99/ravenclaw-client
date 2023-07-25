import Nav from '@/components/Nav'
import axios from 'axios'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Post from '@/components/Post'
import Link from 'next/link'

export default () => {
    const [posts, setPosts] = useState();
    useEffect(() => {
        axios.get("/posts").then(result => {
            setPosts(result.data);
        })
    }, [])
    return (
        <>
            <Head>
                <title>ريفنكلاو | المقالات</title>
            </Head>
            <Nav></Nav>
            <div className="container lg:w-3/4 p-10 m-auto">
                <div className="flex justify-between items-center">
                    <h1 className='text-4xl font-bold underline'>المقالات</h1>
                    <Link href={"/posts/create"}>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            <span>أضف مقال</span>
                        </button>
                    </Link>
                </div>
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