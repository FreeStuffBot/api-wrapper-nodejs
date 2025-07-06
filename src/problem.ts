

export class Problem extends Error {

  public readonly type: string;
  public readonly title: string;
  public readonly detail: string;

  constructor(
    public readonly raw: Record<string, unknown>,
  ) {
    super();
    this.type = String(raw.type ?? 'fsb:problem:unknown');
    this.title = String(raw.title ?? 'Unknown Problem');
    this.detail = String(raw.detail ?? 'An unknown error occurred');
  }

}
