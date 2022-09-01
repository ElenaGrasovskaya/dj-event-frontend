import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import LoginPage from "../account/login";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { BsFillCheckSquareFill } from "react-icons/bs";
import styles from "@/styles/Home.module.css";
import { BiArchiveIn } from "react-icons/bi";
import { BiArchiveOut } from "react-icons/bi";
import { FaWrench } from "react-icons/fa";

import Alert from "react-bootstrap/Alert";
import Header from "@/components/Header";

export default function BackupsPage(props) {
  const { events, flow, expenses, backups } = props;
  const { user, logout } = useContext(AuthContext);
  console.log(props);

  return (
    <>
      <Header />
      {user && backups ? (
        <Table striped hover responsive="md" className={styles.tableCenter}>
          <tbody>
            {backups.data.map((element, index) => (
              <tr key ={index +160}>
                <td key ={index +170}>{index + 1}</td>
                <td key ={index +180}>
                 
                    <Link
                      href={`/backups/view/${element.attributes.slug}`}
                      key={index + 150}
                    >
                      <strong key ={index +190} className={styles.clickableLink}>
                        {element.attributes.date}
                      </strong>
                    </Link>

                </td>

                <td>
                  <Button variant="danger" key ={index +200}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <></>
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
  const [res, resFlow, resExpenses, resBackups] = await Promise.all([
    fetch(`${API_URL}/api/events`),
    fetch(`${API_URL}/api/flows`),
    fetch(`${API_URL}/api/expenses`),
    fetch(`${API_URL}/api/backups`),
  ]);
  const [events, flow, expenses, backups] = await Promise.all([
    res.json(),
    resFlow.json(),
    resExpenses.json(),
    resBackups.json(),
  ]);

  return {
    props: { events, flow, expenses, backups },
  };
}

/*{evt.attributes.status?(evt.attributes.clientPrice?(`${(
                      (evt.attributes.interest / evt.attributes.clientPrice) *
                      100
                    ).toFixed(1)}%`):0):""} */
