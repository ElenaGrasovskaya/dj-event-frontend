import { API_URL } from "@/config/index";
import { useState, useContext } from "react";
import Layout from "@/components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CloseButton from 'react-bootstrap/CloseButton';
import styles from "@/styles/Flow.module.css";
import AuthContext from "@/context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import Moment from "react-moment";
import { useRouter } from "next/router";

export default function HomePage({ flows }) {
  const date = new Date();
  const dateMs = Date.parse(date);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const refreshData = () => {

    router.replace(router.asPath);
  };

  console.log("flows", flows);
  const [values, setValues] = useState({
    title: "",
    userName: user ? user.username : "",
    slug: `flow${dateMs}`,
    value: 0,
    hidden: false,
    date: date,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/flows`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: values }),
    });

    if (!res.ok) {
      toast.error("Something went wrong");
    } else {
      const data = await res.json();
      toast.success("Saved");
      refreshData();
      setValues({
        title: "",
        userName: user ? user.username : "",
        slug: `flow${dateMs}`,
        value: 0,
        hidden: false,
        date: date,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "date") {
      setValues({ ...values, [name]: new Date(value) });
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  return (
    <Layout>
        <h1>Авансы</h1>
      <Form>
        <Table striped hover responsive="sm">
          <thead>
            <tr>
              <th width="50%">Наименование</th>
              <th width="25%">Сумма</th>
              <th width="25%">Дата</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {flows.data.map((flow, index) => (
              <tr key={200 + index}>
                <td>{flow.attributes.title}</td>
                <td>{flow.attributes.value}</td>
                <td>
                  <Moment format="DD.MM.YYYY hh:mm">{flow.attributes.date}</Moment>
                </td>
                <td><CloseButton aria-label="Hide" /></td>
              </tr>
            ))}
            <tr>
              <th>
                <input
                  type="text"
                  value={values.title}
                  name={"title"}
                  className={styles.flow}
                  onChange={handleInputChange}
                ></input>
              </th>
              <th>
                <input
                  type="number"
                  value={values.value}
                  name={"value"}
                  className={styles.flow}
                  onChange={handleInputChange}
                ></input>
              </th>
              <th>
                <input
                  type="date"
                  name={"date"}
                  className={styles.flow}
                  onChange={handleInputChange}
                ></input>
              </th>
              <th>
                <Button
                  type="submit"
                  onClick={(e) => {
                    handleSubmit(e);
                  }}
                >
                  +
                </Button>
              </th>
            </tr>
          </tbody>
        </Table>
      </Form>
    </Layout>
  );
}

export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/api/flows`);
  const flows = await res.json();

  return {
    props: { flows },
  };
}
