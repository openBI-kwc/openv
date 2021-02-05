<template lang="pug">
  .user-manage-box.box
    Loading(v-if="loading")
    template(v-else)
      //- 用户的添加和编辑
      Modal.user-operating(:show="showMask", @close="closeAlert", @confrim="confrim", :text="isEdit ? '编辑管理员' : '添加管理员'")
        .content
          .tabs-title
            .tab(:class="{ active :  tabActive === 0 }", @click="tabActive = 0") 基本信息
            .tab(:class="{ active :  tabActive === 1 }", @click="tabActive = 1") 分类权限
          //- 基本信息
          .inputs-from(v-if="tabActive === 0")
            .required
              i.icon &#xe692;
              | 用户名
            input.input-control(type="text", placeholder="例如：root", v-model="userInfos.username")
            .required
              i.icon &#xe692;
              | Email
            input.input-control(type="text", placeholder="例如：123456@qq.com", v-model="userInfos.mail")
            .required
              i.icon &#xe692;
              | 密码
            input(type="text" style="display:none;")
            input.input-control(type="password", placeholder="请输入密码", v-model="userInfos.pwd" autocomplete="off")
            .required
              i.icon &#xe692;
              | 角色
            Selection.select-by-bg(v-model="userInfos.character" :option="characterList")
            .required
              i.icon &#xe692;
              | 姓名
            input.input-control(type="text", placeholder="例如：张某某/Mr.wind", v-model="userInfos.name")
            .required
              i.icon &#xe692;
              | 地址
            input.input-control(type="text", placeholder="例如：北京海淀区", v-model="userInfos.adress")
            .required
              i.icon &#xe692;
              | 联系电话
            input.input-control(type="tel", placeholder="例如：13456789012", v-model="userInfos.tel")
            .required
              i.icon &#xe692;
              | 状态
              .input-control.sel-radio
                el-radio-group(v-model="userInfos.status")
                  el-radio.elradio(:label='0') 启用
                  el-radio.elradio(:label='1') 禁用
          //- 分类权限
          .assign-permissions(v-if="tabActive === 1")
            .permission(v-for="(item, index) in permissList", :key="index")
              .per-wrap
                .check-box
                  CheckBox(:value="item.check", :size="12", @input="checkQX(item)")
                .text {{item.name}}
              .per-childs(v-if="item.down")
                .child(v-for="(child, cindex) in item.childs", :key="cindex")
                  .check-box
                    CheckBox(:value="child.check", :size="12", @input="checkQX(item, child)")
                  .text {{child.name}}
      BreadCrumbs
      .list-title
        .add-btn(@click="showMask = true; showUser = true") 添加
        .del-btn.delmore(v-if="this.selectAdmins.length > 0" @click="delMoreUser") 批量删除
      .content-box
        .content-wp
          table.table-box.table-list(v-if="adminList && adminList.length")
            thead.list-header
              tr
                td.check-box
                  CheckBox(:value="checkAll", :size="12", @input="checkAllAdmin")
                td.number 序号
                td.username 用户名
                td.name 姓名
                td.character 角色
                td.time 最近登录时间
                td.status 状态
                td.option 操作
            tbody.list-body
              tr(v-for="(admin, index) in adminList", :key="index")
                td.check-box
                  CheckBox(:value="admin.check", :size="12", @input="checkAdmin(admin)")
                td.number {{(currentPage-1)*pageSize+index+1}}
                td.username {{admin.username}}
                td.name {{admin.realname | strFormat}}
                td.character {{admin.rolename}}
                td.time {{admin.lastlogintime | dateFormat}}
                td.status {{admin.status === 0 ? '启用' : '禁用'}}
                td.option
                  .operate
                    .operate-item(@click="beforeEditUser(admin.uid)") 修改
                    .operate-item(@click="delOneUser(admin.uid)") 删除
          Nodata(v-else)
      Paging.page-box(:page-index="currentPage", :total="total", :page-size="pageSize", @change="pageChange")
</template>
<script>
import { Utils, Lodash } from '@public/utils'
import validator from '@public/validator.js'
import {
  GET_SCREENGROUP,
  GET_USERLIST,
  GET_ROLE,
  USER_ADD,
  USER_UPDATE,
  GET_USER_MSG,
  GET_GROUP_MSG,
  USER_DELETE
} from '@api/authority.js'
const USER = {
  username: '',
  mail: '',
  pwd: '',
  character: '',
  name: '',
  adress: '',
  tel: '',
  status: 0
}
export default {
  data () {
    return {
      loading: true,
      isEdit: false,
      checkAll: false,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      showMask: false,
      showUser: false,
      showEditUser: false,
      // 菜单切换
      tabActive: 0,
      // 用户信息
      userInfos: Lodash.cloneDeep(USER),
      // 角色列表
      characterList: [],
      // 用户列表
      adminList: [],
      // 权限列表
      permissList: []
    }
  },
  created () {
    // 获取角色列表
    this.gtPerList()
    // 获取用户列表
    this.getUserList()
    // 获取全部用户分类权限
    this.getAllGroupList()
  },
  activated () {
    if (this.$route.meta.isActive) {
      // 获取角色列表
      this.gtPerList()
      // 获取用户列表
      this.getUserList()
      // 获取全部用户分类权限
      this.getAllGroupList()
    }
    this.$route.meta.isActive = true
  },
  filters: {
    dateFormat (value) {
      if (!value) return '暂未登录'
      return Utils.timeFormat(value, 'Y年m月d日 H:i')
    }
  },
  computed: {
    selectAdmins () {
      let array = []
      for (let key in this.adminList) {
        let item = this.adminList[key]
        if (item.check) {
          array.push(item.uid)
        }
      }
      return array
    },
    selectPerAdm () {
      let array = []
      for (let key in this.permissList) {
        let item = this.permissList[key]
        if (item.check) {
          array.push(item.sid)
        }
      }
      return array
    }
  },
  methods: {
    pageChange (page) {
      this.currentPage = parseFloat(page)
      this.getUserList()
    },
    checkAllAdmin () {
      this.checkAll = !this.checkAll
      let chall = this.checkAll
      this.adminList.forEach(admin => {
        admin.check = chall
      })
    },
    checkAdmin (admin) {
      admin.check = !admin.check
      let qx = true
      for (let admin of this.adminList) {
        if (!admin.check) {
          qx = false
          break
        }
      }
      this.checkAll = qx
    },
    // 所有分类
    getAllGroupList () {
      GET_SCREENGROUP().then(res => {
        if (!res.err) {
          let resdata = res.data
          let data = []
          for (let key in resdata) {
            let item = {}
            let resitem = resdata[key]
            item.sid = resitem.sid
            item.name = resitem.screenname
            item.check = true
            data.push(item)
          }
          this.permissList = data
        }
      })
    },
    // 获取用户列表
    getUserList () {
      let params = {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }
      GET_USERLIST(params).then(res => {
        if (!res.err) {
          this.loading = false
          this.adminList = res.data.list.map(item => {
            item.check = false
            return item
          })
          this.total = res.data.total
        }
      })
    },
    // 获取角色列表
    gtPerList () {
      GET_ROLE().then(res => {
        if (!res.err) {
          this.characterList = res.data.map(item => {
            return {
              name: item.rolename,
              value: item.rid
            }
          })
          this.character = this.characterList[0].rid
          this.userInfos.character = this.character
        }
      })
    },
    // 确认
    confrim () {
      this.isEdit ? this.editUser() : this.addUser()
    },
    // 添加用户
    addUser () {
      let info = this.userInfos
      let pwdlen = info.pwd.length
      let pwd = Utils.enBase64(info.pwd)
      info.pwdlen = pwdlen
      if (!this.fromCheck(info)) return
      if (pwdlen > 0) {
        info.pwd = pwd
      }
      let data = Object.assign(info, {adminPer: this.selectPerAdm})
      USER_ADD(data).then(res => {
        if (!res.err) {
          this.closeAlert()
          this.getUserList()
          this.$toasting({
            type: 'success',
            title: '成功',
            message: '添加用户成功'
          })
        }
      })
    },
    // 验证
    fromCheck (info) {
      let pass = true
      for (let key in info) {
        let item = info[key]
        switch (key) {
          case 'username':
            if (!item) {
              this.$toasting({
                type: 'warning',
                title: '警告',
                message: '用户名不能为空'
              })
              pass = false
            } else {
              if (/['"#$%&\\^@【】 *]/.test(item)) {
                this.$toasting({
                  type: 'warning',
                  title: '警告',
                  message: '用户名验证非法,不能包含特殊符号'
                })
                pass = false
              }
            }
            break
          case 'mail':
            if (!item) {
              this.$toasting({
                type: 'warning',
                title: '警告',
                message: '邮箱不能空'
              })
              pass = false
            } else {
              if (!validator.isEmail(item)) {
                this.$toasting({
                  type: 'warning',
                  title: '警告',
                  message: '邮箱格式不对'
                })
                pass = false
              }
            }
            break
          case 'pwd':
            if (!item) {
              if (!this.isEdit) {
                this.$toasting({
                  type: 'warning',
                  title: '警告',
                  message: '密码不能为空'
                })
                pass = false
              }
            } else {
              if (/['"#$%&\\^@【】 *]/.test(item)) {
                this.$toasting({
                  type: 'warning',
                  title: '警告',
                  message: '密码验证非法,不能包含特殊符号'
                })
                pass = false
              }
            }
            break
          case 'name':
            if (!item) {
              this.$toasting({
                type: 'warning',
                title: '警告',
                message: '名字不能为空'
              })
              pass = false
            }
            break
          case 'adress':
            if (!item) {
              this.$toasting({
                type: 'warning',
                title: '警告',
                message: '地址不能为空'
              })
              pass = false
            }
            break
          case 'character':
            if (!item) {
              this.$toasting({
                type: 'warning',
                title: '警告',
                message: '请选择角色'
              })
              pass = false
            }
            break
          case 'tel':
            if (!item) {
              this.$toasting({
                type: 'warning',
                title: '警告',
                message: '联系电话不能空'
              })
              pass = false
            } else {
              if (!validator.isPhone(item)) {
                this.$toasting({
                  type: 'warning',
                  title: '警告',
                  message: '联系电话格式不对'
                })
                pass = false
              }
            }
            break
        }
        if (!pass) return
      }
      return pass
    },
    // 修改用户
    editUser () {
      let info = this.userInfos
      if (!this.fromCheck(info)) return
      let data = Object.assign(info, {uid: this.uid, adminPer: this.selectPerAdm})
      if (!data.pwd) {
        delete data.pwd
      } else {
        let pwd = data.pwd
        data.pwdlen = pwd.length
        data.pwd = Utils.enBase64(pwd)
      }
      USER_UPDATE(data).then(res => {
        if (!res.err) {
          this.closeAlert()
          this.getUserList()
          this.isEdit = false
        }
      })
    },
    // 修改之前
    beforeEditUser (uid) {
      this.uid = uid
      this.isEdit = true
      // 查询用户信息
      GET_USER_MSG({uid}).then(res => {
        if (!res.err) {
          let resdata = res.data
          let data = {
            username: resdata.username,
            mail: resdata.email,
            pwd: resdata.pwd,
            character: resdata.role.rid,
            name: resdata.realname,
            adress: resdata.address,
            tel: resdata.phone,
            status: resdata.status
          }
          this.userInfos = data
          this.showMask = true
          this.showUser = true
        }
      })
      // 查询用户分类权限
      GET_GROUP_MSG({uid}).then(res => {
        if (!res.err) {
          let resdata = res.data
          for (let item1 of this.permissList) {
            item1.check = false
            for (let item2 of resdata) {
              if (item1.sid === item2.sid) {
                item1.check = true
              }
            }
          }
        }
      })
    },
    // 单个删除
    delOneUser (uid) {
      this.$alert({type: 'warning', msg: '确定要删除吗'}, () => {
        USER_DELETE({uid}).then(res => {
          if (!res.err) {
            this.getUserList()
          } else {
            this.$toasting({
              type: 'warning',
              message: res.data
            })
          }
        })
      })
    },
    // 多个删除
    delMoreUser () {
      let uid = this.selectAdmins
      if (!(uid.length > 0)) return
      this.$alert({type: 'warning', msg: '确定要删除吗'}, () => {
        USER_DELETE({uid}).then(res => {
          if (!res.err) {
            this.getUserList()
          }
        })
      })
    },
    // 关闭弹框
    closeAlert () {
      this.showMask = false
      this.showUser = false
      this.isEdit = false
      this.tabActive = 0
      this.userInfos = Lodash.cloneDeep(USER)
      this.userInfos.character = this.character
      for (let item1 of this.permissList) {
        item1.check = true
      }
    },
    // 选择权限
    checkQX (parent, child) {
      // 一级
      if (parent && !child) {
        parent.check = !parent.check
        let pcheck = parent.check
        if (parent.childs && parent.childs.length) {
          for (let item of parent.childs) {
            item.check = pcheck
          }
        }
      } else if (parent && child) {
        // 二级
        child.check = !child.check
        let checkAll = false
        for (let item of parent.childs) {
          if (item.check) {
            checkAll = true
            break
          }
        }
        parent.check = checkAll
      }
    }
  }
}
</script>
<style lang="less" scoped>
  // 垂直两端对齐
  .flex-center (@fa) {
    display: flex;
    justify-content: @fa;
    align-items: center;
  }
  .page-box {
    position: absolute;
    bottom: 20px;
    right: 30px;
  }
  /deep/ .popup-conten {
    width: 650px;
  }
  .user-operating .tabs-title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    display: flex;
    margin: 10px;
    .tab {
      cursor: pointer;
      width: 50%;
      text-align: center;
      font-size: 14px;
      color: #666666;
      &.active {
        color: #219AF2;
      }
    }
  }
  .assign-permissions {
    .per-wrap {
      .flex-center(flex-start);
      height: 30px;
      line-height: 30px; 
      font-size: 14px;
      color: #ffffff;
      .down-up {
        color: #333333;
        cursor: pointer;
        transform: rotate(-90deg);
        font-size: 15px;
        &.down {
          transform: rotate(0deg);
          margin-top: 0;
        }
      }
      .check-box {
        margin:  0 10px;
      }
    }
    .per-childs {
      .child {
        margin-left: 40px;
        .flex-center(flex-start);
        height: 30px;
        font-size: 12px;
        color: #333333;
        .check-box {
          margin:  0 10px;
        }
      }
    }
  }
  .list-title {
    padding: 0 30px;
    height: 64px;
    .flex-center(flex-start);
    .add-btn, .del-btn {
      width:80px;
      height:30px;
      background:rgba(24,145,255,0.5);
      border:1px solid rgba(0, 174, 255, 1);
      line-height: 30px;
      text-align: center;
      user-select: none;
      cursor: pointer;
      font-size:14px;
      color:rgba(255,255,255,0.8);
      margin-right: 10px;
    }
    .search-bar {
      .flex-center(space-between);
      width: 180px;
      height: 26px;
      padding: 0 10px;
      background: #FFFFFF;
      border: 1px solid #E9E9E9;
      border-radius: 2px;
      .search-btn {
        width: 11px;
        height: 11px;
        color: #E9E9E9;
        font-size: 18px;
        line-height: 11px;
      }
      .search-input {
        width: 160px;
        height: 100%;
        line-height: 26px;
        border: none;
        font-size: 16px;
      }
    }
  }
  .content-box {
    padding: 0 30px;
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    position: relative;
    overflow: hidden;
    padding-bottom: 50px;
    .content-wp {
      overflow: auto;
      height: 100%;
    }
    .table-box {
      tr {
        td:first-child {
          width: 50px;
          padding-left: 20px;
        }
        .operate {
          min-width: 100px;
          display: flex;
          justify-content: flex-end;
          .operate-item {
            color: #258AD7;
            cursor: pointer;
            margin-left: 15px;
            line-height: 40px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
