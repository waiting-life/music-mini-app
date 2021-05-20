import PubSub from 'pubsub-js'

import {request} from '../../request/index'
import {showToast} from '../../utils/wxapi'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendList: [],
    index: 0  // 点击音乐的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleLogin()
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
    // 获取每日推荐数据
    this.getRecommendList()
    
    PubSub.subscribe('changeSongType', (_, type) => {
      // console.log(type)
      let {recommendList, index} = this.data
      const len = recommendList.length
      if(type === 'pre') {  // 上一首
        (index === 0 )&&(index = len)
        // 下面会减
        index-=1
      } else {  //  下一首
        (index === len-1)&&(index = -1)
        //下面会加
        index+=1
      }
      this.setData({
        index
      })
      const ids = recommendList[index].id
      // 将ids传给songDetail页面
      PubSub.publish('ids', ids)
    })
  },
  async handleLogin() {
    const userInfo = wx.getStorageSync('userInfo');
    // console.log(userInfo)
    if(!userInfo) {
      await showToast({title: '请先登录', icon: 'none'})
      wx.reLaunch({
        url: '/pages/login/login',
      });
    }
  },
  // 获取用户每日推荐的数据
  async getRecommendList() {
    const {recommend} = await request('/recommend/songs')
    this.setData({
      recommendList: recommend
    })
  },
  toSongDetail(e) {
    // console.log(e.currentTarget.dataset.song)
    const {song, index} = e.currentTarget.dataset
    this.setData({
      index
    })
    const ids = song.id
    wx.navigateTo({
      // 对长度有限制，所以不能用song作为参数
      // url: `/pages/songDetail/songDetail?song=${JSON.stringify(song)}`,
      url: `/pages/songDetail/songDetail?ids=${ids}`
    });
      
  }
})