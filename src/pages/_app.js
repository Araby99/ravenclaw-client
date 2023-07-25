import '@/styles/globals.css'
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export default ({ Component, pageProps }) => {
    const [user, setUser] = useState(null);
    axios.defaults.baseURL = "https://ravenclaw.onrender.com";
    useEffect(() => {
        if (localStorage.getItem("user") !== 0) {
            setUser(JSON.parse(localStorage.getItem("user")))
        }
    }, [])
    useEffect(() => {
        if (user !== null) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [user])
    useEffect(() => {
        import('webfontloader').then(WebFontLoader => {
            WebFontLoader.load({
                google: {
                    families: ['Cairo']
                }
            })
        })
    }, []);
    return (
        <UserContext.Provider value={[user, setUser]}>
            <Component {...pageProps} />
        </UserContext.Provider>
    )
}
