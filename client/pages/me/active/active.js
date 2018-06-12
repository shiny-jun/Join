// pages/home/home.js
let app = getApp()
const ctableID = 39079
const stableID = 39080
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navs: [
      {
        name: '活动',
        type: 'activities'
      }, {
        name: '表演',
        type: 'show'
      }
    ],
    activities: [],
    show: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    wx.showLoading({
      title: '加载中'
    })
    let MyUser = new wx.BaaS.User()
    MyUser.get(app.globalData.userId).then(res => {
      // success
      this.getCompetedata(res.data.openid)

    }, err => {
      // err
    })
  },
  onReady () {
    console.log(this.data.activities)
  },
  onshow (options) {
  },
  add() {
    wx.navigateTo({
      url: '../add/add',
    })
  },
  getCompetedata(userId) {
    // 查询比赛表获取该用户发布的比赛
    let that = this
    let MyTableObject = new wx.BaaS.TableObject(ctableID)
    let MyTableObject2 = new wx.BaaS.TableObject(stableID)

    let query = new wx.BaaS.Query()
    MyTableObject.setQuery(query.contains('builderOpenId', userId)).find().then(res=>{
      let objects = res.data.objects
      console.log(objects.length)
      for(let i=0;i<objects.length;i++){
        let obj = {
          builderName: '',
          title: '',
          pass: false,
          joined: ''
        }

        let { builderName, title, pass, userIds } = objects[i]

        obj.builderName = builderName
        obj.title = title
        obj.joined = userIds.length
        obj.pass = pass

        console.log(obj)

        this.data.activities[i] = obj
        
        console.log(this.data.activities)
      }

      this.setData({
        activities: this.data.activities
      })

      wx.hideLoading()

      // Array.from(objects).forEach((item,index) => {

      //   let obj = {
      //     builderName:'',
      //     title: '',
      //     startDate: '',
      //     joined: ''
      //   }

      //   let { builderName, title, startDate, userIds } = item

      //   obj.builderName = builderName
      //   obj.title = title
      //   obj.joined = userIds.length

      //   console.log(obj)

      //   that.activities[index] = obj

      //   console.log(1,that.activities)
      // })
    },err=>{
      console.log(err)
    })

    MyTableObject2.setQuery(query.contains('builderOpenId', userId)).find().then(res => {
      let objects = res.data.objects
      console.log(objects.length)
      for (let i = 0; i < objects.length; i++) {
        let obj = {
          builderName: '',
          title: '',
          pass: false,
          joined: ''
        }

        let { builderName, title, startDate, userIds } = objects[i]

        obj.builderName = builderName
        obj.title = title
        obj.joined = userIds.length
        obj.pass = pass

        console.log(obj, this)

        this.data.show[i] = obj

        console.log(this.data.show)
      }

      this.setData({
        show: this.data.show
      })

    }, err => {
      console.log(err)
    })
  }
})