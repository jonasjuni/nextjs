import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";
import {JWT} from "next-auth/jwt";

const realms = [
    {
        id: 'abc',
        clientId: 'nextjs',
        clientSecret: 'PX9kq5xjYSyKB4McUVLjEi3KtNNhVSdz',
        issuer: 'http://localhost:8080/realms/abc',
    },
    {
        id: 'jcsj',
        clientId: 'nextjs',
        clientSecret: 'kPGKIof2zlc2DnfC0yXlYJd7dtxUKXKj',
        issuer: 'http://localhost:8080/realms/jcsj',
    }
];


const refreshAccessToken = async (token: JWT) => {

    return token;
}
export default NextAuth({
    debug: true,
    secret: 'ZH+S4qxv82gIt9QZw5FLTMfSrLrTy/1BKyh7RTdr/xA=',
    providers: realms.map((realm) => KeycloakProvider({
        id: realm.id,
        clientId: realm.clientId,
        clientSecret: realm.clientSecret,
        issuer: realm.issuer
    })),
    callbacks: {
        async jwt({token, user, account}) {
            if (account && user) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.accessTokenExpired = (account.expires_at - 30) * 1000;
                token.idToken = account.id_token;
                token.provider = account.provider;
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
                session.provider = token.provider;
            }
            return session;
        },
    },
});