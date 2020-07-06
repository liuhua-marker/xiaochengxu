//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    circular: true,
    userInfo: {},
    hasUserInfo: false,
    logs: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: true, //是否显示左上角图标   true表示显示    false表示不显示(默认)
      title: '琪邦健康', //导航栏 中间的标题
      white: '#fff',
      home: false,
      // overflow: '', //导航栏是否溢出隐藏 hidden隐藏 show显示（默认）
      address: '../../images/bg.png' // 加个背景 不加就是没有
    },
    height: app.globalData.height + 20,
    imageWidth: wx.getSystemInfoSync().windowWidth,
  },
  //事件处理函数
  bindViewTap: function() {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
    console.log(this.data.userInfo);
    
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    console.log(this.data.userInfo);
    
  }
})
