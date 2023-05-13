const Store = require("electron-store");
export const storeMethod = (
  key: "clear" | "get" | "set" | "del",
  params: string | { key: string; value: any }
) => {
  const store = new Store();
  const storeMatch = {
    clear: () => store.clear(),
    get: (key) => store.get(key),
    set: ({ key, value }) => store.set(key, value),
    del: (key) => store.delete(key),
  };
  const storeFunction = (key, params) => {
    return storeMatch[key](params);
  };
  return storeFunction(key, params);
};
