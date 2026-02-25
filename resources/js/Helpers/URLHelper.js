export const getSearchParams = (key ,jsonDecode = false) => {
  const params = new URLSearchParams(location.search);
  const value = params.get(key);

  if(jsonDecode)
    return JSON.parse(value);

  return value;
}

export const updateSearchParams = (key, value) => {
  const params = new URLSearchParams(location.search);
  params.set(key, value);
  const result = {};
  for (const [paramKey, paramValue] of params) {
    result[paramKey] = paramValue;
  }

  return result;
};