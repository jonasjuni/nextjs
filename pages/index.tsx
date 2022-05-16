import type {NextPage} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {signIn, signOut, useSession} from "next-auth/react"

const Home: NextPage = () => {
    const {data: session, status} = useSession();
    const loading = status === 'loading';

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
                    {/*test NEXT_PUBLIC variables*/}
                    {process.env.NEXT_PUBLIC_BROWSER_VARIABLE}
                </h1>
                <div className={styles.grid}>
                    {!session ?
                        (<a className={styles.card} onClick={(e) => {
                            e.preventDefault();
                            signIn('keycloak');
                        }}>
                            <h2>Login</h2>
                        </a>)
                        : (<>
                                <a className={styles.card} onClick={quit}>
                                    <h2>Logout</h2>
                                </a>
                                <div>
                                    <p style={{width: 50}}>{session.accessToken}</p>
                                    <pre>{JSON.stringify(session.user, null, 2)}</pre>
                                </div>
                            </>
                        )
                    }
                </div>
            </main>

            <footer className={styles.footer}>
            </footer>
        </div>
    )
}

export default Home
