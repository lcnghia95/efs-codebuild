import mapData from './map-data.js'

const large = [
  {
    lines: [[780, 85], [720, 85]],
    pos: {
      left: 0,
      top: 17,
    },
    text: '北海道',
    id: 1,
  },
  {
    lines: [[640, 195], [607, 195]],
    pos: {
      left: 0,
      top: 16,
    },
    text: '東北',
    id: 2,
  },
  {
    lines: [[555, 110], [555, 220]],
    pos: {
      left: 110,
      top: 56,
    },
    text: '甲信越',
    id: 3,
  },
  {
    lines: [[640, 290], [545, 290]],
    pos: {
      left: 56,
      top: 16,
    },
    text: '関東',
    style: { 'max-width': '180px' },
    id: 4,
  },
  {
    lines: [[478, 185], [478, 254]],
    pos: {
      left: 128,
      top: 56,
    },
    text: '北陸',
    id: 5,
  },
  {
    lines: [[600, 384], [515, 384], [515, 295]],
    pos: {
      left: 56,
      top: 16,
    },
    text: '東海',
    id: 6,
  },
  {
    lines: [[330, 200], [428, 200], [428, 294]],
    pos: {
      left: 155,
      top: 40,
    },
    text: '関西',
    style: { 'max-width': '155px' },
    id: 7,
  },
  {
    lines: [[160, 247], [365, 247], [365, 270]],
    pos: {
      left: 150,
      top: 48,
    },
    text: '中国',
    style: { 'max-width': '150px' },
    id: 8,
  },
  {
    lines: [[369, 390], [369, 309]],
    pos: {
      left: 126,
      top: 16,
    },
    text: '四国',
    id: 9,
  },
  {
    lines: [[220, 305], [282, 305]],
    pos: {
      left: 180,
      top: 20,
    },
    text: '九州',
    style: { 'max-width': '180px' },
    id: 10,
  },
  {
    lines: [[279, 65], [310, 65]],
    pos: {
      left: 56,
      top: 17,
    },
    text: '沖縄',
    id: 11,
  },
]
export default large.map(item => {
  item.mediums = mapData[item.id]
  return item
})
