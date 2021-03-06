import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import Link from "next/link";
import Search from "./Search";
import styles from "@/styles/Header.module.css";
import Button from 'react-bootstrap/Button';
import { FaRegPlusSquare } from "react-icons/fa";

export default function Header() {
  const { user, logout } = useContext(AuthContext);


  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <><img height="50px" src="/images/sample/logo_transparent.png"></img>{" "}
          <a className={styles.logo}>Libra Portal</a>{" "}
          {user?(<span className={styles.userName}>

        {user.username}

      </span>
):(<span></span>)}
          </>
        </Link>
      </div>
      
      <Search />

      <nav>
        <ul>
          
          {user ? (
            // If logged in
            <>

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
