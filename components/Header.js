import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import Link from "next/link";
import Search from "./Search";
import styles from "@/styles/Header.module.css";

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
          <li>
            <Link href="/events">
              <a>Заказы</a>
            </Link>
          </li>
          {user ? (
            // If logged in
            <>

              <li>
                <Link href="/events/add">
                  <a>Новый Заказ</a>
                </Link>
              </li>
              <li>
                <Link href="/account/dashboard">
                  <a>Рассчеты</a>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => logout()}
                  className="btn-secondary btn-icon"
                >
                  <FaSignOutAlt /> Выйти
                </button>
              </li>
            </>
          ) : (
            // If logged out
            <>
              <li>
                <Link href="/account/login">
                  <a className="btn-secondary btn-icon">
                    <FaSignInAlt /> Войти
                  </a>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
