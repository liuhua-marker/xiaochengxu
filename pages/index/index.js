//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
const t = require('../../utils/trade')

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
  bindViewTap: function () {
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
    } else if (this.data.canIUse) {
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
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    console.log(this.data.userInfo);

  },
  // 转发
  onShareAppMessage: function (option) {
    console.log(option);
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "标题",        // 默认是小程序的名称(可以写slogan等)
      path: '/pages/login/index',        // 默认是当前页面，必须是以‘/’开头的完整路径
      imgUrl: '../../images/navbackgroud.jpgs',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log('success', res);
        }
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      }
    }
    // // 来自页面内的按钮的转发
    // if (option.from == 'button') {
    //   // 此处可以修改 shareObj 中的内容
    //   shareObj.path = `/pages/login/index`;
    // }
    // 返回shareObj
    return shareObj;
  },
  // 支付
  aaaa() {
    console.log(Date.parse(new Date())/1000);
  },
  

gopay:function(payRes){
  console.log(payRes)
  
  var ts = this
  ts.setData({
    ssn: t.tradeno(), //前端流水号
    price: payRes.currentTarget.dataset.num/100
  })
  //调用预订单接口，得到返回值
  e.request('/managementchanel/woaPresettlement?parkid=' + a.globalData.parkid, {
    txnNum: '',//交易类型
    corporation: '',//法人编号
    mchntNo: '', //商户号
    payAcctInfo: [{
      acctType: '03',//支付账户类型00-零钱账户，01-积分账户，02-卡券账户，03-微信账户
      transCcy: 'CNY',//交易币种
      transAmt: payRes.currentTarget.dataset.num,//交易金额（单位：分）
    }],
    goodDesc: "",//商品描述
    traceNo: ts.data.ssn,//交易流水号
    termIp: '10.10.10.11',//终端IP地址
    tradeType: 'JSAPI',//交易支付类型
    openId: wx.getStorageSync('openid'),//用户标识
    usr_num: payRes.currentTarget.dataset.id,//车牌号
  }, 'POST').then((res) => {
    //根据返回值，调用wx.支付接口
    if ((res.statusCode + '').indexOf('20') === 0) {
      wx.requestPayment({
        timeStamp: res.data.timeStamp,//支付时间戳
        nonceStr: res.data.nonceStr,//随机字符串
        package: res.data.payPackage,//支付数据包
        signType: res.data.signType,//签名方式
        paySign: res.data.paySign,//支付签名域
        success(res) {
          //跳转页面之前，再去查询支付结果
          ts.updateOrder(payRes.currentTarget.dataset.id);
        },
        fail(res) {
          wx.showToast({title: '微信支付发起失败',icon: 'none'})
        },
      });
    } else {
      wx.showToast({title: '微信支付发起失败',icon: 'none'})
    }
  });
},
//查询支付结果，跳转页面
updateOrder(usr_num) {
  var that = this;
  //支付成功回调，获取预订单，参0数：账户流水号，调查询接口
  e.request('/managementchanel/checkPayResult?parkid=' + a.globalData.parkid, {usr_num: usr_num}, 'POST').then((res) => {
    if (res.data.pay_status == '3') {
      setTimeout(() => {
        wx.redirectTo({
          url: "../status/status?desc=支付成功&price=" + res.data.bill_at/100 + "元&status=success&title=支付成功"
        });}, 1000);
    } else if (res.data.pay_status == '-3') {
      setTimeout(() => {
        wx.redirectTo({
          url: "../status/status?desc=支付失败&status=fail&title=支付失败"
        });}, 1000);
    } else{
      setTimeout(() => { that.updateOrder();}, 1200);
    }
  });
},

})
