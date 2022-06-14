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
          <a>Libra Portal</a>
        </Link>
      </div>
      {user?(<div>
        <h2>
        {user.username}
        </h2>
      </div>
):(<div></div>)}
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
