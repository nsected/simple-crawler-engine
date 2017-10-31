export var AppConfig = {
    Server: {
        Port: 3001,
        db: {
            username: 'postgres',
            password: 'postgres',
            host: 'localhost',
            port: '5432',
            database: 'postgres'
        },
        poolSize: {
            min: 2,
            max: 5
        },
        searchPath: 'public'
    },
    mongo: {
      host: "mongodb://localhost/spider"
    }
};