import NextAuth, {CallbacksOptions, NextAuthOptions} from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";
import {JWT} from "next-auth/jwt";
import {NextApiRequest, NextApiResponse} from "next";
import jwtDecode from "jwt-decode";


const refreshAccessToken = async (token: JWT): Promise<JWT> => {
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

const callback: Partial<CallbacksOptions> = {
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
            session.error = token.error;
        }
        return session;
    },
}

const options: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
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
    callbacks: callback,
}


// Multi-Realms
const providers: string[] = ['master'];

let nextAuth = NextAuth(options);

function addNewProvider(realm: string) {
    const isNew = providers.indexOf(realm);
    if (isNew >= 0) return;
    providers.push(realm);

    nextAuth = NextAuth({
        secret: process.env.NEXTAUTH_SECRET,
        debug: true,
        providers: providers.map((realm) => KeycloakProvider({
            id: realm,
            name: realm,
            clientId: process.env.KEYCLOAK_ID,
            clientSecret: 'ignore',
            issuer: process.env.KEYCLOAK_ISSUER + '/' + realm,
        })),
        callbacks: callback,
    });
}

const Handle = (req: NextApiRequest, res: NextApiResponse) => {

    if (req?.query.nextauth && req.query.nextauth[0] === 'signin' && req.query.nextauth[1]) {
        const realm = req.query.nextauth[1];
        addNewProvider(realm);
    }
    //Case async, return await nextAuth(req, res);
    return nextAuth(req, res);
}

export default Handle;
