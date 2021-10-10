type ServerConfig = {
    server: {
        port?: number
    },
    app: {
        path: string
    },
    database: {
        dbname: string,
        host: string,
        port: number,
        user: string,
        password: string
    },
    logging: any
}

export type { ServerConfig };