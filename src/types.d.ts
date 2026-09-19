declare module 'm3u8-parser' {
  export class Parser {
    push(content: string): void;
    end(): void;
    manifest: any;
  }
}
