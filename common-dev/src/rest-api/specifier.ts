
export class Specifier<T extends string>{
  constructor( private readonly type: T, private readonly target: string ) {}
  get value() {
    return { [this.type]: this.target };
  }
}
