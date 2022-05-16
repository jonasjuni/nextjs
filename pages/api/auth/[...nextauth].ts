import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";
import {JWT} from "next-auth/jwt";

const refreshAccessToken = async (token: JWT) => {

    return token;
}
export default NextAuth({
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_ID,
            clientSecret: process.env.KEYCLOAK_SECRET,
            issuer: process.env.KEYCLOAK_ISSUER,
        }),
    ],
    pages: {
        signOut: '/'
    },
    callbacks: {
        async jwt({token, user, account}) {
            if (account && user) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.accessTokenExpired = (account.expires_at - 30) * 1000;
                token.idToken = account.id_token;
                return token;
            }

            const now = Date.now();
            if (now < token.accessTokenExpired) return token;

            return refreshAccessToken(token);
        },
        //NOW Wed May 11 2022 18:19:55 GMT-0300 (Horário Padrão de Brasília)
        //Expires 1652303942 Wed May 11 2022 18:19:02 GMT-0300 (Horário Padrão de Brasília)

        async session({session, token, user}) {
            if (token) {
                session.accessToken = token.accessToken;
                session.idToken = token.idToken;
            }
            return session;
        },
    },
});