import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import Items from '@/components/Items'
import { API_URL } from '@/config/index'
import styles from '@/styles/Form.module.css'
import moment from 'moment';
import { BiLeftArrowAlt } from "react-icons/bi";

import { stringify } from 'qs';


export default function AddEventPage() {
    const date = new Date();
    const dateMs = Date.parse(date);

    const router = useRouter();

    const [values, setValues] = useState({
        name: `kitchen${dateMs}`,
        title:'',
        slug: `kitchen${dateMs}`,
        status: false,
        orderType: "kitchen",
        clientPrice: 0,
        clientPrepay: 0,
        clientDept: 0,
        expenses: 0,
        expensesPersonal: 0,
        interest: 0,
        items: {items:[{name:"", price:0, description:"", status:false}]},
        performers: '',
        venue: '',
        address: '',
        date: date,
        time: '',
        description: '',
        image_url: '/images/sample/kitchen.png'
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("button", e.nativeEvent.submitter.value)
        console.log("values", values);

        //Validation 
       /* const hasEmptyFields = Object.values(values).some((element) => element === '')
        if (hasEmptyFields) {
            toast.error('Please fill in all fields')
        }*/
 

        const res = await fetch(`${API_URL}/api/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: values }),
        })

        if (!res.ok) {
            toast.error('Something went wrong')
        } else {
            const data = await res.json()
            if (e.nativeEvent.submitter.value === "Сохранить и выйти")
            router.push(`/events/`);
        }
    }

    const handleInputChange = (e) => {

        const { name, value, checked } = e.target;
        if (name === "date") {
            setValues({ ...values, [name]: new Date(value) })
        }

        else if (name === "items")
        {
            console.log("newItems", value);
            const newExpense = value.items.reduce((acc, i)=>{return acc+Number(i.price)},0)
            setValues({ ...values, expenses: newExpense, interest: values.clientPrice-newExpense, items: value});
        }

        else if (name === "name") {
            setValues({ ...values, name: value})
        }

        else if (name=== "status") {
            setValues({ ...values, status: checked })
        }
   
        else {
            setValues({ ...values, [name]: value })

        }

    }

    const handleGenerateName= (e) => {
        const newDate = new Date();
        
        setValues({ ...values, name: e.target.value + Date.parse(newDate), orderType:e.target.value, slug:e.target.value + Date.parse(newDate), image_url:`/images/sample/${e.target.value}.png`})
    }


    const calculateExpense = () => {
       const newExpense = values.items.items.reduce((acc, i)=>{return acc+Number(i.price)},0)
       const personalExpense = values.items.items.reduce((acc, i)=>{return i.status?acc+Number(i.price):acc},0)

       setValues({ ...values, expenses: newExpense, personalExpense:personalExpense, clientDept: values.clientPrice-values.clientPrepay,
         interest: values.clientPrice-newExpense });
    }

    return (
        <Layout title='Добавить новый заказ'>
            <Link href='/events'><a className={styles.backBtn}><BiLeftArrowAlt/></a></Link>

            <div className={styles.headerContainer}><h1>Новый заказ</h1><input type='submit' value='Сохранить' className='btn'/></div>
           
            <ToastContainer />
            
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.grid}>
                    <div>
                        <label htmlFor='title'>Заказ:</label>
                        <input type='text' id='title' name='title'
                            value={values.title} onChange={handleInputChange} />
                        
                    </div>
                                                                       
                     <div className={styles.order_type}>

                     <select onChange={handleGenerateName} name = "orderType">
                        <option value="kitchen">Кухня</option>
                        <option value="wardrobe">Шкаф</option>
                        <option value="bathroom">Ванная</option>
                        <option value="other">Другое</option>
                    </select>
                    <img src={values.image_url}/>
                    <label htmlFor='status'><input type='checkbox' id='status' name='status'
                            checked={values.status} onChange={handleInputChange} />Закрыт
                        </label>
                          
                         
                                        
                    </div>

                    <div>
                        <label htmlFor='clientPrice'>Цена для клиента:</label>
                        <input type='number' id='clientPrice' name='clientPrice'
                            value={values.clientPrice} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor='clientPrepay'>Аванс:</label>
                        <input type='number' id='clientPrepay' name='clientPrepay'
                            value={values.clientPrepay} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor='clientDept'>Клиент должен:</label>
                        <input type='number' id='clientDept' name='clientDept'
                            value={values.clientPrice-values.clientPrepay}/>
                    </div>
                    <div>
                        <label htmlFor='expenses'>Сумма затрат:</label>
                        <input type='number' id='expenses' name='expenses' readOnly
                            value={values.items.items.reduce((acc, i)=>{return acc+Number(i.price)},0)} />
                    </div>
                    <div>
                        <label htmlFor='expensesPersonal'>Из них личные:</label>
                        <input type='number' id='expensesPersonal' name='expensesPersonal' readOnly
                            value={values.items.items.reduce((acc, i)=>{return i.status?acc+Number(i.price):acc},0)} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor='interest'>Прибыль:</label>
                        <input type='number' id='interest' name='interest'
                            value={values.clientPrice-values.items.items.reduce((acc, i)=>{return acc+Number(i.price)},0)} />
                    </div>
                </div>
                    <div>
                        <label htmlFor='items'>Затраты:</label>
                        <Items items = {values.items} callback={handleInputChange}/>
                        </div>
                      
                <div className={styles.grid}>   
                    <div>
                        <label htmlFor='performers'>Сборщики</label>
                        <input
                            type='text'
                            name='performers'
                            id='performers'
                            value={values.performers}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='venue'>Заказчик</label>
                        <input
                            type='text'
                            name='venue'
                            id='venue'
                            value={values.venue}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='address'>Адрес</label>
                        <input
                            type='text'
                            name='address'
                            id='address'
                            value={values.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='date'>Дата</label>
                        <input
                            type='date'
                            name='date'
                            id='date'
                            value={moment(values.date).format('yyyy-MM-DD')}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor='description'>Описание</label>
                    <textarea
                        type='text'
                        name='description'
                        id='description'
                        value={values.description}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                <div className={styles.headerContainer}><input type='submit' value='Сохранить' className='btn'/><input type='submit' value='Сохранить и выйти' className='btn-secondary'/></div>
            </form>
        </Layout>
    )

}
