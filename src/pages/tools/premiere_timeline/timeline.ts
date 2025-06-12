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
      // 经典铭心
      {
        time: '00:14.2',
        name: '经典铭心',
        type: 'magical',
        value: '300000',
      },
      {
        time: '02:14.7',
        name: '经典铭心',
        type: 'magical',
        value: '300000',
      },
      {
        time: '04:43.4',
        name: '经典铭心',
        type: 'magical',
        value: '300000',
      },
      {
        time: '08:33.7',
        name: '经典铭心',
        type: 'magical',
        value: '300000',
      },

      // 播放A/B面
      {
        time: '00:38.9',
        name: '播放A/B面',
        type: 'magical',
        value: '125000',
      },
      {
        name: '00:58.3',
        time: '播放A/B面',
        type: 'magical',
        value: '125000',
      },
      {
        name: '02:01.6',
        time: '播放A/B面',
        type: 'magical',
        value: '125000',
      },
      {
        name: '04:35.2',
        time: '播放A/B面',
        type: 'magical',
        value: '125000',
      },
      {
        name: '05:56.6',
        time: '播放A/B面',
        type: 'magical',
        value: '125000',
      },

      // 欢庆时刻
      {
        name: '01:04.2',
        time: '欢庆时刻',
        type: 'magical',
        value: '180000',
      },
      {
        name: '02:07.6',
        time: '欢庆时刻',
        type: 'magical',
        value: '180000',
      },
      {
        name: '04:50.5',
        time: '欢庆时刻',
        type: 'magical',
        value: '180000',
      },
      {
        name: '06:03.7',
        time: '欢庆时刻',
        type: 'magical',
        value: '180000',
      },
      {
        name: '09:20.0',
        time: '欢庆时刻',
        type: 'magical',
        value: '180000',
      },
      {
        name: '09:30.2',
        time: '欢庆时刻',
        type: 'magical',
        value: '180000',
      },

      // 激热跳舞街
      {
        name: '01:16.6',
        time: '激热跳舞街',
        type: 'magical',
        value: '125000',
      },
      {
        name: '05:24.1',
        time: '激热跳舞街',
        type: 'magical',
        value: '125000',
      },

      // 低身舞步！
      {
        name: '02:34.9',
        time: '低身舞步！',
        type: 'magical',
        value: '95000',
      },
      {
        name: '02:37.4',
        time: '低身舞步！',
        type: 'magical',
        value: '95000',
      },
      {
        name: '02:39.8',
        time: '低身舞步！',
        type: 'magical',
        value: '95000',
      },
      {
        name: '02:42.3',
        time: '低身舞步！',
        type: 'magical',
        value: '95000',
      },
      {
        name: '02:44.7',
        time: '低身舞步！',
        type: 'magical',
        value: '95000',
      },
      {
        name: '02:47.2',
        time: '低身舞步！',
        type: 'magical',
        value: '95000',
      },
      {
        name: '02:49.7',
        time: '低身舞步！',
        type: 'magical',
        value: '95000',
      },
      {
        name: '02:52.1',
        time: '低身舞步！',
        type: 'magical',
        value: '95000',
      },
      {
        name: '06:24.0',
        time: '低身舞步！',
        type: 'magical',
        value: '95000',
      },
      {
        name: '06:26.4',
        time: '低身舞步！',
        type: 'magical',
        value: '95000',
      },
      {
        name: '06:28.9',
        time: '低身舞步！',
        type: 'magical',
        value: '95000',
      },
      {
        name: '06:31.3',
        time: '低身舞步！',
        type: 'magical',
        value: '95000',
      },
      {
        name: '06:33.8',
        time: '低身舞步！',
        type: 'magical',
        value: '95000',
      },
      {
        name: '06:36.2',
        time: '低身舞步！',
        type: 'magical',
        value: '95000',
      },
      {
        name: '06:38.7',
        time: '低身舞步！',
        type: 'magical',
        value: '95000',
      },
      {
        name: '06:41.1',
        time: '低身舞步！',
        type: 'magical',
        value: '95000',
      },

      // 音频炸弹
      {
        name: '03:05.5',
        time: '音频炸弹',
        type: 'magical',
        value: '30000',
      },
      {
        name: '03:10.5',
        time: '音频炸弹',
        type: 'magical',
        value: '30000',
      },
      {
        name: '03:15.5',
        time: '音频炸弹',
        type: 'magical',
        value: '30000',
      },
      {
        name: '03:20.5',
        time: '音频炸弹',
        type: 'magical',
        value: '30000',
      },

      // 4/8拍节奏
      {
        name: '04:02.5',
        time: '4/8拍节奏',
        type: 'magical',
        value: '125000',
      },
      {
        name: '04:10.6',
        time: '4/8拍节奏',
        type: 'magical',
        value: '125000',
      },
      {
        name: '05:16.0',
        time: '4/8拍节奏',
        type: 'magical',
        value: '125000',
      },
      {
        name: '08:52.7',
        time: '4/8拍节奏',
        type: 'magical',
        value: '125000',
      },
      {
        name: '09:12.9',
        time: '4/8拍节奏',
        type: 'magical',
        value: '125000',
      },

      // 伴舞波动
      {
        name: '05:36.0',
        time: '伴舞波动',
        type: 'magical',
        value: '90000',
      },
      {
        name: '05:46.0',
        time: '伴舞波动',
        type: 'magical',
        value: '90000',
      },
      {
        name: '08:01.2',
        time: '伴舞波动',
        type: 'magical',
        value: '90000',
      },
      {
        name: '08:17.2',
        time: '伴舞波动',
        type: 'magical',
        value: '90000',
      },

      // 舞团终演
      {
        name: '08:17.2',
        time: '舞团终演',
        type: 'special',
        value: '9999999',
      },
    ] as DamageInfo[],
  },
}
