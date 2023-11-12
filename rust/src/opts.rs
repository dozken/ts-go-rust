use clap::Parser;
use std::path::PathBuf;

#[derive(Parser, Debug)]
#[clap()]
pub struct Opts {
    args: Vec<String>,

    #[clap(short = 'c', long = "config")]
    config: Option<PathBuf>,

    #[clap(short = 'p', long = "pwd")]
    pwd: Option<PathBuf>,
}
