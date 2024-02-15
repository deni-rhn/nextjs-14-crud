const seen = new Set();

export const removeDuplicateArr = (arr: any[]) => {
  const ids = arr.map(({ taskId }) => taskId);
  return arr.filter(({ taskId }, index) => !ids.includes(taskId, index + 1));
};