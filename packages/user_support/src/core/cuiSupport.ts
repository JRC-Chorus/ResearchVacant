import { execa } from 'execa';
import loading from 'loading-cli';

/**
 * ローディング中の表示を出しながらコマンドを実行する
 */
export async function exeCommandWithloading(title: string, command: string) {
  const load = loading({
    text: title,
    color: 'red',
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  }).start();

  const output = await execa(command);

  load.stop();

  return output;
}
