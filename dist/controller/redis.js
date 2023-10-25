"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const redis_1 = require("redis");
async function connection() {
    const client = await (0, redis_1.createClient)()
        .on("error", (err) => console.log("Redis Client Error", err))
        .connect();
}
exports.connection = connection;
