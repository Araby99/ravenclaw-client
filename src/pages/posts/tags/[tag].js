import Nav from "@/components/Nav";
import Post from "@/components/Post";
import axios from "axios";
import Head from "next/head"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

export default () => {
    const router = useRouter();
    const [posts, setPosts] = useState()
    useEffect(() => {
        if (router.query.tag !== undefined) {
            axios.get(`/posts/tags/${router.query.tag}`).then(result => {
                setPosts(result.data)
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 400) {
                        router.push("/404")
                    }
                }
            })
        }
    }, [router.query.tag])
    if (!posts) {
        return (
            <>
                <Head>
                    <title>ريفنكلاو</title>
                </Head>
                <Nav />
                <div className='flex justify-center items-center h-screen'>
                    <ClipLoader
                        color="#13699c"
                        size={50}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            </>
        )
    }
    return (
        <>
            <Head>
                <title>ريفنكلاو | {router.query.tag}</title>
            </Head>
            <Nav />
            <div className="container lg:w-3/4 p-10 m-auto flex gap-10 flex-col">
                {posts.map((post, index) => <Post key={index} post={post} />)}
            </div>
        </>
    )
}