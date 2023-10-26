"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = void 0;
const redis_1 = require("redis");
async function connectRedis() {
    const client = (0, redis_1.createClient)();
    client.on("error", (err) => console.log("Redis Client Error", err));
    await client.connect();
    return client;
}
exports.connectRedis = connectRedis;
