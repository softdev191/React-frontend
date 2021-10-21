type SortOption = {
  column: string;
  direction: number | null;
};

export function parseSort(sortStr: string): SortOption | null {
  const [column, dirStr] = sortStr.split(' ');
  const direction = dirStr === 'ASC' ? -1 : dirStr === 'DESC' ? 1 : null;
  return {column, direction};
}

export default parseSort;
