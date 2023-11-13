import { describe, beforeEach, expect, it, } from "bun:test";
import Projector, { Data } from "./projector";
import { Config, Operation } from "./config";
describe("projector", () => {

  function getData(): Data {
    return {
      projector: {
        "/": {
          foo: "bar1",
          fem: "is_great",
        },
        "/foo": {
          foo: "bar2",
        },
        "/foo/bar": {
          foo: "bar3",
        },
      }
    }
  }

  function getProjector(pwd: string): Projector {
    const config: Config = {
      args: [],
      operation: Operation.Print,
      pwd,
      config: "Hello, Frontend Masters!"
    }
    return new Projector(config, getData());
  }


  it("getValueAll", () => {
    const projector = getProjector("/foo/bar");
    expect(projector.getValueAll()).toEqual({ foo: "bar3", fem: "is_great" });
  })

  it("getValue", () => {
    const projector = getProjector("/");

    expect(projector.getValue("foo")).toEqual("bar1");
  })


  it("setValue", () => {
    let projector = getProjector("/");
    projector.setValue("foo", "bar0");

    expect(projector.getValue("foo")).toEqual("bar0");

    projector = getProjector("/");
    expect(projector.getValue("foo")).toEqual("bar1");
  })

  it("removeValue", () => {
    const proj = getProjector("/foo/bar");
    proj.removeValue("fem");
    expect(proj.getValue("fem")).toEqual("is_great");

    proj.removeValue("foo");
    expect(proj.getValue("foo")).toEqual("bar2");
  })

});

