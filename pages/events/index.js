import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import Layout from '@/components/Layout'
import {API_URL} from '@/config/index'
import EventItem from '@/components/EventItem'
import Link from 'next/link'
import { FaRegPlusSquare } from "react-icons/fa"

export default function EventsPage({events}) {
  return (
    <Layout>
      <h1>Заказы</h1>

      {events.length === 0 && <h3>No events to show</h3>}
      {events.data.map((evt) => (<EventItem key={evt.id} evt={{...evt.attributes, id:evt.id }}/>))}
      <Link href="/events/add"><div className={styles.btnadd}><FaRegPlusSquare/></div></Link>
      
    </Layout>
  )
}


export async function getStaticProps () {
  const res = await fetch(`${API_URL}/api/events`)
  const events = await res.json()

  return {
    props: { events },
    revalidate: 1
  }
}
 