import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";
import {JWT} from "next-auth/jwt";
import {NextApiRequest, NextApiResponse} from "next";
import jwtDecode from "jwt-decode";


const refreshAccessToken = async (token: JWT) => {
    try {
        const keycloakIssuer: { iss: string } = jwtDecode(token.accessToken);

        const url = `${
            keycloakIssuer.iss ||
            process.env.KEYCLOAK_ID + '/realms/master/'
        }/protocol/openid-connect/token`;

        const body = new URLSearchParams({
            client_id: process.env.KEYCLOAK_ID as string,
            client_secret: 'ignore',
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken,
        });

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body: body,
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw refreshedTokens;

        }
        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
        };

    } catch (e) {
        console.log(e);
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }
}

let providers: string[] = [];

let nextAuth = NextAuth({
    debug: true,
    providers: [
        KeycloakProvider({
            id: 'master',
            name: 'master',
            clientId: process.env.KEYCLOAK_ID,
            clientSecret: 'ignore',
            issuer: process.env.KEYCLOAK_ISSUER + '/master',
        })
    ],
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

function addNewProvider(provider: string) {
    const isNew = providers.indexOf(provider);
    if (isNew >= 0) return;

    providers.push(provider);
    nextAuth = NextAuth({
        debug: true,
        providers: providers.map((provider) => KeycloakProvider({
            id: provider,
            name: provider,
            clientId: process.env.KEYCLOAK_ID,
            clientSecret: 'ignore',
            issuer: process.env.KEYCLOAK_ISSUER + '/' + provider,
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
}

const Handle = (req: NextApiRequest, res: NextApiResponse) => {

    if (req.query.nextauth[0] === 'signin' && req.query.nextauth[1]) {
        const realm = req.query.nextauth[1];
        addNewProvider(realm);
    }
    return nextAuth(req, res);
}

export default Handle;
