import {useState} from 'react';
import {useRouter} from 'next/router'
import styles from '@/styles/Search.module.css'

export default function Search() {
    const [term, setTerm] = useState('');
    const router = useRouter();
    const handleSubmit = (e) => {
        e.preventDefault();
        router.push(`events/search?query=${term}`);
    }
  return (
    <div className={styles.search}>
        <form onSubmit={(e)=>handleSubmit(e)}>
            <input type="text" value={term}
             onChange={(e)=>setTerm(e.target.value)} placeholder="Попробуем поискать..."></input>
        </form>
    </div>
  )
}
