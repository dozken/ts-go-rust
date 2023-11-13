use std::path::PathBuf;

use anyhow::{anyhow, Context, Result};

use crate::opts::Opts;

#[derive(Debug)]
pub struct Config {
    pub operation: Operation,
    pub pwd: PathBuf,
    pub config: PathBuf,
}

impl TryFrom<Opts> for Config {
    type Error = anyhow::Error;

    fn try_from(value: Opts) -> Result<Self> {
        let operation = value.args.try_into()?;
        let config = get_config(value.config)?;
        let pwd = get_pwd(value.pwd)?;

        return Ok(Config {
            operation,
            config,
            pwd,
        });
    }
}

#[derive(Debug, PartialEq)]
pub enum Operation {
    Print(Option<String>),
    Add((String, String)),
    Remove(String),
}

impl TryFrom<Vec<String>> for Operation {
    type Error = anyhow::Error;

    fn try_from(value: Vec<String>) -> Result<Self, Self::Error> {
        let mut value = value;
        if value.len() == 0 {
            return Ok(Operation::Print(None));
        }

        let term = value.get(0).expect("Expected at least one argument");
        if term == "add" {
            if value.len() != 3 {
                return Err(anyhow!("Expected 2 arguments but got {}", value.len() - 1));
            }

            let mut drain = value.drain(1..=2);
            return Ok(Operation::Add((
                drain.next().expect("Expected at least one argument"),
                drain.next().expect("Expected at least one argument"),
            )));
        }

        if term == "rm" {
            if value.len() != 2 {
                return Err(anyhow!("Expected 1 arguments but got {}", value.len() - 1));
            }

            let arg = value.pop();
            return Ok(Operation::Remove(
                arg.expect("Expected at least one argument"),
            ));
        }

        if value.len() > 1 {
            return Err(anyhow!(
                "Expected 0-1 arguments but got {}",
                value.len() - 1
            ));
        }

        let arg = value.pop().expect("Expect 0-1 argument");
        return Ok(Operation::Print(Some(arg)));
    }
}

fn get_config(config: Option<PathBuf>) -> Result<PathBuf> {
    if let Some(v) = config {
        return Ok(v);
    }

    let loc = std::env::var("HOME").context("unable to find $HOME")?;
    let mut loc = PathBuf::from(loc);

    loc.push("projector");
    loc.push("projector.json");

    return Ok(loc);
}

fn get_pwd(pwd: Option<PathBuf>) -> Result<PathBuf> {
    if let Some(v) = pwd {
        return Ok(v);
    }

    return Ok(std::env::current_dir().context("unable to find $HOME")?);
}

#[cfg(test)]
mod test {
    use super::Config;
    use crate::{config::Operation, opts::Opts};
    use anyhow::Result;

    #[test]
    fn test_print_all() -> Result<()> {
        let opts: Config = Opts {
            args: vec![],
            pwd: None,
            config: None,
        }
        .try_into()?;

        assert_eq!(opts.operation, Operation::Print(None));
        return Ok(());
    }

    #[test]
    fn test_print_key() -> Result<()> {
        let opts: Config = Opts {
            args: vec![String::from("key")],
            pwd: None,
            config: None,
        }
        .try_into()?;

        assert_eq!(opts.operation, Operation::Print(Some(String::from("key"))));
        return Ok(());
    }

    #[test]
    fn test_add_key_value() -> Result<()> {
        let opts: Config = Opts {
            args: vec![
                String::from("add"),
                String::from("key"),
                String::from("value"),
            ],
            pwd: None,
            config: None,
        }
        .try_into()?;

        assert_eq!(
            opts.operation,
            Operation::Add((String::from("key"), String::from("value")))
        );
        return Ok(());
    }

    #[test]
    fn test_rm_key_value() -> Result<()> {
        let opts: Config = Opts {
            args: vec![String::from("rm"), String::from("key")],
            pwd: None,
            config: None,
        }
        .try_into()?;

        assert_eq!(opts.operation, Operation::Remove(String::from("key")));
        return Ok(());
    }
}
