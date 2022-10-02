import { UserProps, ColumnProps, ImageProps } from "../type/Types";

function generateFitUrl(
  data: ImageProps,
  width: number,
  height: number,
  format = ["m_pad"]
) {
  if (data && data.url) {
    const formatStr = format.reduce((prev, current) => {
      return current + "," + prev;
    }, "");
    data.fitUrl = `${data.url}?x-oss-process=image/resize,${formatStr}h_${height},w_${width}`;
  }
}

export function addColumnAvatar(
  data: ColumnProps | UserProps,
  width: number,
  height: number
) {
  if (data.avatar) {
    generateFitUrl(data.avatar, width, height);
  } else {
    const parseCol = data as ColumnProps;
    data.avatar = {
      fitUrl: require(parseCol.title
        ? "@/assets/column.jpg"
        : "@/assets/avatar.jpg"),
    };
  }
}

// 数组转成一个对象
export const arrToObj = <T extends { _id?: string }>(arr: Array<T>) => {
  return arr.reduce((prev, current) => {
    if (current._id) {
      prev[current._id] = current;
    }
    return prev;
  }, {} as { [key: string]: T });
};

// 将对象转换成一个由其值组成的数组
export const objToArr = <T>(obj: { [key: string]: T }) => {
  return Object.keys(obj).map((key) => obj[key]);
};
