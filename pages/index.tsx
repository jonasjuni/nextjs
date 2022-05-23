import type {NextPage} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {getProviders, signIn, signOut, useSession} from "next-auth/react"
import KeycloakProvider from "next-auth/providers/keycloak";
import {SignInOptions} from "next-auth/react/types";
import {useState} from "react";

const Home: NextPage = () => {
    const {data: session, status} = useSession();
    const loading = status === 'loading';

    const [realm, setRealm] = useState('abc');

    const quit = async () => {
        const idToken = session?.idToken;
        await signOut(
            {
                callbackUrl: '/api/auth/logout?id_token_hint=' + idToken,
            });
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Next typescript project</title>
                <meta name="description" content="Using typescript and auth"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    {session
                        ? session.provider.toUpperCase()
                        : process.env.NEXT_PUBLIC_BROWSER_VARIABLE}

                </h1>
                <div className={styles.grid}>
                    {!session ?
                        (<>
                            <select name="realms" id="realms" value={realm} onChange={(e) => setRealm(e.target.value)}>
                                <option value="abc">ABC</option>
                                <option value="jcsj">JCSJ</option>
                            </select>
                            <a className={styles.card} onClick={async (e) => {
                                e.preventDefault();
                                await signIn(realm);
                            }}>
                                <h2>Login</h2>
                            </a>
                        </>)
                        : (<>
                                <a className={styles.card} onClick={quit}>
                                    <h2>Logout</h2>
                                </a>
                                <div>
                                    <p style={{width: 50}}>{session.accessToken}</p>
                                    <pre>{JSON.stringify(session.user, null, 2)}</pre>
                                </div>
                            </>
                        )}
                </div>
            </main>
            <footer className={styles.footer}>
            </footer>
        </div>
    )
}

export default Home
