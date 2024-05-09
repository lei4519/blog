use std::fmt::Debug;
use std::io;
use std::process::{Child, Command, ExitStatus};
use std::{ffi::OsStr, process::Stdio};

pub fn spawn<I, S>(c: &str, args: I) -> io::Result<Child>
where
    S: AsRef<OsStr>,
    I: IntoIterator<Item = S> + Debug + Copy,
{
    Command::new(c).args(args).stdout(Stdio::piped()).spawn()
}

pub fn exec<I, S>(c: &str, args: I) -> io::Result<ExitStatus>
where
    S: AsRef<OsStr>,
    I: IntoIterator<Item = S> + Debug + Copy,
{
    let mut c = spawn(c, args)?;
    c.wait()
}
