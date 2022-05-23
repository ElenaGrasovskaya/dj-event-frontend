import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import Layout from '@/components/Layout'
import {API_URL} from '@/config/index'
import EventItem from '@/components/EventItem'
import Link from 'next/link'

export default function HomePage ({events}) {


  return (
    <Layout>
      <h1>Upcoming Events</h1>

      {events.data.length === 0 && <h3>No events to show</h3>}
      {events.data.map((evt) => (<EventItem key={evt.id} evt={evt.attributes}/>))}
      {events.data.length > 0 && (
        <Link href= '/events'>
          <a className='btn-secondary'>View All Events</a>
        </Link>
      )}
      
    </Layout>
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
 