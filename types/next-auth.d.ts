import  "next-auth"
import  "next-auth/jwt"

/** Example on how to extend the built-in session types */
declare module "next-auth" {
    interface Session {
        /** This is an example. You can find me in types/next-auth.d.ts */
        accessToken: string;
        idToken: string;
    }

    interface Account {
        access_token: string;
        refresh_expires_in: number;
        refresh_token: string;
        token_type: string;
        expires_at: number;
        id_token: string;
    }
}

/** Example on how to extend the built-in types for JWT */
declare module "next-auth/jwt" {
    interface JWT {
        /** This is an example. You can find me in types/next-auth.d.ts */
        accessToken: string;
        refreshToken: string;
        accessTokenExpired: number;
        idToken: string;

    }
}