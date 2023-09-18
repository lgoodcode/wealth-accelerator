export const padLastArrayWithZeros = (arr2D: number[][]) => {
  const len = arr2D[arr2D.length - 1].length;
  arr2D[arr2D.length - 1].length = 12;
  arr2D[arr2D.length - 1].fill(0, len, 12);
};

export const restoreLastArrayToLastZero = (arr2D: number[][]) => {
  if (!Array.isArray(arr2D) || arr2D.length === 0) {
    return arr2D;
  }

  const lastArray = arr2D[arr2D.length - 1];
  let lastIndex = lastArray.length - 1;

  while (lastIndex >= 0 && lastArray[lastIndex - 1] === 0) {
    lastIndex--;
  }

  arr2D[arr2D.length - 1] = lastArray.slice(0, lastIndex + 1);
};
