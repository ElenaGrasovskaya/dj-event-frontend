import Head from 'next/head';
import {useRouter} from 'next/router';
import Header from './Header';
import Footer from './Footer';
import Showcase from './Showcase';
import styles from '@/styles/Layout.module.css';

function Layout({ title, keywords, description, children, backup }) {
    const  router = useRouter();
    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta name='description' content={description} />
                <meta name='keyword' content={keywords} />
            </Head>
            <Header backup = {backup} />

           
            <div className={styles.container}>
                {children}
            </div>
            <Footer />


        </div>
    )
}

export default Layout

Layout.defaultProps = {
    title: 'LibraPortal | Совместное ведение расходов по заказам',
    description: 'Добавляем все расходы и заказы сюда',
    keywords: 'мебель заказы'
} 

// {router.pathname==='/'&& <Showcase />}