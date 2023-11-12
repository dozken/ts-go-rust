import path from "path";
import { Opts } from "./opts";
import { watch } from "fs";

export enum Operation {
  Print,
  Add,
  Remove,
}

export type Config = {
  args: string[],
  config: string,
  operation: Operation,
  pwd: string,

}

function getPwd(opts: Opts): string {
  if (opts.pwd) {
    return opts.pwd;
  }

  return process.cwd();
}

function getConfig(opts: Opts): string {
  if (opts.config) {
    return opts.config;
  }

  const home = process.env["HOME"];
  const config = path.join(home, ".config");
  const loc = config || home;
  if (!loc) {
    throw new Error("HOME env not set");
  }

  if (loc === home) {
    return path.join(loc, ".projector.json");
  }
  return path.join(loc, "projector", "projector.json");
}

function getOperation(opts: Opts): Operation {
  if (!opts.args || opts.args.length === 0) {
    return Operation.Print;
  }

  if (opts[0] === "add") {
    return Operation.Add;
  }

  if (opts[0] === "rm") {
    return Operation.Remove;
  }

  return Operation.Print;
}

function getArgs(opts: Opts): string[] {
  if (!opts.args || opts.args.length === 0) {
    return [];
  }

  const operation = getOperation(opts);
  if (operation === Operation.Print) {
    if (opts.args.length > 1) {
      throw new Error(`Expected 0 or 1 args, but got ${opts.args.length - 1}`);
    }

    return opts.args;
  }

  if (operation === Operation.Add) {
    if (opts.args.length !== 3) {
      throw new Error(`Expected 3 args, but got ${opts.args.length - 1}`);
    }

    return opts.args.slice(1);
  }

  if(opts.args.length !== 2){
    throw new Error(`Expected 2 args, but got ${opts.args.length - 1}`);
  }

  return opts.args.slice(1);
}

export default function config(opts: Opts): Config {
  return {
    pwd: getPwd(opts),
    config: getConfig(opts),
    args: getArgs(opts),
    operation: getOperation(opts),
  }
}

