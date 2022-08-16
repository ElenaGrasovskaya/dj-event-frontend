import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import Items from "@/components/Items";
import { API_URL } from "@/config/index";
import styles from "@/styles/Form.module.css";
import moment from "moment";
import { BiLeftArrowAlt } from "react-icons/bi";
import "bootstrap/dist/css/bootstrap.min.css";
import { stringify } from "qs";
import { Button } from "react-bootstrap";
import AuthContext from "@/context/AuthContext";
import { useContext } from "react";

export default function AddEventPage() {
  const date = new Date();
  const dateMs = Date.parse(date);
  const { user, logout } = useContext(AuthContext);

  const router = useRouter();

  const [values, setValues] = useState({
    name: `kitchen${dateMs}`,
    title: "",
    slug: `kitchen${dateMs}`,
    status: false,
    orderType: "kitchen",
    clientPrice: 0,
    clientPrepay: 0,
    clientDept: 0,
    expenses: 0,
    expensesPersonal: 0,
    interest: 0,
    items: { items: [{ name: "", price: 0, description: "", status: false }] },
    performers: "",
    venue: "",
    address: "",
    date: date,
    time: "",
    description: "",
    image_url: "/images/sample/kitchen.png",
    userName: user ? user.username : "",
    hidden: false,
    salary: 0,
    percent: 40,
    salaryMax: 0,
    percentMax: 60,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Validation
    /* const hasEmptyFields = Object.values(values).some((element) => element === '')
        if (hasEmptyFields) {
            toast.error('Please fill in all fields')
        }*/

    const res = await fetch(`${API_URL}/api/events`, {
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
      if (e.target.value === "Сохранить и выйти") router.push(`/events`);
      else {
        router.push(`/events/edit/${values.slug}`);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "date") {
      setValues({ ...values, [name]: new Date(value) });
    } else if (name === "items") {
      const newExpense = value.items.reduce((acc, i) => {
        return acc + Number(i.price);
      }, 0);
      const newPersonalExpense = value.items.reduce((acc, i) => {
        return i.status ? acc + Number(i.price) : acc;
      }, 0);
      const newSalary =
        (values.clientPrice -
          values.items.items.reduce((acc, i) => {
            return acc + Number(i.price);
          }, 0)) *
        (values.percent / 100);
        const newSalaryMax =
        (values.clientPrice -
          values.items.items.reduce((acc, i) => {
            return acc + Number(i.price);
          }, 0)) *
        (values.percentMax / 100);
      setValues({
        ...values,
        expenses: newExpense,
        interest: values.clientPrice - newExpense,
        expensesPersonal: newPersonalExpense,
        items: value,
        salary: newSalary,
        salaryMax: newSalaryMax,
      });
    } else if (name === "name") {
      setValues({ ...values, name: value });
    } else if (name === "clientPrepay") {
      setValues({
        ...values,
        [name]: value,
        clientDept: values.clientPrice - value,
      });
    } else if (name === "clientPrice") {
      const newSalary =
        (value -
          values.items.items.reduce((acc, i) => {
            return acc + Number(i.price);
          }, 0)) *
        (values.percent / 100);
        const newSalaryMax =
        (value -
          values.items.items.reduce((acc, i) => {
            return acc + Number(i.price);
          }, 0)) *
        (values.percentMax / 100);
      setValues({
        ...values,
        [name]: value,
        clientDept: value - values.clientPrepay,
        interest: value - values.expenses,
        salary: newSalary,
        salaryMax: newSalaryMax,
      });
    } else if (name === "status") {
      setValues({ ...values, status: checked });
    } else if (name === "hidden") {
      setValues({ ...values, hidden: checked });
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  const handleGenerateName = (e) => {
    const newDate = new Date();

    setValues({
      ...values,
      name: e.target.value + Date.parse(newDate),
      orderType: e.target.value,
      slug: e.target.value + Date.parse(newDate),
      image_url: `/images/sample/${e.target.value}.png`,
    });
  };

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
  const handleGoBack = () => {
    const result = window.confirm("Выйти без сохранения?");
    result ? router.push(`/events`) : null;
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <Layout title="Добавить новый заказ">
      <ToastContainer />
      <Button variant="link" onClick={handleGoBack}>
        <a className={styles.backBtn}>
          <BiLeftArrowAlt />
        </a>
      </Button>

      <div className={styles.headerContainer}>
        <h1>Новый заказ</h1>
        <Button
          type="submit"
          value="Сохранить"
          variant="primary"
          onClick={(e) => handleSubmit(e)}
        >
          Сохранить
        </Button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor="title">Заказ:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={values.title}
              onKeyPress={handleKeyPress}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.order_type}>
            <select onChange={handleGenerateName} name="orderType">
              <option value="kitchen">Кухня</option>
              <option value="wardrobe">Шкаф</option>
              <option value="bathroom">Ванная</option>
              <option value="other">Другое</option>
            </select>
            <img src={values.image_url} />
            <label htmlFor="status">
              <input
                type="checkbox"
                id="status"
                name="status"
                checked={values.status}
                onKeyPress={handleKeyPress}
                onChange={handleInputChange}
              />
              Закрыт
            </label>
            <label htmlFor="hidden">
              <input
                type="checkbox"
                id="hidden"
                name="hidden"
                checked={values.hidden}
                onKeyPress={handleKeyPress}
                onChange={handleInputChange}
              />
              В&nbsp;архиве
            </label>
          </div>

          <div>
            <label htmlFor="clientPrice">Стоимость:</label>
            <input
              type="number"
              id="clientPrice"
              name="clientPrice"
              value={values.clientPrice}
              onKeyPress={handleKeyPress}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="clientDept">Остаток по заказу:</label>
            <input
              type="number"
              id="clientDept"
              name="clientDept"
              readOnly
              value={values.clientPrice - values.clientPrepay}
              className={styles.inactive}
            />
          </div>
          <div>
            <label htmlFor="clientPrepay">Аванс:</label>
            <input
              type="number"
              id="clientPrepay"
              name="clientPrepay"
              value={values.clientPrepay}
              onKeyPress={handleKeyPress}
              onChange={handleInputChange}
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
              className={styles.inactive}
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
              className={styles.inactive}
            />
          </div>
          <div>
            <div className={styles.interest}>
              <label htmlFor="interest">
                Прибыль:
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
                  className={styles.inactive}
                />
              </label>
              <label htmlFor="interestPercent">
                Процент:
                <input
                  type="text"
                  id="interestPercent"
                  name="interestPercent"
                  readOnly
                  value={`${(
                    ((values.clientPrice -
                      values.items.items.reduce((acc, i) => {
                        return acc + Number(i.price);
                      }, 0)) /
                      values.clientPrice) *
                    100
                  ).toFixed(1)}%`}
                  className={styles.inactive}
                />
              </label>

              <label htmlFor="salaryMax">
                M-60%:
                <input
                  type="number"
                  id="salaryMax"
                  name="salaryMax"
                  readOnly
                  value={
                    (values.clientPrice -
                      values.items.items.reduce((acc, i) => {
                        return acc + Number(i.price);
                      }, 0)) *
                    (values.percentMax / 100)
                  }
                  className={styles.inactive}
                />
              </label>
              <label htmlFor="salary">
                C-40%:
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  readOnly
                  value={
                    (values.clientPrice -
                      values.items.items.reduce((acc, i) => {
                        return acc + Number(i.price);
                      }, 0)) *
                    (values.percent / 100)
                  }
                  className={styles.inactive}
                />
              </label>
            </div>
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
              onKeyPress={handleKeyPress}
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
              onKeyPress={handleKeyPress}
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
              onKeyPress={handleKeyPress}
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
              onKeyPress={handleKeyPress}
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
            onKeyPress={handleKeyPress}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div className={styles.headerContainer}>
          <Button
            type="submit"
            value="Сохранить"
            variant="primary"
            onClick={(e) => handleSubmit(e)}
          >
            Сохранить
          </Button>
          <Button
            type="submit"
            value="Сохранить и выйти"
            variant="dark"
            onClick={(e) => handleSubmit(e)}
          >
            Сохранить и выйти
          </Button>
        </div>
      </form>
    </Layout>
  );
}
