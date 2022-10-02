import { PostProps } from "../type/Types";
export const testPosts: PostProps[] = [
  {
    _id: "1",
    title: "这是第一篇文章",
    content: "这是知乎专栏之·者也栏目开讲了",
    // image: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100',
    createdAt: "2022-06-11 10:34:22",
    column: "1",
  },
  {
    _id: "2",
    title: "这是第二篇文章",
    content: "这是知乎专栏之·君子栏目开讲了",
    createdAt: "2022-06-11 10:11:12",
    column: "2",
  },
  {
    _id: "3",
    title: "这是第三篇文章",
    content: "这是知乎专栏之·养生栏目开讲",
    createdAt: "2022-06-12 13:14:15",
    column: "3",
  },
];
