import Layout from "@/components/Layout";
import { ToastContainer, toast } from "react-toastify";
import { API_URL } from "@/config/index";
import EventItem from "@/components/EventItem";
import Link from "next/link";
import Image from "next/image";
import { FaRegPlusSquare } from "react-icons/fa";
import { useContext, use } from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import LoginPage from "./account/login";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { BsFillCheckSquareFill } from "react-icons/bs";
import {BiArchiveIn} from  "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import styles from "@/styles/Home.module.css";
import { BiArchiveOut } from "react-icons/bi";

export default function HomePage({ events }) {

  
  const [summ, setSumm] = useState({
    summClientPrice: 0,
    summClientDept: 0,
    summExpenses: 0,
    summPersonalExpenses: 0,
  });

  const [show, setShow] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  console.log("events", events);

  const deleteEvent = async (e, evt) => {
    if (confirm("Are you sure?")) {
      const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.massage);
      } else {
        toast.success("Заказ удален");
        router.push("/");
      }
    }
  };

  const handleHide = async (e, evt) => {
    e.preventDefault();
    if (confirm("Архивировать заказ")) {
     
      const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: { ...evt, attributes: { ...evt.attributes, hidden: true } },
        }),
      });
      

      if (!res.ok) {
        toast.error("Something went wrong");
      } else {
        toast.success("Заказ в архиве");
        const data = await res.json();
        console.log("res", res);

      }
    }
  };

  useEffect(() => {
    setSumm({
      summClientPrice: events.data.reduce(
        (acc, el) => acc + el.attributes.clientPrice,
        0
      ),

      summClientDept: events.data.reduce(
        (acc, el) => acc + el.attributes.clientDept,
        0
      ),

      summExpenses: events.data.reduce(
        (acc, el) => acc + el.attributes.expenses,
        0
      ),

      summPersonalExpenses: events.data.reduce(
        (acc, el) => acc + el.attributes.expensesPersonal,
        0
      ),
    });
  }, [events]);

  return (
    <>
      {user && events.data ? (
        <Layout>
          <h1>Заказы</h1>

          {events.data.length === 0 && <h3>Нет подходящих заказов</h3>}
          <Button onClick={() => setShow(!show)}>Показать все</Button>

          <Table striped hover responsive="sm">
            <thead>
              <tr>
                <th></th>
                <th>Заказ</th>
                <th>Цена</th>
                <th>Остаток</th>
                <th>Затраты</th>
                <th>Личные</th>
                <th>Закрыт</th>
                <th>В архиве</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {events.data.map((evt, index) =>
                !evt.attributes.hidden || show ? (
                  <tr key={100 + index}>
                    <Link href={`/events/edit/${evt.attributes.slug}`}>
                      <td>
                        <Image
                          src={
                            evt.attributes.image_url ||
                            "/images/sample/furniture.png"
                          }
                          width={30}
                          height={30}
                        />
                      </td>
                    </Link>
                    <Link href={`/events/edit/${evt.attributes.slug}`}>
                      <td>
                        <strong className={styles.clickableLink}>
                          {evt.attributes.title}
                        </strong>
                      </td>
                    </Link>
                    <Link href={`/events/edit/${evt.attributes.slug}`}>
                      <td>{evt.attributes.clientPrice}</td>
                    </Link>
                    <Link href={`/events/edit/${evt.attributes.slug}`}>
                      <td>{evt.attributes.clientDept}</td>
                    </Link>
                    <Link href={`/events/edit/${evt.attributes.slug}`}>
                      <td>{evt.attributes.expenses}</td>
                    </Link>
                    <Link href={`/events/edit/${evt.attributes.slug}`}>
                      <td>{evt.attributes.expensesPersonal}</td>
                    </Link>
                    <td>
                      {evt.attributes.status ? (
                        <div className={styles.checkboxGreen}>
                          <BsFillCheckSquareFill />
                        </div>
                      ) : (
                        <div className={styles.checkboxRed}>
                          <BsFillQuestionSquareFill />
                        </div>
                      )}
                    </td>
                    <td>
                      {evt.attributes.hidden ? (
                        <div className={styles.checkboxGreen}>
                          <BiArchiveIn />
                        </div>
                      ) : (
                        <div className={styles.checkboxRed}>
                          <BiArchiveOut />
                        </div>
                      )}
                    </td>
                    <td>
                      <a
                        href="#"
                        className={styles.delete}
                        onClick={(e) => handleHide(e, evt)}
                      >
                        <FaTimes />
                      </a>
                    </td>
                  </tr>
                ) : (
                  <></>
                )
              )}
            </tbody>
            <thead>
              <tr>
                <td></td>
                <td></td>
                <td>
                  <strong>{summ.summClientPrice}</strong>
                </td>
                <td>
                  <strong>{summ.summClientDept}</strong>
                </td>
                <td>
                  <strong>{summ.summExpenses}</strong>
                </td>
                <td>
                  <strong>{summ.summPersonalExpenses}</strong>
                </td>
                <td></td>
                <td></td>
              </tr>
            </thead>
          </Table>
          <Link href="/events/add">
            <div className="d-grid gap-2">
              <Button variant="primary" size="lg">
                <FaRegPlusSquare />
              </Button>
            </div>
          </Link>
        </Layout>
      ) : (
        <LoginPage />
      )}
    </>
  );
}

export async function getStaticProps() {
  const res = await fetch(`${API_URL}/api/events`);
  const events = await res.json();

  return {
    props: { events },
    revalidate: 1,
  };
}
