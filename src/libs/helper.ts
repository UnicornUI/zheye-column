import { UserProps, ColumnProps, ImageProps } from "../type/Types";

// 可直接加载静态文件使用
import columnImage from "../assets/column.jpg";
import avatarImage from "../assets/avatar.jpg";

export function generateFitUrl(
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
    generateFitUrl(data.avatar as ImageProps, width, height);
  } else {
    const parseCol = data as ColumnProps;
    data.avatar = {
      //  使用 webpack 的用法
      // fitUrl: require(parseCol.title ? "@/assets/column.jpg" : "@/assets/avatar.jpg"),
      //  使用 vite 可以直接加载静态图片
      fitUrl: parseCol.title ? columnImage : avatarImage,
    };
  }
}

interface CheckCondition {
  format?: string[];
  size?: number;
}

type ErrorType = "format" | "size" | null;

export function beforeUploadedCheck(file: File, condition: CheckCondition) {
  const { format, size } = condition;
  const isValidFormat = format ? format.includes(file.type) : true;
  const isValidSize = size ? file.size / 1024 / 1024 < size : true;
  let error: ErrorType = null;
  if (!isValidFormat) {
    error = "format";
  }
  if (!isValidSize) {
    error = "size";
  }
  return { passed: isValidFormat && isValidSize, error };
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
