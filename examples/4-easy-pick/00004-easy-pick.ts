// ============= Test Cases =============
import type { Equal, Expect } from "./test-utils";

type cases = [
  Expect<Equal<Expected1, MyPick<Todo, "title">>>,
  Expect<Equal<Expected2, MyPick<Todo, "title" | "completed">>>,
  // @ts-expect-error
  MyPick<Todo, "title" | "completed" | "invalid">
];

interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

interface Expected1 {
  title: string;
}

interface Expected2 {
  title: string;
  completed: boolean;
}

// ============= Your Code Here =============
// keyof 获取 T 健的集合
// K extends keyof，K类型是 keyof T结果的子集
// in用来做类型收窄，也就是K类型中之一
// [P in K]: T[P]这里用到了映射类型，是基于索引签名的语法
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
