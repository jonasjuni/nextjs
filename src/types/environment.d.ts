namespace NodeJS {
    interface ProcessEnv extends NodeJS.ProcessEnv {
        KEYCLOAK_ID: string
        KEYCLOAK_SECRET: string
        KEYCLOAK_ISSUER: string
        SECRET: string
    }
}