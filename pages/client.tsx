import {NextPage} from "next";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import {useCountriesQuery} from "../src/generated/graphql";

const Client: NextPage = () => {

    const {data, loading, error} = useCountriesQuery();

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Client-side Rendering
                </h1>

                <a className={styles.grid}>
                    {loading
                        ? (<h1>...</h1>)
                        : data?.countries.slice(0, 4).map((country) => (
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