import type {NextPage} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {signIn, signOut, useSession} from "next-auth/react"

const Home: NextPage = () => {
    const  {data: session, status} = useSession();

    return (
        <div className={styles.container}>
            <Head>
                <title>Next typescript project</title>
                <meta name="description" content="Using typescript and auth"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    {/*test NEXT_PUBLIC variables*/}
                    {process.env.NEXT_PUBLIC_BROWSER_VARIABLE}
                </h1>
                <div className={styles.grid}>
                    <a className={styles.card} onClick={(e) => {
                        e.preventDefault()
                        signIn();
                    }}>
                        <h2>Login</h2>
                    </a>
                </div>
            </main>

            <footer className={styles.footer}>
            </footer>
        </div>
    )
}

export default Home
