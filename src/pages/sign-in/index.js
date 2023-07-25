import axios from "axios"
import { useRouter } from 'next/router'
import Head from "next/head"
import Link from "next/link"
import { useContext, useState } from "react"
import ClipLoader from "react-spinners/ClipLoader";
import { UserContext } from "../_app"

export default () => {
    const [user, setUser] = useContext(UserContext);
    const [userFound, setUserFound] = useState(false);
    const [password, setPassword] = useState(false);
    const [submit, setSubmit] = useState(false);
    const router = useRouter();
    console.log();
    const login = e => {
        e.preventDefault();
        setPassword(false)
        setUserFound(false)
        setSubmit(true)
        const data = {
            username: e.target.username.value,
            password: e.target.password.value
        }
        axios.post("/login", data).then(res => {
            setSubmit(false)
            setUser(res.data)
            if (router.query.page) {
                router.push(`/${router.query.page}`)
            } else {
                router.push("/")
            }
        }).catch(err => {
            if (err.response) {
                if (err.response.status == 404) {
                    setUserFound(true)
                    setSubmit(false)
                }
                if (err.response.status == 401) {
                    setPassword(true)
                    setSubmit(false)
                }
            }
        })
    }
    return (
        <>
            <Head>
                <title>ريفنكلاو | تسجيل الدخول</title>
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
                        تسجيل الدخول
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={e => login(e)} method="POST">
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
                                    <p className="mt-2 text-red-600">لم يتم العثور على إسم المستخدم *</p>
                                )
                            }
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
                                {
                                    password && (
                                        <p className="mt-2 text-red-600">كلمة السر غير صحيحة *</p>
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
                                    ) : "دخول"
                                }
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        <span>لا تمتلك حساب ؟</span>
                        <Link href="/sign-up" className="ms-2 font-semibold leading-6 text-raven">سجل الآن</Link>
                    </p>
                </div>
            </div>
        </>
    )
}
