import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";

const link = createHttpLink({uri: process.env.NEXT_PUBLIC_API_URL});

const client = new ApolloClient(
    {
        link: link,
        cache: new InMemoryCache(),
    }
);

export default client;