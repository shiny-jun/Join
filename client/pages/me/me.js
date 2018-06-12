// pages/me/me.js
var app = getApp();
import { getUserInfo } from '../../utils/api/user.js'
import { getReleaserInfo } from '../../utils/api/addReleaser.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    couponsCount: 0,
    hasUserInfo: false,
    identify: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 微信用户登录小程序
    let _this = this
    wx.BaaS.login(false).then(res => {
      // 登录成功
    }, res => {
      // 登录失败
    })
    let hasUserInfo = app.globalData.login
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: hasUserInfo
    })
    if (hasUserInfo){
      getUserInfo()
    }
  },
  userInfoHandler(data) {
    let _this = this
    wx.BaaS.handleUserInfo(data).then(res => {
      _this.setData({
        userInfo:res,
        hasUserInfo:true
      })
      app.globalData.userInfo = res
      app.globalData.login = true
      getUserInfo()
      // res 包含用户完整信息，详见下方描述
    }, res => {
      
    })
  },
  changeMessage(){
    wx.navigateTo({
      url: './changeMessage/changeMessage',
    })
  },
  goJoined(e){
    let currentTab = e.currentTarget.id
    // console.log(e.currentTarget)
    wx.navigateTo({
      url: './joined/joined?currentTab=' + currentTab,
    })
  },
  goLove() {
    wx.navigateTo({
      url: './loved/loved'
    })
  },
  // 跳转发布活动/演出页
  publish() {
    wx.getStorage({
      key: 'user',
      success(res) {
        if (res.data.publishing_right) {
          wx.navigateTo({
            url: './active/active'
          })
        } else {
          let MyUser = new wx.BaaS.User()
          MyUser.get(app.globalData.userId).then(res => {
            // success
            // console.log(res.data)
            wx.setStorageSync('user', res.data)
            wx.navigateTo({
              url: './active/active'
            })
          }, err => {
            wx.showToast({
              title: '你暂无此权利',
              icon: 'none',
              duration: 1000
            })
            // err
          })
        }
      }
    })
  },
  identify() {
    wx.getStorage({
      key: 'user',
      success: function (res) {
        let id = res.data.id.toString()

        if (!getReleaserInfo(id)) {
          wx.navigateTo({
            url: './identification/identification'
          })
        } else {
          wx.showToast({
            title: '你已经提交过申请。',
            icon: 'none',
            duration: 500
          })
        }
      }
    })
  },
  tips(){
    wx.showToast({
      title: `本功能暂未开放，敬请期待！`,
      icon: 'none',
      duration: 1000
    })
  }
})