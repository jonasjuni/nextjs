import {InferGetServerSidePropsType, NextPage} from "next";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import client from "../apollo-client";
import {CountriesDocument, CountriesQuery} from "../src/generated/graphql";

export const getServerSideProps = async () => {
    const {data} = await client.query<CountriesQuery>({query: CountriesDocument});

    return {
        props: {
            countries: data.countries.slice(0, 4),
        },
    };
}

const Server: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Next typescript project</title>
                <meta name="description" content="Using typescript and auth"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Server-side Rendering
                </h1>
                <div className={styles.grid}>
                    {props.countries.map((country) => (
                        <div key={country.code} className={styles.card} style={{width: "100%"}}>
                            <h2>{country.name}</h2>
                            <p>{country.code}</p>
                        </div>
                    ))}
                </div>
            </main>

            <footer className={styles.footer}>
            </footer>
        </div>
    );
}


export default Server;