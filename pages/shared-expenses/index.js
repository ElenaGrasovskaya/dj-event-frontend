import { API_URL } from "@/config/index";
import { useState, useContext, useEffect } from "react";
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
import { BiLeftArrowAlt } from "react-icons/bi";
import Link from "next/link";
import Modal from 'react-bootstrap/Modal';
import { BiArchiveIn } from "react-icons/bi";
import { BiArchiveOut } from "react-icons/bi";

export default function Expenses({ rawSharedExpenses }) {
  
  
 const sorted = rawSharedExpenses.data.sort((a, b)=>{const dateA = new Date(a.attributes.date), dateB = new Date(b.attributes.date)
    return dateA - dateB});

  const expenses = {data:[...sorted]};
  const date = new Date();
  const dateMs = Date.parse(date);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const refreshData = () => {

    router.replace(router.asPath);
  };

  const [summ, setSumm] = useState(0);
  const [show, setShow] = useState(false);
  const [showAll, setShowAll] = useState(false);
  

  useEffect(() => {
    setSumm(
      expenses.data.reduce(
        (acc, el) => !el.attributes.hidden ?(acc + el.attributes.value):acc,
        0
      ),

    );
  }, [expenses]);

  const handleClose = () => {
    setValues({
      id:0,
      title: "",
      userName: user ? user.username : "",
      slug: `flow${dateMs}`,
      value: 0,
      hidden: false,
      date: date,
    });
    setShow(false)};
  const handleShow = () => setShow(true);


  const [values, setValues] = useState({
    title: "",
    userName: user ? user.username : "",
    slug: `flow${dateMs}`,
    value: 0,
    hidden: false,
    date: date,
    id:0,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/shared-expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: {    
        title: values.title,
        userName:  user ? user.username : "",
        slug: `flow${dateMs}`,
        value: values.value,
        hidden: false,
        date: values.date,
      } }),
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
        id:0,
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

  const handleHide = async (e, currentExpense) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await fetch(`${API_URL}/api/shared-expenses/${currentExpense.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: {...currentExpense.attributes, hidden: !currentExpense.attributes.hidden} }),
    });

    if (!res.ok) {
      toast.error("Что-то пошло не так");
    } else {
      refreshData();
      const data = await res.json();

      toast.success("В архиве");
      
    }
  };


  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await fetch(`${API_URL}/api/shared-expenses/${values.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      
    });

    if (!res.ok) {
      toast.error("Что-то пошло не так");
    } else {
      refreshData();
      const data = await res.json();

      toast.success("Удалено");
      
    }
  };

  const handleEditFlow = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/shared-expenses/${values.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: {    
      title: values.title,
      userName: values.userName,
      slug: values.slug,
      value: values.value,
      hidden: values.hidden,
      date: values.date,} }),
    });

    if (!res.ok) {
      toast.error("Something went wrong");
    } else {
      refreshData();
      const data = await res.json();

      toast.success("Deleted");
      
    }
  };

  return (
    <Layout>
        <h1>Расходы 1/2</h1>
        <Link href='/events'><a className={styles.backBtn}><BiLeftArrowAlt/></a></Link> {"   "}
         <Button onClick={() => setShowAll(!showAll)}>Показать все</Button>{" "}
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
            {expenses.data.map((expense, index) => ((!expense.attributes.hidden || showAll)&&
              <tr key={200 + index} onClick={(e)=>{setValues({...expense.attributes, id:expense.id})
                handleShow()}}>
                <td>{expense.attributes.title}</td>
                <td>{expense.attributes.value}</td>
                <td>
                  <Moment format="DD.MM.YYYY hh:mm">{expense.attributes.date}</Moment>
                </td>
                <td>{expense.attributes.hidden ? (
                        <div className={styles.checkboxGreen} onClick={(e)=>handleHide(e, expense)}>
                          <BiArchiveIn />
                        </div>
                      ) : (
                        <div className={styles.checkboxRed} onClick={(e)=>handleHide(e, expense)}>
                          <BiArchiveOut />
                        </div>
                      )}</td>
              </tr>
            ))}

            <tr className={styles.result}>
              <th width="50%"></th>
              <th width="25%">{summ.toFixed(1)}</th>
              <th width="25%"></th>
              <th></th>
            </tr>
   
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Изменить</Modal.Title>
        </Modal.Header>
        <Modal.Body><div className={styles.modal}>

        <input
                  type="text"
                  value={values.title}
                  name={"title"}
                  className={styles.flow}
                  onChange={handleInputChange}
                ></input>
                <input
                  type="number"
                  value={values.value}
                  name={"value"}
                  className={styles.flow}
                  onChange={handleInputChange}
                ></input>
                <input
                  type="date"
                  name={"date"}
                  className={styles.flow}
                  onChange={handleInputChange}
                ></input>
        </div>

       
       
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Закрыть
          </Button>
          <Button variant="danger" type="button" onClick={(e)=>{handleDelete(e);
            handleClose();}}>
            Удалить
          </Button>
          <Button variant="primary" type="submit" onClick={(e)=>{handleEditFlow(e);
            handleClose();}}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/api/shared-expenses`);
  const rawSharedExpenses = await res.json();


  return {
    props: { rawSharedExpenses },
  };
}
