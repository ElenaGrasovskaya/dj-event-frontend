import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {FaUser} from 'react-icons/fa';
import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import styles from '@/styles/AuthForm.module.css';
import AuthContext from '@/context/AuthContext';
import Button from 'react-bootstrap/Button';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const {register, error} = useContext(AuthContext);
    useEffect(() => {
        console.log(error);
        error && toast.error(error);
    },[]);


    const handleSubmit = () => {
        e.preventDefault();
        if(password !== passwordConfirm)
        {
            toast.error('Passwords do not match!')
            return
        }
        register({username, email, password});

    }

    return (
      <Layout title="User Registration">
          <div className={styles.auth}>
              <h1>
                <FaUser />Зарегистрироваться

              </h1>
              <ToastContainer />
              <form onSubmit={handleSubmit}>
              <div>
                      <label htmlFor="username">Имя пользователя</label>
                      <input type="text" id="username" value={username} onChange={(e)=>setUsername(e.target.value)}></input>
                  </div>
                  <div>
                      <label htmlFor="email">Имейл</label>
                      <input type="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)}></input>
                  </div>
                  <div>
                      <label htmlFor="password">Пароль</label>
                      <input type="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)}></input>
                  </div>
                  <div>
                      <label htmlFor="passwordConfirm">Подтвердить пароль</label>
                      <input type="password" id="passwordConfirm" value={passwordConfirm} onChange={(e)=>setPasswordConfirm(e.target.value)}></input>
                  </div>
                  <input type="submit" value="Зарегистрироваться" className = 'btn'/>
              </form>
              <p>
                  Уже есть аккаунт? <Link href='/account/login'>Войти</Link>
              </p>
          </div>
      </Layout>
    ) 
  }


