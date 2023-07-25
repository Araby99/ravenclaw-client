import axios from "axios"
import { useRouter } from 'next/router'
import Head from "next/head"
import Link from "next/link"
import { useContext, useState } from "react"
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from "../_app"

export default () => {
    const [user, setUser] = useContext(UserContext);
    const [userFound, setUserFound] = useState(false);
    const [repeatPassword, setrepeatPassword] = useState(false);
    const [submit, setSubmit] = useState(false);
    const router = useRouter();
    const sign = e => {
        e.preventDefault();
        if (e.target.repeatPassword.value !== e.target.password.value) {
            setrepeatPassword(true)
        } else {
            setUserFound(false)
            setSubmit(true)
            setrepeatPassword(false)
            const data = {
                username: e.target.username.value,
                password: e.target.password.value,
                name: e.target.name.value,
            }
            axios.post("/users/", data).then(res => {
                setSubmit(false)
                setUser(res.data)
                toast.success('تم ! سيتم تحويلك الآن إلى صفحة تسجيل الدخول', {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setTimeout(() => {
                    router.push("/sign-in")
                }, 3000);
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 409) {
                        setUserFound(true)
                        setSubmit(false)
                    }
                }
            })
        }
    }
    return (
        <>
            <Head>
                <title>ريفنكلاو | إنشاء حساب</title>
            </Head>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <Link href="/">
                        <img
                            className="mx-auto w-auto"
                            src="https://e0.pxfuel.com/wallpapers/507/586/desktop-wallpaper-ravenclaw.jpg"
                            alt="Ravenclaw"
                        />
                    </Link>
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        إنشاء حساب
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={e => sign(e)} method="POST">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                اسم المستخدم
                            </label>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    name="username"
                                    type="username"
                                    autoComplete="username"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            {
                                userFound && (
                                    <p className="mt-2 text-red-600">إسم المستخدم موجود بالفعل *</p>
                                )
                            }
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                الاسم على الموقع
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    name="name"
                                    type="name"
                                    autoComplete="name"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    كلمة السر
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="repeatPassword" className="block text-sm font-medium leading-6 text-gray-900">
                                    تأكيد كلمة السر
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="repeatPassword"
                                    name="repeatPassword"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {
                                    repeatPassword && (
                                        <p className="mt-2 text-red-600">كلمة السر غير متطابقة *</p>
                                    )
                                }
                            </div>
                        </div>


                        <div>
                            <button
                                disabled={submit}
                                type="submit"
                                className="flex w-full justify-center rounded-md px-3 bg-raven py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >

                                {
                                    submit ? (
                                        <ClipLoader
                                            color="#fff"
                                            size={20}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        />
                                    ) : "إنشاء"
                                }
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        <span> تمتلك حساب ؟</span>
                        <Link href="/sign-in" className="ms-2 font-semibold leading-6 text-raven">تسجيل الدخول</Link>
                    </p>
                </div>
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
            </div>
        </>
    )
}
