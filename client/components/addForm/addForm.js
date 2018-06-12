// components/addForm/addForm.js
import wxValidate from '../../utils/WxValidate.js'

const ctableID = 39079 // 比赛数据表ID
const stableID = 39080 // 表演数据表ID

let app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  behaviors: ['wx://form-field'],
  properties: {
    choose:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    title: '',
    startdate: '2018-06-01',
    deadline: '2018-06-02',
    cPhone: '',
    description: '',
    sponsor: '',
    totalNum: 100,
    array: ['竞赛类', '艺术类', '体育类'],
    objectArray: [
      {
        id: 0,
        name: '竞赛类'
      },
      {
        id: 1,
        name: '艺术类'
      },
      {
        id: 2,
        name: '体育类'
      }
    ],
    index: 0,
    imageSrc: [],
    imageShow: [],
    imgPath: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    validate() {

      this.WxValidate = new wxValidate(
        {
          title: {
            required: true,
            minlength: 2
          },
          startdate: {
            required: true,
            date: true
          },
          deadline: {
            required: true,
            date: true
          },
          sponsor: {
            required: true,
            minlength: 2
          },
          cPhone: {
            required: true,
            digits: true,
            tel: true
          },
          totalNum: {
            required: true,
            digits: true
          },
          description: {
            required: true,
            minlength: 5
          }
        }
        , {
          title: {
            required: '请输入活动名称',
            title: '活动名称至少2个字'
          },
          startdate: {
            required: '请选择活动起始日期'
          },
          deadline: {
            required: '请选择活动截止日期'
          },
          sponsor: {
            required: '请输入主办方',
            sponsor: '主办方名称至少两个字'
          },
          cPhone: {
            required: '请输入联系人电话',
            cPhone: '请输入正确的电话号码'
          },
          totalNum: {
            required: '请输入最大活动参与人数'
          },
          description: {
            required: '请输入活动详情',
            description: '活动详情需至少5个字描述'
          }
        }
      )
    },
    bindPickerChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        index: e.detail.value
      })
    },
    bindstartDateChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        startdate: e.detail.value
      })
    },
    binddeadlineChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        deadline: e.detail.value
      })
    },
    formSubmit (e) {

      console.log(e)

      this.validate()

      let that = this

      if (!this.WxValidate.checkForm(e)) {
        const error = this.WxValidate.errorList[0]
        //提示信息  
        console.log(error)

        wx.showModal({
          title: '提示',
          content: error.msg,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })

        return false
      }else{
        wx.showToast({
          title: '后台奋力提交中...',
          icon: 'loading'
        })
        wx.getStorage({
          key: 'user',
          success: function (res) {
            if (that.properties.choose === 'activity') {
              that.addData(ctableID, res.data, e.detail.value)
            } else {
              that.addData(stableID, res.data, e.detail.value)
            }
          }
        })
      }
    },
    showImgs (e) {
      console.log(this.data,e)
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: this.data.imageSrc // 需要预览的图片http链接列表
      })
    },
    chooseImgs () {

      let that = this

      wx.chooseImage({
        count: 5, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths
          let imgShow = []
          for (let i = 0; i < tempFilePaths.length; i++){
            imgShow.push(true)
          }
          that.setData({
            imageSrc: tempFilePaths,
            imageShow: imgShow
          })
        }
      })

    },
    uploadImgs (imgPath) {
      let that = this
      let MyFile = new wx.BaaS.File()
      let fileParams = { filePath: imgPath }
      // let metaData = { categoryName: '' }

      MyFile.upload(fileParams).then(res => {
        /*
         * 注: 只要是服务器有响应的情况都会进入 success, 即便是 4xx，5xx 都会进入这里
         * 如果上传成功则会返回资源远程地址,如果上传失败则会返回失败信息
         */

        let data = res.data  // res.data 为 Object 类型

        that.data.imgPath.push(data.path)

      }, err => {

      })

    },
    addData(tableID,userData,value) {
      let that = this
      let Product = new wx.BaaS.TableObject(tableID)
      let product = Product.create()

      this.data.imageSrc.forEach((item,index)=>{
        this.uploadImgs(item)
      })

      let insertData = {
        title: value.title,
        cPhone: value.cPhone,
        deadline: value.deadline,
        startDate: value.startdate,
        detail: value.detail,
        sponser: value.sponser,
        builderOpenId: userData.openid,
        builderName: userData.name,
        totalPeople: value.totalPeople,
        type: value.index,
        posters: this.data.imgPath
      }

      console.log(insertData)

      product.set(insertData).save().then(res => {
        // success
        console.log(app.globalData)

        wx.showToast({
          title: '提交成功,请耐心等待管理员审核',
          icon: 'none',
          duration: 1500,
          success () {
            wx.navigateTo({
              url: '../active/active'
            })
          }
        })
        
      }, err => {
        // err
      })

    }
  }
})
