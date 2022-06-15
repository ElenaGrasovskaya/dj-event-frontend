import Layout from '@/components/Layout'
import {API_URL} from '@/config/index'
import EventItem from '@/components/EventItem'
import Link from 'next/link'
import Image from "next/image";
import { FaRegPlusSquare } from "react-icons/fa";
import { useContext, use } from 'react'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AuthContext from '@/context/AuthContext'
import LoginPage from './account/login'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { BsFillCheckSquareFill } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import styles from '@/styles/Home.module.css'

export default function HomePage ({events}) {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const deleteEvent = async (e) => {
    if (confirm("Are you sure?")) {
      const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.massage);
      } else {
        
        router.push("/events");
      }
    }
  };

  const [summ, setSumm] = useState({
    summClientPrice: 0,
    summClientDept: 0,
    summExpenses: 0,
    summPersonalExpenses: 0,
  });

  console.log(events.data);

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
      {user&&events.data? (<Layout><h1>Заказы</h1>

{events.data.length === 0 && <h3>Нет подходящих заказов</h3>}

{events.data.length > 10 && (
  <Link href= '/events'>
    <a className='btn-secondary'>Показать все</a>
  </Link>
)}

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
      <th></th>
    </tr>
  </thead>
  <tbody>
  {events.data.map((evt, index) =>
   ( <tr key={100+index}>
    <td><Image
            src={evt.attributes.image_url || "/images/sample/furniture.png"}
            width={30}
            height={30}
          /></td>
    <td><Link href={`/events/edit/${evt.attributes.slug}`}><strong className ={styles.clickableLink}>{evt.attributes.title}</strong></Link></td>
    <td>{evt.attributes.clientPrice}</td>
    <td>{evt.attributes.clientDept}</td>
    <td>{evt.attributes.expenses}</td>
    <td>{evt.attributes.expensesPersonal}</td>
    <td>{evt.attributes.status?(<div className={styles.checkboxGreen}><BsFillCheckSquareFill/></div>):(<div className={styles.checkboxRed}><BsFillQuestionSquareFill/></div>)}</td>
    <td><a href="#" className={styles.delete} onClick={deleteEvent}>
            <FaTimes />
          </a></td>
  </tr>))}
 
  </tbody>
  <thead>
    <tr>
      <td></td>
      <td></td>
      <td><strong>{summ.summClientPrice}</strong></td>
      <td><strong>{summ.summClientDept}</strong></td>
      <td><strong>{summ.summExpenses}</strong></td>
      <td><strong>{summ.summPersonalExpenses}</strong></td>
      <td></td>
      <td></td>
    </tr>
    </thead>
 
   
</Table>
<Link href="/events/add"><div className="d-grid gap-2"><Button variant="primary" size="lg"><FaRegPlusSquare/></Button></div></Link>
</Layout>):(<LoginPage/>)

      }

    </>
  )
}

export async function getStaticProps () {
  const res = await fetch(`${API_URL}/api/events`)
  const events = await res.json();

  return {
    props: { events },
    revalidate: 1
  }
} 
 