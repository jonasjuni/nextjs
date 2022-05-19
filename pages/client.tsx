import {NextPage} from "next";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import {useCountriesQuery} from "../src/generated/graphql";

const Client: NextPage = () => {

   const  {data, loading, error} = useCountriesQuery();

    return (
        <div className={styles.container}>
            <Head>
                <title>Next typescript project</title>
                <meta name="description" content="Using typescript and auth"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Static Page
                </h1>
                <a className={styles.grid}>
                    {data?.countries.map((country) => (
                        <div key={country.code} className={styles.card} style={{width: "100%"}}>
                            <h2>{country.name}</h2>
                            <p>{country.code} - {country.emoji}</p>
                        </div>
                    ))}
                </a>
            </main>

            <footer className={styles.footer}>
            </footer>
        </div>
    );

}


export default Client;