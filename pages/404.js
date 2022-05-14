import { FaExclamationTriangle} from 'react-icons/fa'
import Layout from '@/components/Layout';
import styles from '@/styles/404.module.css';
import Link from 'next/link';

function NotFoundPage() {
  return (
    <Layout title='Page Not Found'>
      <div className={styles.error}>
        <h1><FaExclamationTriangle></FaExclamationTriangle> 404</h1>
        <h4>Sorry, nothing to show</h4>
        <Link href="/">
          <a>Go Back Home</a>
        </Link>
      </div>
    </Layout>
  )
}

export default NotFoundPage