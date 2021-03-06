import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
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
import Button from "react-bootstrap/Button";
import AuthContext from "@/context/AuthContext";
import { useContext } from "react";

export default function EditEventsPage({ evt }) {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const refreshData = () => {

    router.replace(router.asPath);
  };


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
    userName: user ? user.username : "",
    hidden: evt.attributes.hidden,
    salary: evt.attributes.salary,
    percent: 40,
    image_url: evt.attributes.image_url,
  });

  const [imagePreview, setImagePreview] = useState(
    evt.image ? evt.image.formats.thumbnail.url : null
  );
  const [showButton, setShowButton] = useState(false);

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
      refreshData();
      setShowButton(false);
      
      if (e.target.value === "?????????????????? ?? ??????????") router.push(`/events`);
    }
  };


  const handleDelete = async (e) => {
    e.preventDefault();
    


    const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      
    });

    if (!res.ok) {
      toast.error("Something went wrong");
    } else {
      const data = await res.json();
      toast.success("??????????????");
      router.push(`/events`);
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
      setValues({
        ...values,
        expenses: newExpense,
        interest: values.clientPrice - newExpense,
        expensesPersonal: newPersonalExpense,
        items: value,
        salary: newSalary.toFixed(1),
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

      setValues({
        ...values,
        [name]: value,
        clientDept: value - values.clientPrepay,
        interest: value - values.expenses,
        salary: newSalary,
      });
    } else if (name === "status") {
      setValues({ ...values, status: checked });
    } else if (name === "hidden") {
      setValues({ ...values, hidden: checked });
    } else {
      setValues({ ...values, [name]: value });
    }
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
    showButton
      ? window.confirm("?????????? ?????? ?????????????????????")
        ? router.push(`/events`)
        : null
      : router.push(`/events`);
  };

  const handleActiveButtonChange = () => {


    if (
      values.title === evt.attributes.title &&
      values.name === evt.attributes.name &&
      values.slug === evt.attributes.slug &&
      values.status === evt.attributes.status &&
      values.orderType === evt.attributes.orderType &&
      values.clientPrice === evt.attributes.clientPrice &&
      values.clientPrepay === evt.attributes.clientPrepay &&
      values.clientDept === evt.attributes.clientDept &&
      values.expenses ===
        evt.attributes.items.items.reduce((acc, i) => {
          return acc + Number(i.price);
        }, 0) &&
      values.expensesPersonal === evt.attributes.expensesPersonal &&
      values.interest === evt.attributes.interest &&
      values.items === evt.attributes.items &&
      values.performers === evt.attributes.performers &&
      values.venue === evt.attributes.venue &&
      values.address === evt.attributes.address &&
      values.date === evt.attributes.date &&
      values.time === evt.attributes.time &&
      values.description === evt.attributes.description &&
      values.hidden === evt.attributes.hidden &&
      values.status === evt.attributes.status
    ) {
      setShowButton(false);
    } else {
      setShowButton(true);
    }
  };

  useEffect(() => {
    handleActiveButtonChange();
  }, [values]);

  return (
    <Layout title="?????????????????????????? ??????????">
      <Button variant="link" onClick={handleGoBack}>
        <a className={styles.backBtn}>
          <BiLeftArrowAlt />
        </a>
      </Button>
      <div className={styles.headerContainer}>
        <h1>{values.title}</h1>
        {showButton ? (
          <Button
            type="submit"
            value="??????????????????"
            variant="primary"
            onClick={(e) => handleSubmit(e)}
            active
          >
            ??????????????????
          </Button>
        ) : (
          <Button
            type="submit"
            value="??????????????????"
            variant="primary"
            onClick={(e) => handleSubmit(e)}
            disabled
          >
            ??????????????????
          </Button>
        )}
      </div>
      <ToastContainer />
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor="title">??????????:</label>
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
              <option value="kitchen">??????????</option>
              <option value="wardrobe">????????</option>
              <option value="bathroom">????????????</option>
              <option value="other">????????????</option>
            </select>

            <img src={values.image_url || "/images/sample/furniture.png"} />
            <label htmlFor="status">
              <input
                type="checkbox"
                id="status"
                name="status"
                checked={values.status}
                onChange={(e) => {

                  handleInputChange(e);
                }}
              />
              ????????????
            </label>
            <label htmlFor="hidden">
              <input
                type="checkbox"
                id="hidden"
                name="hidden"
                checked={values.hidden}
                onChange={handleInputChange}
              />
              ??&nbsp;????????????
            </label>
          </div>

          <div>
            <label htmlFor="clientPrice">??????????????????:</label>
            <input
              type="number"
              id="clientPrice"
              name="clientPrice"
              value={values.clientPrice}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="clientDept">?????????????? ???? ????????????:</label>
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
            <label htmlFor="clientPrepay">??????????:</label>
            <input
              type="number"
              id="clientPrepay"
              name="clientPrepay"
              value={values.clientPrepay}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="expenses">?????????? ????????????:</label>
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
            <label htmlFor="expensesPersonal">???? ?????? ????????????:</label>
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
                ??????????????:
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
                ??????????????:
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
              <label htmlFor="salary">
                ????:
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
          <label htmlFor="items">??????????????:</label>
          <Items items={values.items} callback={handleInputChange} />
        </div>

        <div className={styles.grid}>
          <div>
            <label htmlFor="performers">????????????????</label>
            <input
              type="text"
              name="performers"
              id="performers"
              value={values.performers}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="venue">????????????????</label>
            <input
              type="text"
              name="venue"
              id="venue"
              value={values.venue}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="address">??????????</label>
            <input
              type="text"
              name="address"
              id="address"
              value={values.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="date">????????</label>
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
          <label htmlFor="description">????????????????</label>
          <textarea
            type="text"
            name="description"
            id="description"
            value={values.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        {showButton ? (
          <div className={styles.headerContainer}>
            <Button
              type="submit"
              value="??????????????????"
              variant="primary"
              onClick={(e) => handleSubmit(e)}
              active
            >
              ??????????????????
            </Button>
            <Button
              type="submit"
              value="?????????????????? ?? ??????????"
              variant="dark"
              onClick={(e) => handleSubmit(e)}
              active
            >
              ?????????????????? ?? ??????????
            </Button>
          </div>
        ) : (
          <div className={styles.headerContainer}>
            <Button
              type="submit"
              value="??????????????????"
              variant="primary"
              onClick={(e) => handleSubmit(e)}
              disabled
            >
              ??????????????????
            </Button>
            <Button
              type="submit"
              value="?????????????????? ?? ??????????"
              variant="dark"
              onClick={(e) => handleSubmit(e)}
              disabled
            >
              ?????????????????? ?? ??????????
            </Button>
          </div>
        )}

        <div className="d-grid gap-2">
        <Button variant="danger" onClick={(e)=>{confirm("?????????? ???????????????")?handleDelete(e):null}}>?????????????? ??????????</Button>
          
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


  return {
    props: {
      evt: event,
    },
  };
}
