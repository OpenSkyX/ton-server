import devConfig from "./config.dev";
import prodConfig from "./config.prod";

const env = "dev";
console.log("ENV:",env)
const index = env == "dev" ? devConfig : prodConfig;
console.log("current evn:", env);

export default { ...index, env: process.env.NODE_ENV, isDev: env == "dev" };
