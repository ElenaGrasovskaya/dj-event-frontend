import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/EventItem.module.css'
import {API_URL} from '@/config/index'

export default function EventItem({ evt }) {
    return (
        <div className={styles.event}>

            <div className={styles.img}>
                <Image src={evt.image_url ? API_URL+evt.image_url : '/images/sample/kitchen.png'}
                    width={70} height={70} />
            </div>
            <div className={styles.info}>
                <h3>{evt.title}</h3>
            </div>
            <div className={styles.info}>
                <h3>Стоимость: {evt.clientPrice}</h3>
            </div>
            <div className={styles.info}>
                <h3>Затраты: {evt.expenses}</h3>
            </div>
            <div className={styles.link}>
                <Link href={`/events/${evt.slug}`}>
                    <a className='btn'>Изменить</a>
                </Link>

            </div>
        </div>
    )
}
