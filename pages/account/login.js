import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser } from 'react-icons/fa'
import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout'
import styles from '@/styles/AuthForm.module.css'
import AuthContext from '@/context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login, error } = useContext(AuthContext)
    console.error(error);

    useEffect(() => { error && toast.error(error); }, [error]);

    const handleSubmit = (e) => {
        e.preventDefault();
        login({ email, password })
    }
    return (
        <Layout title="Вход">
            <div className={styles.auth}>
                <h1>
                    <FaUser />Войти

                </h1>
                <ToastContainer />
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Имейл</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="password">Пароль</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    </div>
                    <input type="submit" value="Войти" className='btn' />
                </form>
                <p>
                    Нет аккаунта? <Link href='/account/register'>Зарегистрироваться</Link>
                </p>
            </div>
        </Layout>
    )
}
