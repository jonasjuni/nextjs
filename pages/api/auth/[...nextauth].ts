import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";


export default NextAuth({
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_ID,
            clientSecret: process.env.KEYCLOAK_SECRET,
            issuer: process.env.KEYCLOAK_ISSUER,
        }),
    ],
    callbacks: {
        async jwt({token, user, account}) {
            account;
            user;
            token.userRole = "admin"
            return token
        },
    },

});