import Nav from "@/components/Nav";
import QuillNoSSRWrapper from "@/components/Quill";
import { UserContext } from "@/pages/_app";
import axios from "axios";
import Head from "next/head"
import Router, { useRouter } from "next/router";
import { useContext, useEffect, useState, useRef } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Creatable from 'react-select/creatable';

export default () => {
    const [user, setUser] = useContext(UserContext);
    const router = useRouter()
    const [post, setPost] = useState();
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [file, setFile] = useState();
    const [options, setOptions] = useState([]);
    const [tags, setTags] = useState();
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
    useEffect(() => {
        if (router.query.id !== undefined) {
            axios.get(`/posts/${router.query.id}`).then(result => {
                setPost(result.data)
                setTitle(result.data.title)
                setDescription(result.data.description)
                setFile(result.data.cover)
                let tags = [];
                for (let i = 0; i < result.data.categories.length; i++) {
                    const obj = { label: result.data.categories[i], value: result.data.categories[i] }
                    tags.push(obj);
                }
                setTags(tags)
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
                if (user && user.username !== result.data.author) {
                    Router.push("/posts")
                }
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 400) {
                        router.push("/404")
                    }
                }
            })
        }
    }, [router.query.id])
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
    const avatar = useRef();
    const changeAvatar = e => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            const objectUrl = URL.createObjectURL(e.target.files[0])
            avatar.current.src = objectUrl
        }
    }

    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [editLoading, setEditLoading] = useState(false)
    const edit = () => {
        let categories = [];
        for (let i = 0; i < tags.length; i++) categories.push(tags[i].value);
        setEditLoading(true)
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
        if (file !== post.cover) {
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
                axios.put(`/posts/${post._id}`, data).then(result => {
                    setEditLoading(false)
                    toast.success('تم تعديل المقال بنجاح !', {
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
            axios.put(`/posts/${post._id}`, data).then(result => {
                setEditLoading(false)
                toast.success('تم تعديل المقال بنجاح !', {
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
    const getTitle = txt => {
        const parser = new DOMParser();
        const html = parser.parseFromString(txt, 'text/html');
        return html.lastChild.textContent;
    }
    if (!post) {
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
                <title>ريفنكلاو | {getTitle(post.title)}</title>
            </Head>
            <Nav />
            <div className="container w-11/12 mx-auto my-10 lg:w-3/4">
                <h1 className="text-4xl font-bold underline mb-5">العنوان :</h1>
                <QuillNoSSRWrapper modules={modules} className="editor" theme="snow" value={title} onChange={setTitle} />
                {titleError && <p className="mt-2 text-red-600">لا يمكن أن يكون العنوان فارغاً *</p>}
                <h1 className="text-4xl font-bold underline mt-10 mb-5">المحتوى :</h1>
                <QuillNoSSRWrapper modules={modules} className="description editor" theme="snow" value={description} onChange={setDescription} />
                {descriptionError && <p className="mt-2 text-red-600">لا يمكن أن يكون المحتوى فارغاً *</p>}
                <div className="flex justify-center mt-10 items-center gap-5">
                    <img ref={avatar} className='w-20' alt="cover" src={post.cover} />
                    <input type="file" accept='image/png, image/jpeg' onChange={e => changeAvatar(e)} />
                </div>
                <div className="mt-10">
                    <p className="text-4xl mb-3">العلامات</p>
                    <Creatable placeholder="ابحث..." isMulti isSearchable isRtl isClearable options={options} defaultValue={tags} onChange={setTags} />
                </div>
                <div className="flex justify-center mt-10">
                    <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded" onClick={() => edit()}>
                        {editLoading ? <ClipLoader
                            color="#fff"
                            size={20}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        /> : "تعديل"}
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