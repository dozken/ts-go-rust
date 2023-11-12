import config from "./config";
import getOpts from "./opts"

const opts = getOpts();
console.log(`Opts ${JSON.stringify(opts)}`);

const cfg = config(opts);
console.log(`Config ${JSON.stringify(cfg)}`);
