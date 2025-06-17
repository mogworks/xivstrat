import type { DamageInfoData } from './damage'

export const timelineMap = {
  m5s: {
    mitigations: {
      MT: ['01:02', '02:05', '04:38', '05:54', '07:57', '09:18'],
      ST: ['00:55', '01:58', '03:57', '05:12', '06:22', '08:49'],
      D1: ['01:02', '03:57', '05:54', '09:18'],
      D2: ['00:55', '02:33', '04:38', '06:22', '09:09'],
      D3: ['01:02', '03:57', '05:54', '09:18'],
      D4: ['01:02', '03:57', '05:54', '09:18'],
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
        time: '00:58.3',
        name: '播放A/B面',
        type: 'magical',
        value: '125000',
      },
      {
        time: '02:01.6',
        name: '播放A/B面',
        type: 'magical',
        value: '125000',
      },
      {
        time: '04:35.2',
        name: '播放A/B面',
        type: 'magical',
        value: '125000',
      },
      {
        time: '05:56.6',
        name: '播放A/B面',
        type: 'magical',
        value: '125000',
      },

      // 欢庆时刻
      {
        time: '01:04.2',
        name: '欢庆时刻',
        type: 'magical',
        value: '180000',
      },
      {
        time: '02:07.6',
        name: '欢庆时刻',
        type: 'magical',
        value: '180000',
      },
      {
        time: '04:50.5',
        name: '欢庆时刻',
        type: 'magical',
        value: '180000',
      },
      {
        time: '06:03.7',
        name: '欢庆时刻',
        type: 'magical',
        value: '180000',
      },
      {
        time: '09:20.0',
        name: '欢庆时刻',
        type: 'magical',
        value: '180000',
      },
      {
        time: '09:30.2',
        name: '欢庆时刻',
        type: 'magical',
        value: '180000',
      },

      // 激热跳舞街
      {
        time: '01:16.6',
        name: '激热跳舞街',
        type: 'magical',
        value: '125000',
      },
      {
        time: '05:24.1',
        name: '激热跳舞街',
        type: 'magical',
        value: '125000',
      },

      // 尽情舞蹈！
      {
        time: '02:34.9',
        name: '尽情舞蹈！',
        type: 'magical',
        value: '95000',
      },
      {
        time: '02:37.4',
        name: '尽情舞蹈！',
        type: 'magical',
        value: '95000',
      },
      {
        time: '02:39.8',
        name: '尽情舞蹈！',
        type: 'magical',
        value: '95000',
      },
      {
        time: '02:42.3',
        name: '尽情舞蹈！',
        type: 'magical',
        value: '95000',
      },
      {
        time: '02:44.7',
        name: '尽情舞蹈！',
        type: 'magical',
        value: '95000',
      },
      {
        time: '02:47.2',
        name: '尽情舞蹈！',
        type: 'magical',
        value: '95000',
      },
      {
        time: '02:49.7',
        name: '尽情舞蹈！',
        type: 'magical',
        value: '95000',
      },
      {
        time: '02:52.1',
        name: '尽情舞蹈！',
        type: 'magical',
        value: '95000',
      },
      {
        time: '06:24.0',
        name: '尽情舞蹈！',
        type: 'magical',
        value: '95000',
      },
      {
        time: '06:26.4',
        name: '尽情舞蹈！',
        type: 'magical',
        value: '95000',
      },
      {
        time: '06:28.9',
        name: '尽情舞蹈！',
        type: 'magical',
        value: '95000',
      },
      {
        time: '06:31.3',
        name: '尽情舞蹈！',
        type: 'magical',
        value: '95000',
      },
      {
        time: '06:33.8',
        name: '尽情舞蹈！',
        type: 'magical',
        value: '95000',
      },
      {
        time: '06:36.2',
        name: '尽情舞蹈！',
        type: 'magical',
        value: '95000',
      },
      {
        time: '06:38.7',
        name: '尽情舞蹈！',
        type: 'magical',
        value: '95000',
      },
      {
        time: '06:41.1',
        name: '尽情舞蹈！',
        type: 'magical',
        value: '95000',
      },

      // 音频爆炸
      {
        time: '03:05.5',
        name: '音频爆炸',
        type: 'magical',
        value: '30000',
      },
      {
        time: '03:10.5',
        name: '音频爆炸',
        type: 'magical',
        value: '30000',
      },
      {
        time: '03:15.5',
        name: '音频爆炸',
        type: 'magical',
        value: '30000',
      },
      {
        time: '03:20.5',
        name: '音频爆炸',
        type: 'magical',
        value: '30000',
      },

      // 4/8拍节奏
      {
        time: '04:02.5',
        name: '4/8拍节奏',
        type: 'magical',
        value: '125000',
      },
      {
        time: '04:10.6',
        name: '4/8拍节奏',
        type: 'magical',
        value: '125000',
      },
      {
        time: '05:16.0',
        name: '4/8拍节奏',
        type: 'magical',
        value: '125000',
      },
      {
        time: '08:52.7',
        name: '4/8拍节奏',
        type: 'magical',
        value: '125000',
      },
      {
        time: '09:12.9',
        name: '4/8拍节奏',
        type: 'magical',
        value: '125000',
      },

      // 伴舞波动
      {
        time: '05:36.0',
        name: '伴舞波动',
        type: 'magical',
        value: '90000',
      },
      {
        time: '05:46.0',
        name: '伴舞波动',
        type: 'magical',
        value: '90000',
      },
      {
        time: '08:01.2',
        name: '伴舞波动',
        type: 'magical',
        value: '90000',
      },
      {
        time: '08:17.2',
        name: '伴舞波动',
        type: 'magical',
        value: '90000',
      },

      // 高能夜狂热
      {
        time: '10:05.7',
        name: '高能夜狂热',
        type: 'special',
        value: '9999999',
      },
    ] as DamageInfoData[],
  },
  m6s: {
    mitigations: {
      MT: ['00:05', '01:06', '02:07', '03:08', '05:02', '06:25', '07:29', '08:34', '09:56'],
      ST: ['00:52', '02:25', '06:49', '09:07', '10:08'],
      D1: ['00:05', '03:08', '05:02', '06:49', '09:56'],
      D2: ['00:52', '02:25', '04:56', '06:27', '08:34', '10:08'],
      D3: ['00:05', '02:25', '04:56', '06:27', '08:34', '10:08'],
      D4: ['00:05', '03:08', '05:02', '06:49', '09:56'],
    },
    damages: [
      {
        time: '00:11.2',
        name: '慕斯怪大雨',
        type: 'magical',
        value: '180000',
      },
      {
        time: '00:24.3',
        name: '色彩狂热',
        type: 'magical',
        value: '330000',
      },
      {
        time: '01:02.1',
        name: '色彩冲击',
        type: 'magical',
        value: '180000',
      },
      {
        time: '01:10.4',
        name: '黏黏慕斯怪',
        type: 'magical',
        value: '95000',
      },
      {
        time: '01:16.3',
        name: '爆炸',
        type: 'magical',
        value: '160000',
      },
      {
        time: '01:23.8',
        name: '色彩狂热',
        type: 'magical',
        value: '330000',
      },
      {
        time: '02:21.4',
        name: '热扩散/重热扩散',
        type: 'magical',
        value: '100000',
      },
      {
        time: '02:29.9',
        name: '黏黏慕斯怪',
        type: 'magical',
        value: '95000',
      },
      {
        time: '02:35.8',
        name: '爆炸',
        type: 'magical',
        value: '160000',
      },
      {
        time: '02:52.4',
        name: '热扩散',
        type: 'magical',
        value: '100000',
      },
      {
        time: '03:10.1',
        name: '咣当软糊怪',
        type: 'magical',
        value: '90000',
      },
      {
        time: '03:19.2',
        name: '慕斯怪大雨',
        type: 'magical',
        value: '180000',
      },
      {
        time: '03:29.4',
        name: '色彩狂热',
        type: 'magical',
        value: '330000',
      },
      {
        time: '04:44.2',
        name: '定住人的意念',
        type: 'magical',
        value: '120000',
        areaOnly: true,
      },
      {
        time: '05:06.2',
        name: '给你原石',
        type: 'magical',
        value: '200000',
      },
      {
        time: '05:23.5',
        name: '定住人的意念',
        type: 'magical',
        value: '120000',
        areaOnly: true,
      },
      {
        time: '06:29.5',
        name: '给你原石',
        type: 'magical',
        value: '200000',
      },
      {
        time: '06:53.9',
        name: '色彩狂热',
        type: 'magical',
        value: '330000',
      },
      {
        time: '07:00.0',
        name: '慕斯怪大雨',
        type: 'magical',
        value: '180000',
      },
      {
        time: '07:33.9',
        name: '糖糖火炎/闪雷',
        type: 'magical',
        value: '130000',
      },
      {
        time: '08:00.8',
        name: '百雷',
        type: 'magical',
        value: '150000',
      },
      {
        time: '08:11.3',
        name: '百雷',
        type: 'magical',
        value: '150000',
      },
      {
        time: '08:21.8',
        name: '百雷',
        type: 'magical',
        value: '150000',
      },
      {
        time: '08:32.3',
        name: '百雷',
        type: 'magical',
        value: '150000',
      },
      {
        time: '08:38.3',
        name: '软糊怪派对',
        type: 'magical',
        value: '90000',
      },
      {
        time: '08:39.4',
        name: '软糊怪派对',
        type: 'magical',
        value: '90000',
      },
      {
        time: '08:40.5',
        name: '软糊怪派对',
        type: 'magical',
        value: '90000',
      },
      {
        time: '08:41.5',
        name: '软糊怪派对',
        type: 'magical',
        value: '90000',
      },
      {
        time: '08:42.6',
        name: '软糊怪派对',
        type: 'magical',
        value: '90000',
      },
      {
        time: '09:13.1',
        name: '啪叽慕斯怪',
        type: 'magical',
        value: '45000',
      },
      {
        time: '09:15.1',
        name: '啪叽慕斯怪',
        type: 'magical',
        value: '45000',
      },
      {
        time: '09:17.1',
        name: '啪叽慕斯怪',
        type: 'magical',
        value: '45000',
      },
      {
        time: '09:19.1',
        name: '啪叽慕斯怪',
        type: 'magical',
        value: '45000',
      },
      {
        time: '09:19.2',
        name: '慕斯慕斯冲',
        type: 'magical',
        value: '160000',
      },
      {
        time: '09:27.0',
        name: '爆炸',
        type: 'magical',
        value: '30000',
      },
      {
        time: '09:53.4',
        name: '爆炸',
        type: 'magical',
        value: '30000',
      },
      {
        time: '09:58.5',
        name: '慕斯怪大雨',
        type: 'magical',
        value: '180000',
      },
      {
        time: '10:09.4',
        name: '黏黏慕斯怪',
        type: 'magical',
        value: '95000',
      },
      {
        time: '10:15.3',
        name: '爆炸',
        type: 'magical',
        value: '160000',
      },
      {
        time: '10:22.8',
        name: '色彩狂热',
        type: 'magical',
        value: '330000',
      },
      {
        time: '11:00.7',
        name: '色彩冲击',
        type: 'magical',
        value: '180000',
      },
      {
        time: '11:23.5',
        name: '狂暴',
        type: 'special',
        value: '9999999',
      },
    ] as DamageInfoData[],
  },
}
