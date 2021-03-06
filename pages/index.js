import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import Link from "next/link";
import Image from "next/image";
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
import styles from "@/styles/Home.module.css";
import { BiArchiveIn } from "react-icons/bi";
import { BiArchiveOut } from "react-icons/bi";
import { FaWrench } from "react-icons/fa";

import Alert from 'react-bootstrap/Alert';

export default function HomePage(props) {
  const {events, flow, expenses} = props;


  const [summ, setSumm] = useState({
    summClientPrice: 0,
    summClientDept: 0,
    summInterest: 0,
    summSalary: 0,
    summPersonalExpenses: 0,
    summFlow: 0,
    summExpenses: 0,
  });

  const [show, setShow] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };



  useEffect(() => {
    
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

      summSalary: events.data.reduce(
        (acc, el) =>
        !el.attributes.hidden && el.attributes.status ? acc + el.attributes.salary : acc,
        0
      ),

      summPersonalExpenses: events.data.reduce(
        (acc, el) =>
          !el.attributes.hidden || show
            ? acc + el.attributes.expensesPersonal
            : acc,
        0
      ),

      summFlow: flow.data.reduce(
        (acc, el) =>
          !el.attributes.hidden
            ? acc + el.attributes.value
            : acc,
        0
      ),

      summExpenses: expenses.data.reduce(
        (acc, el) =>
          !el.attributes.hidden
            ? acc + el.attributes.value
            : acc,
        0
      ),
    });
  }, []);

  return (
    <>
      {user && events.data ? (
        <Layout>
          <h1>????????????</h1>
          {events.data.length === 0 && <h3>?????? ???????????????????? ??????????????</h3>}
          <Button onClick={() => setShow(!show)}>???????????????? ??????</Button>{" "}
          <Button variant="info" onClick={() => router.push(`/flow`)}>
            ????????????
          </Button>{" "}
          <Button variant="warning" onClick={() => router.push(`/expenses`)}>
            ??????????????
          </Button>{" "}
          <Table striped hover responsive="md" className={styles.tableCenter}>
            <thead>
              <tr>
                <th></th>
                <th>??????????</th>
                <th>??????????????????</th>
                <th>????????????</th>
                <th>??????????????</th>
                <th>??????????????</th>
                <th>%</th>
                <th>????????????????</th>
                <th>????????????</th>
                <th>????????????</th>
                <th>?? ????????????</th>
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

                    <td className={styles.kitchenName}>
                      <Link
                        href={`/events/edit/${evt.attributes.slug}`}
                        key={120 + index}
                      >
                        <strong className={styles.clickableLink} >
                          {evt.attributes.title}
                        </strong>
                      </Link>
                    </td>

                    <td>{evt.attributes.clientPrice}</td>
                    <td>{evt.attributes.clientPrepay}</td>

                    <td>{evt.attributes.clientDept}</td>
                    <td>{evt.attributes.status?evt.attributes.interest:""}</td>
                    <td>{evt.attributes.status?(evt.attributes.clientPrice?(`${(
                      (evt.attributes.interest / evt.attributes.clientPrice) *
                      100
                    ).toFixed(1)}%`):0):""}</td>

                    <td>{evt.attributes.status?evt.attributes.salary:""}</td>

                    <td>{evt.attributes.expensesPersonal}</td>

                    <td key={180 + index}>
                      {evt.attributes.status ? (
                        <div className={styles.checkboxGreen}>
                          <BsFillCheckSquareFill />
                        </div>
                      ) : (
                        <div className={styles.checkboxRed}>
                          <FaWrench/>
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
                
                </td>
                <td>
                  
                </td>
                <td>
                  <strong>{summ.summInterest.toFixed(1)}</strong>
                </td>
                <td></td>
                <td>
                  <strong>{summ.summSalary.toFixed(1)}</strong>
                </td>
                <td>
                  <strong>{summ.summPersonalExpenses.toFixed(1)}</strong>
                </td>

                <td colSpan={2}>
                  {" "}
                  <Link href="/events/add">
                    <div className="d-grid gap-2">
                      <Button variant="primary" size="md">
                        ?????????? ??????????
                      </Button>
                    </div>
                  </Link>
                </td>
              </tr>
            </thead>
          </Table>

          <Table borderless>
            <tbody>
              <tr>
              <td><Alert className={"mb-0 p-0"} variant="primary"><h4 className={"mb-0"}>????????????????:</h4></Alert></td>
              <td><Alert className={"mb-0 p-0"} variant="primary"><h4 className={"mb-0"}>{summ.summSalary.toFixed(1)}</h4></Alert></td>
            </tr>
            <tr>
              <td><Alert className={"mb-0 p-0"} variant="danger"><h4 className={"mb-0"}>????????????:</h4></Alert></td>
              <td><Alert className={"mb-0 p-0"} variant="danger"><h4 className={"mb-0"}>{summ.summPersonalExpenses.toFixed(1)}</h4></Alert></td>
            </tr>
            <tr>
              <td><Alert className={"mb-0 p-0"} variant="warning"><h4 className={"mb-0"}>??????????????:</h4></Alert></td>
              <td><Alert className={"mb-0 p-0"} variant="warning"><h4 className={"mb-0"}>{summ.summExpenses.toFixed(1)}</h4></Alert></td>
            </tr>
            <tr>
              <td><Alert className={"mb-0 p-0"} variant="info"><h4 className={"mb-0"}>????????????:</h4></Alert></td>
              <td><Alert className={"mb-0 p-0"} variant="info"><h4 className={"mb-0"}>{`-${summ.summFlow.toFixed(1)}`}</h4></Alert></td>
            </tr>
            <tr>
              <th><Alert className={"mb-0 p-0 lg"} variant="dark"><h4 className={"mb-0"}>????????????:</h4></Alert></th>
              <th><Alert className={"mb-0 p-0 lg"} variant="dark"><h4 className={"mb-0"}>{(summ.summSalary+ summ.summPersonalExpenses-summ.summFlow+summ.summExpenses).toFixed(1)}</h4></Alert></th>
            </tr>

            
            </tbody>

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


  const [res, resFlow, resExpenses] = await Promise.all([
    fetch(`${API_URL}/api/events`), 
    fetch(`${API_URL}/api/flows`),
    fetch(`${API_URL}/api/expenses`)
  ]);
  const [events, flow, expenses] = await Promise.all([
    res.json(), 
    resFlow.json(),
    resExpenses.json()
  ]);

  return {
    props: { events, flow, expenses },
  };
}
