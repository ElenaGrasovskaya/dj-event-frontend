import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link'
import Image from 'next/image'
import { FaPencilAlt, FaTimes } from 'react-icons/fa'
import Layout from '@/components/Layout'
import { API_URL } from '@/config/index'
import styles from '@/styles/Event.module.css'
import { useRouter } from 'next/router';

export default function EventPage({ evt }) {
  const router = useRouter();


  const deleteEvent = async (e) => {
    if (confirm('Are you sure?')) {
      const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
        method: 'DELETE',

      })

      const data = await res.json()
      if(!res.ok) {
        toast.error(data.massage)
      }else {
        router.push('/events')
      }
    }
  }
  return (
    <Layout><div className={styles.event}>
      <div className={styles.controls}>
        <Link href={`/events/edit/${evt.attributes.slug}`}>
          <a><FaPencilAlt />Edit Event</a>
        </Link>
        <a href='#' className={styles.delete} onClick={deleteEvent}>
          <FaTimes />Delete Event
        </a>

      </div>
      <span>
        {evt.attributes.date} at {evt.attributes.time}
      </span>
      <h1>{evt.attributes.name}</h1>
      <ToastContainer />
      {evt.attributes.image_url && (
        <div className={styles.image}>
          <Image src={API_URL + evt.attributes.image_url} width={960} height={600} />
        </div>
      )}

      <h3>Performers:</h3>
      <p>{evt.attributes.performers}</p>
      <h3>Description:</h3>
      <p>{evt.attributes.description}</p>
      <h3>Venue: {evt.attributes.address}</h3>

      <Link href='/events'>
        <a className={styles.back}>
          {'<'} Go Back
        </a>
      </Link>

    </div></Layout>

  )
}
export async function getStaticPaths() {
  const res = await fetch(`${API_URL}/api/events`);
  const events = await res.json();
  const paths = events.data.map(evt => ({
    params: { slug: evt.attributes.slug, id: evt.id }
  }))

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params: { slug, id } }) {
  const res = await fetch(`${API_URL}/api/events?slug=${slug}`)
  const events = await res.json();
  const event = events.data.find(e=>e.attributes.slug===slug)

  return {
    props: {
      evt: event,
    },
    revalidate: 1
  }
}


/*
export async function getServerSideProps({query:{slug}}) {
  const res = await fetch(`${API_URL}/api/events/${slug}`)
  const events = await res.json()


  return {
    props: {
      evt: events[0]
    }
  }
}
*/