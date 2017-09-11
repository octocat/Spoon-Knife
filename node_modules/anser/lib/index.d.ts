// Type definitions for Anser
// Project: https://github.com/IonicaBizau/anser

export interface AnserJsonEntry {
  content: string;
  fg: string;
  bg: string;
  fg_truecolor: string;
  bg_truecolor: string;
  clearLine: boolean;
  was_processed: boolean;
  isEmpty(): boolean;
}

export interface AnserOptions {
  use_classes?: boolean;
}

export default class Anser {
  static ansiToJson(txt: string, options?: AnserOptions): AnserJsonEntry[];

  static ansiToHtml(txt: string, options?: AnserOptions): string;

  static ansiToText(txt: string, options?: AnserOptions): string;

  static escapeForHtml(txt: string): string;

  static linkify(txt: string): string;

}
