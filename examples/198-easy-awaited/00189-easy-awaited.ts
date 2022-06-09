// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type X = Promise<string>;
type Y = Promise<{ field: number }>;
type Z = Promise<Promise<string | number>>;

type cases = [
  Expect<Equal<MyAwaited<X>, string>>,
  Expect<Equal<MyAwaited<Y>, { field: number }>>,
  Expect<Equal<MyAwaited<Z>, string | number>>
];

// @ts-expect-error
type error = MyAwaited<number>;

// ============= Your Code Here =============
//infer可以在条件类型中推断并引用推断的结果
type MyAwaited<T> = T extends Promise<infer R> ? MyAwaited<R> : T;
