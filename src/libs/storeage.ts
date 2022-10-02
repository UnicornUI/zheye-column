const enum StorageType {
  Local = "Local",
  Session = "Session",
}

class StorageHandler {
  // 存储数据
  setItem(type: StorageType, key: string, value: string) {
    if (type === StorageType.Local) {
      localStorage.setItem(key, value);
    } else {
      sessionStorage.setItem(key, value);
    }
  }
  // 获取存储
  getItem(type: StorageType, key: string) {
    if (type === StorageType.Local) {
      if (localStorage.getItem(key)) {
        return localStorage.getItem(key);
      }
    } else {
      if (sessionStorage.getItem(key)) {
        return sessionStorage.getItem(key);
      }
    }
  }

  // 移除存储
  remove(type: StorageType, key: string) {
    if (type === StorageType.Local) {
      if (localStorage.getItem(key)) localStorage.removeItem(key);
    } else {
      if (sessionStorage.getItem(key)) sessionStorage.removeItem(key);
    }
  }

  // 清空存储
  clear(type: StorageType) {
    if (type === StorageType.Local) {
      localStorage.clear();
    } else {
      sessionStorage.clear();
    }
  }
}

const storageHandler = new StorageHandler();

// 导出常量，方便使用
export const localType = StorageType.Local;
export const sessionType = StorageType.Session;

export { storageHandler };
