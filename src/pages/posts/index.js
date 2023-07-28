import Nav from '@/components/Nav'
import axios from 'axios'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Post from '@/components/Post'
import Link from 'next/link'
import ClipLoader from "react-spinners/ClipLoader";
import Search from '@/components/PostsSearch'

export default () => {
    const [posts, setPosts] = useState();
    const [filterdposts, setFilterdPosts] = useState();
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState()
    useEffect(() => {
        axios.get("/posts").then(result => {
            setPosts(result.data);
            setFilterdPosts(result.data);
        })
        axios.get("/categories").then(result => {
            setTags(result.data);
            setLoading(false)
        })
    }, [])
    console.log(tags);
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
                <div className="lg:w-3/12 mx-auto">
                    <Search posts={posts} setFilterdPosts={setFilterdPosts} />
                </div>
                <div className="flex gap-5">
                    {loading ? <div className="flex justify-center">
                        <ClipLoader
                            color="#13699c"
                            size={50}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div> : tags.map((category, index) => <Link key={index} href={`/posts/tags/${category.title}`}><button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded">
                        {category.title}
                    </button></Link>)}
                </div>
                <div className="container my-10 flex gap-10 flex-col">
                    {
                        filterdposts?.map((post, index) => <Post key={index} post={post} />)
                    }
                    {
                        loading ? <div className="flex justify-center">
                            <ClipLoader
                                color="#13699c"
                                size={50}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        </div> : !filterdposts?.length && (<h1 className='text-bold'>لا توجد مقالات</h1>)
                    }
                </div>
            </div>
        </>
    )
}