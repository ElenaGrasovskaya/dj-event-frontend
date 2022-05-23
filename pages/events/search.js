import qs from 'qs'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import {useRouter} from 'next/router'
import Layout from '@/components/Layout'
import {API_URL} from '@/config/index'
import EventItem from '@/components/EventItem'
import Link from 'next/link'

export default function SearchPage({events}) {
    const router =useRouter()
  return (
    <Layout title='Search Results'>
        <Link href='/events'>Go Back</Link>
      <h1>Search Results For {router.query.term}</h1>

      {events.length === 0 && <h3>No events to show</h3>}
      {events.data.map((evt) => (<EventItem key={evt.id} evt={evt.attributes}/>))}
      
    </Layout>
  )
}

export async function getServerSideProps ({query:term}) {
    const query = qs.stringify({
        _where: {
          _or: [
            { name_contains: term },
            { performers_contains: term },
            { description_contains: term },
            { venue_contains: term },
          ],
        },
      })
  const res = await fetch(`${API_URL}/api/events?${query}`)
  const events = await res.json()

  return {
    props: { events },
  }
}
 