import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import Link from "next/link";
import Image from "next/image";
import { FaRegPlusSquare } from "react-icons/fa";
import { useContext } from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import LoginPage from "./account/login";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { BsFillCheckSquareFill } from "react-icons/bs";
import { BiArchiveIn } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import styles from "@/styles/Home.module.css";
import { BiArchiveOut } from "react-icons/bi";

export default function HomePage({ events }) {
  const [summ, setSumm] = useState({
    summClientPrice: 0,
    summClientDept: 0,
    summInterest: 0,
    summExpenses: 0,
    summPersonalExpenses: 0,
  });

  const [show, setShow] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };

  console.log("events", events);

  useEffect(() => {
    refreshData();
    setSumm({
      summClientPrice: events.data.reduce(
        (acc, el) =>
          !el.attributes.hidden || show ? acc + el.attributes.clientPrice : acc,
        0
      ),

      summClientDept: events.data.reduce(
        (acc, el) =>
          !el.attributes.hidden || show ? acc + el.attributes.clientDept : acc,
        0
      ),
      summInterest: events.data.reduce(
        (acc, el) =>
          !el.attributes.hidden && el.attributes.status
            ? acc + el.attributes.interest
            : acc,
        0
      ),

      summExpenses: events.data.reduce(
        (acc, el) =>
          !el.attributes.hidden || show ? acc + el.attributes.expenses : acc,
        0
      ),

      summPersonalExpenses: events.data.reduce(
        (acc, el) =>
          !el.attributes.hidden || show
            ? acc + el.attributes.expensesPersonal
            : acc,
        0
      ),
    });
  }, []);

  return (
    <>
      {user && events.data ? (
        <Layout>
          <h1>Заказы</h1>
          {events.data.length === 0 && <h3>Нет подходящих заказов</h3>}
          <Button onClick={() => setShow(!show)}>Показать все</Button>{" "}
          <Button variant="info" onClick={() => router.push(`/flow`)}>
            Авансы
          </Button>{" "}
          <Button variant="warning" onClick={() => router.push(`/expenses`)}>
            Расходы
          </Button>{" "}
          <Table striped hover responsive="md">
            <thead>
              <tr>
                <th></th>
                <th>Заказ</th>
                <th>Стоимость</th>
                <th>Остаток</th>
                <th>Прибыль</th>
                <th>%</th>
                <th>Затраты</th>
                <th>Личные</th>
                <th>Закрыт</th>
                <th>В архиве</th>
              </tr>
            </thead>
            <tbody>
              {events.data.map((evt, index) =>
                !evt.attributes.hidden || show ? (
                  <tr key={100 + index}>
                    <Link
                      href={`/events/edit/${evt.attributes.slug}`}
                      key={110 + index}
                    >
                      <td>
                        <Image
                          key={120 + index}
                          src={
                            evt.attributes.image_url ||
                            "/images/sample/furniture.png"
                          }
                          width={30}
                          height={30}
                        />
                      </td>
                    </Link>

                    <td>
                      <strong className={styles.clickableLink}>
                        {evt.attributes.title}
                      </strong>
                    </td>

                    <td>{evt.attributes.clientPrice}</td>

                    <td>{evt.attributes.clientDept}</td>
                    <td>{evt.attributes.interest}</td>
                    <td>{`${(
                      (evt.attributes.interest / evt.attributes.clientPrice) *
                      100
                    ).toFixed(1)}%`}</td>

                    <td>{evt.attributes.expenses}</td>

                    <td>{evt.attributes.expensesPersonal}</td>

                    <td key={180 + index}>
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
                    <td key={190 + index}>
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
                  <strong>{summ.summInterest}</strong>
                </td>
                <td></td>
                <td>
                  <strong>{summ.summExpenses}</strong>
                </td>
                <td>
                  <strong>{summ.summPersonalExpenses}</strong>
                </td>

                <td colSpan={2}>
                  {" "}
                  <Link href="/events/add">
                    <div className="d-grid gap-2">
                      <Button variant="primary" size="md">
                        <FaRegPlusSquare />
                      </Button>
                    </div>
                  </Link>
                </td>
              </tr>
            </thead>
          </Table>
        </Layout>
      ) : (
        <LoginPage />
      )}
    </>
  );
}

/*export async function getStaticProps() {
  const res = await fetch(`${API_URL}/api/events`);
  const events = await res.json();

  return {
    props: { events },
    revalidate: 1,
  };
}
*/

export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/api/events`);
  const events = await res.json();

  return {
    props: { events },
  };
}
