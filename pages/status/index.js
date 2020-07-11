// pages/status/index.js
var e = require("../../utils/trade.js"),
  // t = require("../../utils/token.js"),
  // r = require("../../utils/request.js"),
  a = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: '', // 成功或失败状态
    desc: '', // 描述
    url: '../index/index', // 要返回的页面地址
    title: '提示', // 页面标题
    openType: 'redirect', // 返回页面的跳转方式 具体值参考小程序API
  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (e) {
    console.log(e)
    var ts = this;
    if (e.status == 'success') {
      ts.setData({ desc: '成功支付' + e.price, title: e.title, status: e.status })
    } else { ts.setData({ desc: '支付失败!', title: e.title, status: e.status }) }
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})