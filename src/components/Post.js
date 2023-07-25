import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

export default ({ post }) => {
    const [author, setAuthor] = useState();
    useEffect(() => {
        axios.get(`/users/${post.author}`).then(result => {
            setAuthor(result.data)
        })
    }, [])

    return (
        <div className='p-5 border rounded flex flex-col gap-5'>
            <Link href={`/posts/${post._id}`} className='text-4xl font-bold'><div dangerouslySetInnerHTML={{ __html: post.title }} /></Link>
            {
                post.cover && (
                    <div className="flex justify-center mx-auto lg:w-6/12">
                        <img src={post.cover} alt={post.title} />
                    </div>
                )
            }
            <div className='max-h-12 overflow-hidden' dangerouslySetInnerHTML={{ __html: post.description }} />
            {author && (
                <Link href={`/users/${author.username}`} className="flex items-center gap-5">
                    <img src={author.avatar ? author.avatar : "/avatar/user.png"} alt={author.name} className='rounded-full w-10 h-10 rounded' />
                    <p>{author.name}</p>
                </Link>
            )}
        </div>
    )
}