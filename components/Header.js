import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import Link from "next/link";
import Search from "./Search";
import styles from "@/styles/Header.module.css";
import Button from 'react-bootstrap/Button';
import Backup from "./Backup";
import Image from "next/image"


export default function Header( backup ) {
  const { user, logout } = useContext(AuthContext);


  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <a href="/events/"><Image className={styles.logoImage} height="30px" width="30px" src="/images/sample/logo_transparent.png"></Image></a><a className={styles.logo} href="/events/" >Libra Portal</a>{" "}
        
          {user?(<span className={styles.userName}>

        {user.username}
       

      </span>
):(<span></span>)}

      </div>
      
      <Search />

      <nav>
        <ul>
          
          {user ? (
            // If logged in
            <>
            <li>
            <Backup data = {backup} />
            </li>

              <li>
                <Link href="/events/add">
                <Button variant="outline-primary">Новый заказ</Button>
                </Link>
              </li>
              
              <li>
                <Button
                  onClick={() => logout()}
                  variant="outline-secondary"
                >
                  <FaSignOutAlt /> Выйти
                </Button>
              </li>
            </>
          ) : (
            // If logged out
            <>
              <li>
                <Link href="/account/login">
                  <Button variant="outline-secondary">
                    <FaSignInAlt /> Войти
                  </Button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
