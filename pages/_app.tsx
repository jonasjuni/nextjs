import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {SessionProvider} from 'next-auth/react';
import {ApolloProvider} from "@apollo/client";
import client from "../apollo-client";

// Use the <SessionProvider> to improve performance and allow components that call
// `useSession()` anywhere in your application to access the `session` object.
function MyApp({Component, pageProps}: AppProps) {

    return (
        <SessionProvider
            // Provider options are not required but can be useful in situations where
            // you have a short session maxAge time. Shown here with default values.
            session={pageProps.session}
        >
            <ApolloProvider client={client}>
                <Component {...pageProps} />
            </ApolloProvider>
        </SessionProvider>
    )
}

export default MyApp
