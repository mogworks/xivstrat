export interface DamageInfo {
  time: string
  name: string
  type: 'physical' | 'magical' | 'special'
  value: string
}

export const timelineMap = {
  m5s: {
    mitigations: {
      MT: ['00:03.045', '01:16.779'],
      ST: ['00:20.045', '01:45.233'],
      D1: ['00:03.045', '02:16.779'],
      D2: ['00:03.045', '02:46.779'],
      D3: ['00:20.045', '02:16.779'],
      D4: ['00:08.045', '02:46.779'],
    },
    damages: [
      {
        time: '00:02.045',
        name: '新式超豪华野蛮大乱击',
        type: 'physical',
        value: '40000',
      },
      {
        name: '四连指向、定格＆播放',
        time: '00:08.045',
        type: 'magical',
        value: '200000',
      },
      {
        name: '野蛮碎击',
        time: '00:18.045',
        type: 'magical',
        value: '200000',
      },
      {
        name: '野蛮碎击',
        time: '00:19.045',
        type: 'magical',
        value: '200000',
      },
      {
        name: '野蛮碎击',
        time: '00:20.045',
        type: 'magical',
        value: '200000',
      },
      {
        name: '野蛮碎击',
        time: '00:21.045',
        type: 'magical',
        value: '200000',
      },
      {
        name: '野蛮碎击',
        time: '00:22.045',
        type: 'magical',
        value: '200000',
      },
      {
        name: '石化波动',
        time: '00:48.045',
        type: 'magical',
        value: '200000',
      },
      {
        name: '野蛮电火花',
        time: '01:08.045',
        type: 'magical',
        value: '200000',
      },
    ] as DamageInfo[],
  },
}
