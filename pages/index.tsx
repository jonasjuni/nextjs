import type {NextPage} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {getCsrfToken, signIn, signOut, useSession} from "next-auth/react"
import {useState, useEffect} from "react";

const Home: NextPage = () => {
    const {data: session, status} = useSession();

    useEffect(() => {
        if (session?.error === "RefreshAccessTokenError") {
            signIn(); // Force sign in to hopefully resolve error
        }
    }, [session]);

    const loading = status === 'loading';

    const [realm, setRealm] = useState('abc');

    const keycloakSignIn = async (realm: string) => {

        const res = await fetch('/api/auth/signin/' + realm, {
            method: "post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            // @ts-expect-error
            body: new URLSearchParams({
                csrfToken: await getCsrfToken(),
                json: true,
            }),
        });
        const data = await res.json();
        const url = data.url;

        window.location.href = url;

        return;
        // // If url contains a hash, the browser does not reload the page. We reload manually
        // if (url.includes("#")) window.location.reload()
        // return

        // const error = new URL(data.url).searchParams.get("error")
        // return {
        //     error,
        //     status: res.status,
        //     ok: res.ok,
        //     url: error ? null : data.url,
        // } as any
    }

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
                                await keycloakSignIn(realm);
                            }}>
                                <h2>Login</h2>
                            </a>
                        </>)
                        : (<>
                                <a className={styles.card} onClick={quit}>
                                    <h2>Logout</h2>
                                </a>
                                <div>
                                    {/*<p style={{width: 50}}>{session.accessToken}</p>*/}
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
