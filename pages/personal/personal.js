let startY = 0
let moveY = 0
let moveDistance = 0

import {request} from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainTransform: 'translateY(0)',
    mainTransition: '',
    userInfo: {},
    recentPlayList: []  // 用户播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo =wx.getStorageSync('userInfo');
    if(userInfo) {
      userInfo = JSON.parse(userInfo)
      // console.log(userInfo)
      this.setData({
        userInfo
      })
      // 获取用户播放记录
      this.getRecentPlayList(this.data.userInfo.userId)
    }
  },
  // 获取用户播放记录
  async getRecentPlayList(userId) {
    let {allData} = await request('/user/record', {uid: userId, type: 0})
    const recentPlayList = allData.slice(0, 10)
    this.setData({
      recentPlayList
    })
    console.log(this.data.recentPlayList)
  },


  handleTouchStart(e) {
    this.setData({
      mainTransition: ''
    })
    startY = e.touches[0].clientY 
  },
  handleTouchMove(e) {
    moveY = e.touches[0].clientY
    moveDistance = moveY - startY
    if(moveDistance <= 0) {
      return 
    }
    if(moveDistance >= 60) {
      moveDistance = 60
    }
    this.setData({
      mainTransform: `translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd() {
    this.setData({
      mainTransform: 'translateY(0rpx)',
      mainTransition: 'transform .5s linear'
    })
  }, 

  // 点击跳转到登陆页面
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    });
  },
})