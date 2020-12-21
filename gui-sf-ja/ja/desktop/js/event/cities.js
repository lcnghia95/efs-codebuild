const cities = {
  1: [1],
  2: [2, 3, 4, 5, 6, 7],
  3: [8, 9, 10, 11, 12, 13, 14],
  4: [15, 16, 17, 18, 19, 20, 21, 22, 23],
  5: [24, 25, 26, 27, 28, 29, 30],
  6: [31, 32, 33, 34, 35],
  7: [36, 37, 38, 39],
  8: [40, 41, 42, 43, 44, 45, 46, 47],
  9: [48],
  10: [49],
  11: [50],
}

for (let key in cities) {
  cities[key] = cities[key].map(item => {
    return {
      id: item,
      name: 'city' + item,
    }
  })
}

export default cities
