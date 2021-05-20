import {request} from '../../request/index'
import {showModal} from '../../utils/wxapi'
let isSend = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showKeyword: '',
    hotList: [], // 热搜榜数据
    searchContent: '',  // 用户输入的表单项数据
    searchList: [],  // 关键字模糊匹配的数据
    // isSearchListShow: false,
    historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData()
    // 获取历史记录
    this.getSearchHistory()
  },

  // 获取本地历史记录的函数
  getSearchHistory() {
    // 获取本地存储的历史记录
    const historyList = wx.getStorageSync('searchHistory');
    if(historyList) {
      this.setData({
        historyList
      })
    }
  },

  // 获取默认搜索关键字
  async getInitData() {
    const keyword = await request('/search/default')
    const hotListData = await request('/search/hot/detail')
    this.setData({
      showKeyword:keyword.data.showKeyword,
      hotList: hotListData.data
    })
  },

  // 表单项内容发生改变的回调
  handleInputChange(e) {
    this.setData({
      searchContent: e.detail.value.trim()
    })
    if(!isSend) {
      return
    }
    isSend = false
    this.getSearchList()
    setTimeout(async () => {
      isSend = true
    }, 300);
  },

  async getSearchList() {
    const {searchContent} = this.data
    if(!searchContent) {
      this.setData({
        searchList: [],
      })
      return
    }
    // 发请求获取关键字模糊匹配数据
    // this.setData({
    //   isSearchListShow: true
    // })
    const searchListData = await request('/search', {keywords: searchContent, limit: 10})
    this.setData({
      searchList: searchListData.result.songs
    })
  },

  // 清空搜索内容
  handleClearSearch() {
    this.setData({
      searchContent: '',
      searchList: []
    })
  },

  // 删除搜索历史记录
  async deleteSearhHistory() {
    const result = await showModal({content: '确认删除吗？'})
    if(result.confirm) {
      //清空data中的historyList
      this.setData({
        historyList: []
      })
      // 删除本地历史记录
      wx.removeStorageSync('searchHistory');
    } else if(result.cancel) {
      console.log('用户点击了取消')
    }
    
  },
  // 增加历史记录
  addSearchHistory(e) {
    const {content} = e.currentTarget.dataset
    const {name} = content
    const {historyList} = this.data
    //将搜索的关键字添加到历史记录里面
    if(historyList.indexOf(name) !== -1) {
      let index = historyList.indexOf(name)
      historyList.splice(index, 1)
    }
    historyList.unshift(name)
    // historyList.forEach(item => {
    //   if(item === searchContent) {
    //     return
    //   } 
    //   historyList.unshift(searchContent)
    // })
    // 将搜索历史记录存储到本地
    wx.setStorageSync('searchHistory', historyList);
  },
  // 取消搜索的函数
  cancelSearch() {
    this.setData({
      searchContent: '',
      searchList: []
    })
  }
})