import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head';
import Nav from '@/components/Nav';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import Swal from 'sweetalert2';
import { UserContext } from '../_app';
import Link from 'next/link';

export default () => {
    const [user, setUser] = useContext(UserContext);
    const router = useRouter()
    const [post, setPost] = useState();
    const arabicDate = dates => {
        const date = new Date(dates);
        const months = ["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو",
            "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
        ];
        const days = ["اﻷحد", "اﻷثنين", "الثلاثاء", "اﻷربعاء", "الخميس", "الجمعة", "السبت"];
        return days[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ', ' + date.getFullYear();
    }
    useEffect(() => {
        if (router.query.id !== undefined) {
            axios.get(`/posts/${router.query.id}`).then(result => {
                setPost(result.data)
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 400) {
                        router.push("/404")
                    }
                }
            })
        }
    }, [router.query.id])
    if (!post) {
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
    const deletePost = id => {
        Swal.fire({
            title: 'حذف!',
            text: 'هل ترغب بحذف المقال ؟',
            icon: 'warning',
            confirmButtonText: 'حذف',
        }).then(action => {
            if (action.isConfirmed) {
                axios.delete(`/posts/${id}:${user.username}`).then(() => {
                    router.push("/posts")
                }).catch(err => {
                    if (err.response) {
                        if (err.response.status == 401) {
                            Swal.fire("لست المالك !", "لا يمكنك حذف هذا المقال لإنك لست المالك")
                        }
                    }
                })
            }
        })
    }
    const getTitle = txt => {
        const parser = new DOMParser();
        const html = parser.parseFromString(txt, 'text/html');
        return html.lastChild.textContent;
    }
    return (
        <>
            <Head>
                <title>ريفنكلاو | {getTitle(post.title)}</title>
            </Head>
            <Nav />
            <div className='border rounded lg:w-3/4 mx-auto my-10 flex flex-col gap-10 p-10'>
                <div className="flex justify-between items-center">
                    <div dangerouslySetInnerHTML={{ __html: post.title }} />
                    {
                        post.author == user.username && (
                            <div className="flex gap-5 items-center">
                                <Link href={`/posts/edit/${post._id}`}>
                                    <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                                        تعديل
                                    </button>
                                </Link>
                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => deletePost(post._id)}>
                                    حذف
                                </button>
                            </div>
                        )
                    }
                </div>
                {post.cover && (
                    <div className="flex my-10 justify-center">
                        <img src={post.cover} alt={post.title} />
                    </div>
                )}
                <div dangerouslySetInnerHTML={{ __html: post.description }} />
                <div className="flex gap-5">
                    {post.categories.map((category, index) => <Link key={index} href={`/posts/tags/${category}`}><button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded">
                        {category}
                    </button></Link>)}
                </div>
                <div className="flex gap-5 items-center">
                    <p>تم الإنشاء بتاريخ : <span className='text-gray-500'>{arabicDate(post.created_at)}</span></p>
                    <p>تم آخر تعديل بتاريخ : <span className='text-gray-500'>{arabicDate(post.updated_at)}</span></p>
                </div>
            </div>
        </>
    )
}