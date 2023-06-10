export function getPagingData(items: any) {
  const { count: totalItems, rows: data } = items;
  return { totalItems, data };
}

export function getPagingOptions(page: any, size: any, options?: any) {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;
  return {
    ...options,
    limit,
    offset,
  };
}
