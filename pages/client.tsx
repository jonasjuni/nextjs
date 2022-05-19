import {NextPage} from "next";
import styles from "../styles/Home.module.css";
import Head from "next/head";

const Client: NextPage = () => {

    return (
        <div className={styles.container}>
            <Head>
                <title>Next typescript project</title>
                <meta name="description" content="Using typescript and auth"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title} style={{width: "max-content"}}>
                    Client Side Page
                </h1>
                <div className={styles.grid}>
                    <a className={styles.card}>
                        <h2>Static</h2>
                    </a>
                </div>
            </main>
            <footer className={styles.footer}>
            </footer>
        </div>
    );

}


export default Client;