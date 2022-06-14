import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import Items from "@/components/Items";
import { API_URL } from "@/config/index";
import styles from "@/styles/Form.module.css";
import { stringify } from "qs";
import { FaArrowLeft } from "react-icons/fa";
import moment from "moment";
import { BiLeftArrowAlt } from "react-icons/bi";
import Button from 'react-bootstrap/Button';

export default function EditEventsPage({ evt }) {
  const [values, setValues] = useState({
    title: evt.attributes.title,
    name: evt.attributes.name,
    slug: evt.attributes.slug,
    status: evt.attributes.status,
    orderType: evt.attributes.orderType,
    clientPrice: evt.attributes.clientPrice,
    clientPrepay: evt.attributes.clientPrepay,
    clientDept: evt.attributes.clientDept,
    expenses: evt.attributes.items.items.reduce((acc, i) => {
      return acc + Number(i.price);
    }, 0),
    expensesPersonal: evt.attributes.expensesPersonal,
    interest: evt.attributes.interest,
    items: evt.attributes.items,
    performers: evt.attributes.performers,
    venue: evt.attributes.venue,
    address: evt.attributes.address,
    date: evt.attributes.date,
    time: evt.attributes.time,
    description: evt.attributes.description,
  });

  const [imagePreview, setImagePreview] = useState(
    evt.image ? evt.image.formats.thumbnail.url : null
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    calculateExpense();

    //Validation
    /* const hasEmptyFields = Object.values(values).some((element) => element === '')
        if (hasEmptyFields) {
            toast.error('Please fill in all fields')
        }*/

    const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
      method: "PUT",
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
      if (e.nativeEvent.submitter.value === "Сохранить и выйти")
        router.push(`/events/`);
    }
  };

  const router = useRouter();
  const handleInputChange = (e) => {

    const { name, value, checked } = e.target;
    if (name === "date") {
        setValues({ ...values, [name]: new Date(value) })
    }

    else if (name === "items")
    {
        console.log("newItems", value);
        const newExpense = value.items.reduce((acc, i)=>{return acc+Number(i.price)},0)
        const newPersonalExpense = value.items.reduce((acc, i)=>{return i.status?acc+Number(i.price):acc},0)
        setValues({ ...values, expenses: newExpense, interest: values.clientPrice-newExpense, expensesPersonal:newPersonalExpense, items: value});
    }

    else if (name === "name") {
        setValues({ ...values, name: value})
    }

    else if (name === "clientPrepay") {
        setValues({ ...values, [name]: value, clientDept: values.clientPrice-value })
    }

    else if (name === "clientPrice") {
        setValues({ ...values, [name]: value, clientDept: value-values.clientPrepay,
            interest: value-values.expenses })
    }

    else if (name === "status") {
        setValues({ ...values, status: checked })
    }

    else {
        setValues({ ...values, [name]: value })

    }

}
  const calculateExpense = () => {
    const newExpense = values.items.items.reduce((acc, i) => {
      return acc + Number(i.price);
    }, 0);
    const personalExpense = values.items.items.reduce((acc, i) => {
      return i.status ? acc + Number(i.price) : acc;
    }, 0);

    setValues({
      ...values,
      expenses: newExpense,
      personalExpense: personalExpense,
      clientDept: values.clientPrice - values.clientPrepay,
      interest: values.clientPrice - newExpense,
    });
  };

  return (
    <Layout>
      <Link href="/events">
        <a className={styles.backBtn}>
          <BiLeftArrowAlt />
        </a>
      </Link>

      <div className={styles.headerContainer}>
        <h1>{values.title}</h1>
        <Button type="submit" value="Сохранить" className="btn">Сохранить</Button>
      </div>
      <ToastContainer />
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor="title">Заказ:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={values.title}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.order_type}>
            <select
              onChange={handleInputChange}
              name="orderType"
              value={values.orderType}
            >
              <option value="kitchen">Кухня</option>
              <option value="wardrobe">Шкаф</option>
              <option value="bathroom">Ванная</option>
              <option value="other">Другое</option>
            </select>

            <img src={values.image_url || "/images/sample/furniture.png"} />
            <label htmlFor="status">
              <input
                type="checkbox"
                id="status"
                name="status"
                checked={values.status}
                onChange={handleInputChange}
              />
              Закрыт
            </label>
          </div>

          <div>
            <label htmlFor="clientPrice">Цена для клиента:</label>
            <input
              type="number"
              id="clientPrice"
              name="clientPrice"
              value={values.clientPrice}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="clientPrepay">Аванс:</label>
            <input
              type="number"
              id="clientPrepay"
              name="clientPrepay"
              value={values.clientPrepay}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="clientDept">Клиент должен:</label>
            <input
              type="number"
              id="clientDept"
              name="clientDept"
              readOnly
              value={values.clientPrice - values.clientPrepay}
            />
          </div>
          <div>
            <label htmlFor="expenses">Сумма затрат:</label>
            <input
              type="number"
              id="expenses"
              name="expenses"
              readOnly
              value={values.items.items.reduce((acc, i) => {
                return acc + Number(i.price);
              }, 0)}
            />
          </div>
          <div>
            <label htmlFor="expensesPersonal">Из них личные:</label>
            <input
              type="number"
              id="expensesPersonal"
              name="expensesPersonal"
              readOnly
              value={values.items.items.reduce((acc, i) => {
                return i.status ? acc + Number(i.price) : acc;
              }, 0)}
            />
          </div>
          <div>
            <label htmlFor="interest">Прибыль:</label>
            <input
              type="number"
              id="interest"
              name="interest"
              readOnly
              value={
                values.clientPrice -
                values.items.items.reduce((acc, i) => {
                  return acc + Number(i.price);
                }, 0)
              }
            />
          </div>
        </div>
        <div>
          <label htmlFor="items">Затраты:</label>
          <Items items={values.items} callback={handleInputChange} />
        </div>

        <div className={styles.grid}>
          <div>
            <label htmlFor="performers">Сборщики</label>
            <input
              type="text"
              name="performers"
              id="performers"
              value={values.performers}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="venue">Заказчик</label>
            <input
              type="text"
              name="venue"
              id="venue"
              value={values.venue}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="address">Адрес</label>
            <input
              type="text"
              name="address"
              id="address"
              value={values.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="date">Дата</label>
            <input
              type="date"
              name="date"
              id="date"
              value={moment(values.date).format("yyyy-MM-DD")}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <label htmlFor="description">Описание</label>
          <textarea
            type="text"
            name="description"
            id="description"
            value={values.description}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div className="d-grid gap-2">
          <Button type="submit" value="Сохранить" className=" btn btn-primary">Сохранить</Button>
          <Button
            type="submit"
            value="Сохранить и выйти"
            className="btn btn-secondary"
          >Сохранить и выйти</Button>
        </div>
      </form>
    </Layout>
  );
}

export async function getServerSideProps({ params, req }) {
  const id = params.id;
  const res = await fetch(`${API_URL}/api/events`);
  const events = await res.json();
  const event = events.data.find((e) => e.attributes.slug === id);
  console.log(req.headers.cookie);

  return {
    props: {
      evt: event,
    },
  };
}
