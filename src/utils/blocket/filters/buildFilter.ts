type FilterValues = { values: string | string[] } | { range: { start: string | null, end: string | null } }

export const buildFilter = (key: string, value: FilterValues) => {
  return `filter=${encodeURIComponent(JSON.stringify({
    key,
    ...value
  }))}`
}