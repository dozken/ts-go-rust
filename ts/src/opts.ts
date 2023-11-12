import cli from "command-line-args";

export type Opts = {
  args?: string[],
  config?: string,
  pwd?: string
}


export default function getOpts() {
  return cli([{
    name: "args",
    defaultOption: true,
    multiple: true,
    type: String,
  },
  {
    name: "config",
    alias: "c",
    type: String,
  },
  {
    name: "pwd",
    alias: "p",
    type: String
  }])
}
