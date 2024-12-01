import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const TYPEORM_TEST_CONFIG: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['./*/repositories/dao/*'],
    logging: process.env.DB_ENABLE_LOGGING !== '0' || false,
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: false,
    connectTimeoutMS: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30000', 10),
    ssl: process.env.DB_USE_SSL === '0',
    extra: {
        max: parseInt(process.env.DB_CONNECTIONS_POOL_SIZE || String(10), 10),
    },
    cache: {
        type: 'database',
        alwaysEnabled: false,
        duration: 0,
    },
};

