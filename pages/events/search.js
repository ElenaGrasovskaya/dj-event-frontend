import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import EventItem from '@/components/EventItem';
import Link from 'next/link';

export default function SearchPage({ events }) {
  const router = useRouter();
  console.log(router.query);
  console.log("data", events.data);
  return (
    <Layout title='Search Results'>
      <Link href='/'>Назад</Link>
      <h1>Искали {router.query.term}</h1>

      {events.length === 0 && <h3>Не нашли</h3>}
      {events.data.map((evt) => (
        <EventItem key={evt.id} evt={evt.attributes} />
      ))}
    </Layout>
  );
}

export async function getServerSideProps(context) {

  const {query} = context;
  console.log("context", query)
  
  const res = await fetch(
    `${API_URL}/api/events?filters[title][$containsi]=${query}`
  );
  const events = await res.json();

  return {
    props: { events },
  };
}
