export const pickOne = <T> (array: Array<T>): T => {
  return array[Math.floor(Math.random() * array.length)]
}

export const shuffle = <T> (source: Array<T>): T[] => {
  const array = [...source]

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }

  return array
}
