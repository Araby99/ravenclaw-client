import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { UserContext } from '../_app';
import Nav from '@/components/Nav';
import Head from 'next/head';
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from 'next/router';

export default () => {
    const [user, setUser] = useContext(UserContext);

    useEffect(() => {
        if (user == 0) {
            Router.push(
                {
                    pathname: '/sign-in',
                    query: { page: Router.pathname.slice(1) },
                },
                undefined,
                { shallow: true }
            );
        }
    }, [])
    const [file, setFile] = useState();
    const avatar = useRef();
    const [avatarLoading, setAvatarLoading] = useState(false)
    const [infoLoading, setInfoLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const avatarSubmit = e => {
        setAvatarLoading(true);
        e.preventDefault();
        if (file !== undefined) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "jdyonpvh");
            formData.append("cloud_name", "dtoyodnfi")
            axios.post("https://api.cloudinary.com/v1_1/dtoyodnfi/image/upload", formData).then((res) => {
                axios.put(`/users/${user._id}`, { avatar: res.data.secure_url }).then(result => {
                    setUser(result.data);
                    setAvatarLoading(false);
                    toast.success('تم تغيير الصورة بنجاح !', {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                })
            })
        }
    }
    const submitInfo = e => {
        e.preventDefault();
        setInfoLoading(true);
        const data = {
            username: e.target.username.value,
            name: e.target.name.value
        }
        axios.put(`/users/${user._id}`, data).then(result => {
            setUser(result.data);
            setInfoLoading(false);
            toast.success('تم تغيير المعلومات الشخصية بنجاح !', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        })
    }
    const changePassword = e => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordError(false)
        const data = {
            old_password: e.target.old_password.value,
            password: e.target.password.value
        }
        axios.put(`/users/${user._id}`, data).then(result => {
            setUser(result.data);
            setPasswordLoading(false);
            toast.success('تم تغيير كلمة المرور بنجاح !', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }).catch(err => {
            if (err.response) {
                if (err.response.status == 401) {
                    setPasswordError(true)
                    setPasswordLoading(false)
                }
            }
        })
    }
    const changeAvatar = e => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            const objectUrl = URL.createObjectURL(e.target.files[0])
            avatar.current.src = objectUrl
        }
    }
    return (
        <>
            <Head>
                <title>ريفنكلاو | إعدادت الحساب</title>
            </Head>
            <Nav />
            {
                user && (
                    <div className='container py-5 my-5 mx-auto lg:w-6/12'>
                        <div className="p-12">
                            <h1 className='text-3xl underline font-bold mb-10'>الصورة الشخصية</h1>
                            <form className="flex flex-col lg:flex-row items-center gap-10" onSubmit={e => avatarSubmit(e)}>
                                <img ref={avatar} className='w-20' src={user.avatar ? user.avatar : "avatar/user.png"} alt={user.name} />
                                <input type="file" accept='image/png, image/jpeg' onChange={e => changeAvatar(e)} />
                                <button type='submit' className="px-5 py-2 rounded-full bg-raven text-white px-5" disabled={avatarLoading}>
                                    {
                                        avatarLoading ? <ClipLoader
                                            color="#fff"
                                            size={20}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        /> : "تغيير الصورة"
                                    }
                                </button>
                            </form>
                        </div>
                        <hr />
                        <div className="p-12">
                            <h1 className='text-3xl underline font-bold mb-10'>معلومات شخصية</h1>
                            <form className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-0" onSubmit={e => submitInfo(e)}>
                                <div>
                                    <span>إسم المستخدم : </span>
                                    <input className='w-full' name='username' type="text" defaultValue={user.username} placeholder='إسم المستخدم' />
                                </div>
                                <div>
                                    <span>الإسم على الموقع : </span>
                                    <input className='w-full' name='name' type="text" defaultValue={user.name} placeholder='الإسم على الموقع' />
                                </div>
                                <button type='submit' className="w-6/12 py-3 mx-auto lg:w-auto lg:py-0 rounded-full bg-raven text-white lg:px-5">
                                    {
                                        infoLoading ? <ClipLoader
                                            color="#fff"
                                            size={20}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        /> : "حفظ التغييرات"
                                    }
                                </button>
                            </form>
                        </div>
                        <hr />
                        <div className="p-12">
                            <h1 className='text-3xl underline font-bold mb-10'>كلمة السر</h1>
                            <form className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-0" onSubmit={e => changePassword(e)}>
                                <div>
                                    <span>كلمة المرور القديمة : </span>
                                    <input className='w-full' name='old_password' type="password" placeholder='كلمة المرور القديمة' autoComplete='old-password' />
                                </div>
                                <div>
                                    <span>كلمة المرور الجديدة : </span>
                                    <input className='w-full' name='password' type="password" placeholder='كلمة المرور الجديدة' autoComplete='new-password' />
                                </div>
                                <button type='submit' className="w-6/12 py-3 mx-auto lg:w-auto lg:py-0 rounded-full bg-raven text-white lg:px-5">
                                    {
                                        passwordLoading ? <ClipLoader
                                            color="#fff"
                                            size={20}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        /> : "حفظ التغييرات"
                                    }
                                </button>
                            </form>
                            {
                                passwordError && <p className="mt-5 text-red-800">* كلمة السر غير صحيحة</p>
                            }
                        </div>
                    </div>
                )
            }
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="light"
            />
        </>
    )
}