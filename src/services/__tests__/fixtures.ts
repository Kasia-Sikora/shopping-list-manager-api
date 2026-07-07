import { List } from "@/interfaces";

export const DEFAULT_VALUES = [
  {
    id: "0",
    title: "First Card",
    createdAt: new Date().toISOString(),
    content: [
      {
        id: "1",
        value: "first el in First List",
        checked: false,
        depth: 0,
        parentId: null,
      },
      {
        id: "2",
        value: "second el in First List",
        checked: false,
        depth: 0,
        parentId: null,
      },
      {
        id: "3",
        value: "third el in First List",
        checked: false,
        depth: 0,
        parentId: null,
      },
      {
        id: "4",
        value: "fourth el in First List",
        checked: false,
        depth: 0,
        parentId: null,
      },
    ],
  },
  {
    id: "2",
    title: "Second Card",
    createdAt: new Date().toISOString(),
    content: [
      {
        id: "1",
        value: "first el in Second List",
        checked: true,
        depth: 0,
        parentId: null,
      },
      {
        id: "2",
        value: "second el in Second List",
        checked: false,
        depth: 0,
        parentId: null,
      },
      {
        id: "3",
        value: "third el in Second List",
        checked: false,
        depth: 0,
        parentId: null,
      },
      {
        id: "4",
        value: "fourth el in Second List",
        checked: true,
        depth: 0,
        parentId: null,
      },
    ],
  },
];

export const exampleList: List = {
  id: "test-1",
  title: "Test List",
  content: [...DEFAULT_VALUES[1].content],
  ownerId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
