import * as fs from "fs";
import * as path from "path";
import { Config } from "./config"

export type Data = {
  projector: {
    // pwd
    [key: string]: {
      // key -> value
      [key: string]: string,
    }
  }
}

const defaultData = {
  projector: {},
}
export default class Projector {

  constructor(private config: Config, private data: Data) {

  }

  static fromConfig(config: Config): Projector {
    if (fs.existsSync(config.config)) {
      let data: Data = undefined;
      try {
        data = JSON.parse(fs.readFileSync(config.config).toString());

      } catch (e) {
        data = defaultData;
      }

      return new Projector(config, data);
    }

    return new Projector(config, defaultData);
  }

  getValueAll(): { [key: string]: string } {
    let curr = this.config.pwd;
    let prev = "";

    let out = {};
    const paths = [];

    do {
      prev = curr;
      paths.push(curr);
      curr = path.dirname(curr);
    } while (curr !== prev);

    return paths.reverse().reduce((acc, curr) => {
      const value = this.data.projector[curr];
      if (value) {
        Object.assign(acc, value);
      }

      return acc;
    }, {});

  }

  getValue(key: string): string | undefined {
    let curr = this.config.pwd;
    let prev = "";
    let out = undefined;

    do {
      const value = this.data.projector[curr]?.[key];
      if (value) {
        out = value;
        break;
      }

      prev = curr;
      curr = path.dirname(curr);

    } while (curr !== prev);

    return out;
  }

  setValue(key: string, value: string) {
    let dir = this.data.projector[this.config.pwd];
    if (!dir) {
      dir = this.data.projector[this.config.pwd] = {};
    }
    dir[key] = value;
  }

  removeValue(key: string) {
    const dir = this.data.projector[this.config.pwd];
    if (dir) {
      delete dir[key];
    }
  }

}
