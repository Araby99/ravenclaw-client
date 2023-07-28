import Nav from "@/components/Nav";
import QuillNoSSRWrapper from "@/components/Quill";
import { UserContext } from "@/pages/_app"
import axios from "axios";
import Head from "next/head"
import Router from "next/router";
import { useContext, useEffect, useRef, useState } from "react"
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from "react-spinners/ClipLoader";
import Creatable from 'react-select/creatable';

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
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquotes"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" }
            ]
        ]
    }
    const [file, setFile] = useState();
    const avatar = useRef();
    const changeAvatar = e => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            const objectUrl = URL.createObjectURL(e.target.files[0])
            avatar.current.src = objectUrl
        }
    }
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [tags, setTags] = useState();
    const [options, setOptions] = useState([]);
    useEffect(() => {
        axios.get("/categories").then(result => {
            let options = [];
            for (let i = 0; i < result.data.length; i++) {
                const obj = { label: result.data[i].title, value: result.data[i].title };
                options.push(obj);
            }
            setOptions(options)
        })
    }, [])

    const create = () => {
        let categories = [];
        if (tags) {
            for (let i = 0; i < tags.length; i++) categories.push(tags[i].value);
        }
        setCreateLoading(true)
        setTitleError(false)
        setDescriptionError(false)
        if (title == "") {
            setTitleError(true)
            return;
        }
        if (description == "") {
            setDescriptionError(true)
            return;
        }
        if (file !== undefined) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "qko2aqem");
            formData.append("cloud_name", "dtoyodnfi")
            axios.post("https://api.cloudinary.com/v1_1/dtoyodnfi/image/upload", formData).then((res) => {
                const data = {
                    title,
                    description,
                    author: user.username,
                    cover: res.data.secure_url,
                    categories
                }
                axios.post("/posts", data).then(result => {
                    setCreateLoading(false)
                    toast.success('تم إنشاء المقال بنجاح !', {
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
                        Router.push(`/posts/${result.data._id}`)
                    }, 3000);
                })
            })
        } else {
            const data = {
                title,
                description,
                author: user.username,
                categories
            }
            axios.post("/posts", data).then(result => {
                setCreateLoading(false)
                toast.success('تم إنشاء المقال بنجاح !', {
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
                    Router.push(`/posts/${result.data._id}`)
                }, 3000);
            })
        }
    }
    return (
        <>
            <Head>
                <title>ريفنكلاو | إنشاء مقال</title>
            </Head>
            <Nav />
            <div className="container w-11/12 mx-auto my-10 lg:w-3/4">
                <h1 className="text-4xl font-bold underline mb-5">العنوان :</h1>
                <QuillNoSSRWrapper modules={modules} className="editor" theme="snow" value={title} onChange={setTitle} />
                {titleError && <p className="mt-2 text-red-600">لا يمكن أن يكون العنوان فارغاً *</p>}
                <h1 className="text-4xl font-bold underline mt-10 mb-5">المحتوى :</h1>
                <QuillNoSSRWrapper modules={modules} className="description editor" theme="snow" value={description} onChange={setDescription} />
                {descriptionError && <p className="mt-2 text-red-600">لا يمكن أن يكون المحتوى فارغاً *</p>}
                <div className="flex justify-center mt-10">
                    <img ref={avatar} className='w-20' alt="cover" />
                    <input type="file" accept='image/png, image/jpeg' onChange={e => changeAvatar(e)} />
                </div>
                <div className="mt-10">
                    <p className="text-4xl mb-3">العلامات</p>
                    <Creatable placeholder="ابحث..." isMulti isSearchable isRtl isClearable options={options} defaultValue={tags} onChange={setTags} />
                </div>
                <div className="flex justify-center mt-10">
                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => create()}>
                        {createLoading ? <ClipLoader
                            color="#fff"
                            size={20}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        /> : "إنشاء"}
                    </button>
                </div>
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
        </>
    )
}