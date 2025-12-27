import { spawn as nodeSpawn, exec as nodeExec } from 'child_process';
import type { ChildProcess, ExecException } from 'child_process';

export function spawn(command: string, args: string[]): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {
    try {
      const child = nodeSpawn(command, args, { stdio: 'pipe' });
      resolve(child);
    } catch (error) {
      reject(error);
    }
  });
}

export function exec(command: string, args: string[]): Promise<number> {
  return new Promise((resolve, reject) => {
    const fullCommand = `${command} ${args.join(' ')}`;
    nodeExec(fullCommand, (error: ExecException | null, stdout: string, stderr: string) => {
      if (error) {
        reject(error);
      } else {
        resolve(0);
      }
    });
  });
}

