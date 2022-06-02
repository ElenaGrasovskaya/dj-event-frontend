import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import styles from '@/styles/Form.module.css';
import { stringify } from 'qs';
import moment from 'moment';


export default function EditEventsPage({evt}) {
    console.log("evt", evt);

    const [values, setValues] = useState({
        name: evt.attributes.name,
        slug: evt.attributes.slug,
        performers: evt.attributes.performers,
        venue: evt.attributes.venue,
        address: evt.attributes.address,
        date: evt.attributes.date,
        time: evt.attributes.time,
        description: evt.attributes.description,
    });
    const [imagePreview, setImagePreview] = useState(evt.image ? evt.image.formats.thumbnail.url : null)
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("values", values);

        //Validation 
        const hasEmptyFields = Object.values(values).some((element) => element === '')
        if (hasEmptyFields) {
            toast.error('Please fill in all fields')
        }
 

        const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: values }),
        })

        if (!res.ok) {
            toast.error('Something went wrong')
        } else {
            const data = await res.json()
            router.push(`/events/${evt.attributes.slug}`)
        }
    }

    const router = useRouter();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "date") {
            alert(value);
            setValues({ ...values, [name]: new Date(value) })
            console.log(values);
        }
        else if (name === "name") {
            setValues({ ...values, name: value})
        }
        else {
            setValues({ ...values, [name]: value })

        }

    }
    return (
        <Layout title='Add New Event'>
            <Link href='/events'>Go Back</Link>

            <h1>Edit Event</h1>
            <ToastContainer />
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.grid}>
                    <div>
                        <label htmlFor='name'>Event Name</label>
                        <input type='text' id='name' name='name'
                            value={values.name} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor='performers'>Performers</label>
                        <input
                            type='text'
                            name='performers'
                            id='performers'
                            value={values.performers}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='venue'>Venue</label>
                        <input
                            type='text'
                            name='venue'
                            id='venue'
                            value={values.venue}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='address'>Address</label>
                        <input
                            type='text'
                            name='address'
                            id='address'
                            value={values.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='date'>Date</label>
                        <input
                            type='date'
                            name='date'
                            id='date'
                            value={moment(values.date).format('yyyy-MM-DD')}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='time'>Time</label>
                        <input
                            type='text'
                            name='time'
                            id='time'
                            value={values.time}
                            onChange={handleInputChange}
                        />
                    </div>


                </div>
                <div>
                    <label htmlFor='description'>Event Description</label>
                    <textarea
                        type='text'
                        name='description'
                        id='description'
                        value={values.description}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                <input type='submit' value='Update Event' className='btn' />
            </form>
        </Layout>
    )

}

export async function getServerSideProps({params, req}) {
    const id = params.id;
    const res = await fetch(`${API_URL}/api/events`)
    const events = await res.json();
    const event = events.data.find(e=>e.attributes.slug===id)
    console.log(req.headers.cookie);
    
    return {
      props: {
        evt: event,
      },
    }
  }