import { createContext, useState, useEffect } from "react";
import { router, useRouter } from "next/router";
import { NEXT_URL } from "../config/index";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {checkUserLoggedIn();}, [])

    //Register

    const register = async (user) => {
        const res = await fetch(`${NEXT_URL}/api/register`, {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        })
    
        const data = await res.json()
    
        if (res.ok) {
          setUser(data.user)
          router.push('/events')
        } else {
          setError(data.message)
          setError(null)
        }
      }
    //Login  

    const login = async ({ email: identifier, password }) => {
        const res = await fetch(`${NEXT_URL}/api/login`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identifier,
                password,
            }),
        })
        const data = await res.json()
        console.log(data)
        if (res.ok) {
            setUser(data.user)
            router.push('/events')
        }
        else {
            setError(data.message);
            setError(null);
        }
    }

    //Logout
    const logout = async () => {
       const res = await fetch(`${NEXT_URL}/api/logout`,{ 
           method: 'POST'
        })
        if(res.ok) {
            setUser(null);
            router.push('/');
        }
    }


    // Check if user is logged in
    const checkUserLoggedIn = async (user) => {
        const res = await fetch(`${NEXT_URL}/api/user`)
        const data  = await res.json()

        if(res.ok) {
            setUser(data.user)
        } else {
            setUser(null)
        }
    }


    return (
        <AuthContext.Provider value={{ user, error, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext