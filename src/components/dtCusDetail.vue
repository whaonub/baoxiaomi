<template>
  <div v-transfer-dom :class="{ios:$store.state.device=='ios',iPhoneX:$store.state.device=='iPhoneX'}">
    <popup v-model="value" position="right" width="100%">
      <div class="dt-pages fixed-bottom custdetail-page">
        <div class="dt-header">
          <dt-header title="客户详细信息" :leftBack="false" @headerLeft="backList"></dt-header>
        </div>
        <div class="dt-content" v-if="isShow">
          <Scroll  ref="dtCusDetail">
            <div class="wrapper">
              <div class="info-card">
                <group>
                  <flexbox :gutter="0">
                    <flexbox-item :span="3/4">
                      <cell title="姓名" value-align="left" class="fz26 ml34 mt34">
                        <span class="ml20">{{ data.customerName || "" }}</span>
                      </cell>
                      <flexbox :gutter="0">
                        <flexbox-item :span="1/3">
                          <cell title="性别" value-align="left" class="fz26 ml34 mt34">
                            <span class="ml20">{{ data.gender === "M" ? "男" : "女"}}</span>
                          </cell>
                        </flexbox-item>
                        <flexbox-item :span="2/3">
                          <cell title="年龄" value-align="left" class="fz26 ml34 mt34">
                            <span class="ml20">{{ data.age + "周岁"}}</span>
                          </cell>
                        </flexbox-item>
                      </flexbox>
                      <cell :title="data.identityType + '：'" value-align="left" class="fz26 ml34 mt45 mb42">
                        <span class="ml20">{{ data.identityNo }}</span>
                      </cell>
                    </flexbox-item>
                    <flexbox-item>
                        <img :src="pic" alt="" class="img-box">
                    </flexbox-item>
                  </flexbox>
                </group>
              </div>

              <div class="tele-info" v-if="currentPhoneId !== ''">
                <group>
                  <!-- 标题 -->
                  <flexbox class="title-box">
                    <flexbox-item>
                      <div class="fz26 title-name">常用通讯信息</div>
                    </flexbox-item>
                  </flexbox>
                  
                  <flexbox class="minh90 line" v-for="item in data.phones" :key="item.phoneId" @click.native="currentPhoneId = item.phoneId">
                    <flexbox-item :span="7/8">
                      <cell :title="item.phoneType  + '：'" value-align="left" class="fz26 ">
                        <span class="ml20">{{ item.mobile }}</span>
                      </cell>
                    </flexbox-item>
                    <flexbox-item>
                      <div class="rg">
                        <icon class="icon dt-icon active" :name="currentPhoneId === item.phoneId ? 'cicle-selected' : 'cicle-unselected'" :class="currentPhoneId === item.phoneId ? 'active' : 'unactive'"
                        ></icon>
                        <!-- @click.native="currentPhoneId = item.phoneId" -->
                      </div>
                    </flexbox-item>
                  </flexbox>
                </group>
              </div>

              <div class="address-info" v-if="currentAddressId !== ''">
                <group>
                  <!-- 标题 -->
                  <flexbox class="title-box">
                    <flexbox-item>
                      <div class="fz26 title-name">常用地址信息</div>
                    </flexbox-item>
                  </flexbox>

                  <flexbox class="line address-content" v-for="item in data.addresses" :key="item.addressId" @click.native="currentAddressId = item.addressId">
                    <flexbox-item :span="7/8">
                      <cell title="电子邮箱：" value-align="left" class="fz26">
                        <span class="ml20">{{ data.email }}</span>
                      </cell>
                      <cell :title="item.addressType  + '：'" :border-intent="false" value-align="left" class="fz26 mt20">
                        <span class="pl20 text-box">{{ item.address }}</span>
                      </cell>
                    </flexbox-item>
                    <flexbox-item>
                      <div class="rg">
                        <icon class="icon dt-icon active" :name="currentAddressId === item.addressId ? 'cicle-selected' : 'cicle-unselected'" :class="currentAddressId === item.addressId ? 'active' : 'unactive'"
                        ></icon>
                      </div>
                    </flexbox-item>
                  </flexbox>
                </group>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="dt-footer singer-btn" v-if="isShow">
          <flexbox :gutter="0">
            <flexbox-item align="center">
              <div class="dt-btn-box fz30">
                <div class="dt-btn" @click="back">确定</div>
              </div>
            </flexbox-item>
          </flexbox>
        </div>

        <Tips :tips="nowTips" @refresh="refresh" v-if="showTips"></Tips>
      </div>
    </popup>
  </div>
</template>
<script>
import DtHeader from "@/components/dtHeader"
import Scroll from "@/components/baseScroll"
import Tips from "@/components/tips"
import { defaultCustomerPic } from "@/assets/data/customer_pic.js"

import { Group, Flexbox, FlexboxItem, Cell, Divider, Popup,TransferDom } from "vux"

import { fetchDics, getDic } from "@/config/utils.js"
import api from "@/api/index"

export default {
  directives: {
    TransferDom
  },
  props:{
    value: {
      type: Boolean,
      required: true
    },
    customerId: {
      type: String,
      require: true,
      default: ""
    }
  },
  components: {
    Popup,
    DtHeader,
    Scroll,
    Tips,
    Group,
    Flexbox,
    FlexboxItem,
    Cell,
    Divider
  },
  data() {
    return {
      data: null,
      dataBack: {},
      currentPhoneId: "",
      currentAddressId: "",
      customerPic: defaultCustomerPic,
      dicConfigList: [{
          id: "core.identityType",
          property: "identityType",
          force: false
        },
        {
          id: "customer.phoneType",
          property: "phoneType",
          force: false
        },
        {
          id: "customer.addressType",
          property: "addressType",
          force: false
        }
      ],
      pic: "",
      showTips: false,
      nowTips: "tips4"
    }
  },
  created() {},
  computed: {
    isShow() {
      return this.data != null
    }
  },
  methods: {
    async init() {
      let ctx = this
      try {
        ctx.showTips = false
        await this.setDicData()
        let result = await api.getCustomerDetail({
          customerId: this.customerId
        })
        if (result.status !== "1") {
          throw (result)
        }

        if (!result.data.data || result.data.data.length == 0) {
          ctx.nowTips = "tips3"
          throw("")
        }
        ctx.data = ctx._.cloneDeep(result.data.data)
        ctx.dataBack = ctx._.cloneDeep(result.data.data)

        ctx.$nextTick(function(){
          if (ctx.$refs.dtCusDetail) {
            ctx.$refs.dtCusDetail.refresh()
          }
        })

        ctx.dicIdtoText(ctx.data)
        ctx.pic = ctx.getPic()

        ctx.currentPhoneId = (ctx.data.phones && ctx.data.phones.length > 0) ? ctx.data.phones[0].phoneId : ""
        ctx.currentAddressId = (ctx.data.phones && ctx.data.addresses.length > 0) ? ctx.data.addresses[0].addressId : ""
      } catch (e) {
        ctx.showTips = true
        console.log(e)
      }
    },
    async setDicData() {
      let arr = []
      for (let i = 0; i < this.dicConfigList.length; i++) {
        if (!this.$store.state.dicMap.has(this.dicConfigList[i].id)) {
          arr.push(this.dicConfigList[i].id)
        }
      }
      if (arr.length === 0) { return }
      let result = await api.dicsQueryDics(arr)
      if (result.data) {
        for (let i = 0; i < arr.length; i++) {
          this.$store.commit("setDicMap",{ key:arr[i], list:result.data[arr[i]] })
        }
      }
    },
    refresh() {
      this.init()
    },
    getDicData(dicName) {
      if (!dicName) return 
      let arr = this.$store.state.dicMap.get(dicName)
      return arr.dicItems
    },
    getPic() {
      let pic = "#"
      if (this.data.gender == "M") {
        if (this.data.age <= 20) {
          pic = this.customerPic.male.male1;
        } else if (this.data.age > 20 && this.data.age <= 40) {
          pic = this.customerPic.male.male2;
        } else if (this.data.age > 40 && this.data.age <= 60) {
          pic = this.customerPic.male.male3;
        } else if (this.data.age > 60) {
          pic = this.customerPic.male.male4;
        }
      } else {
        if (this.data.age <= 20) {
          pic = this.customerPic.famale.famale1;
        } else if (this.data.age > 20 && this.data.age <= 40) {
          pic = this.customerPic.famale.famale2;
        } else if (this.data.age > 40 && this.data.age <= 60) {
          pic = this.customerPic.famale.famale3;
        } else if (this.data.age > 60) {
          pic = this.customerPic.famale.famale4;
        }
      }
      if (pic === "#") {
        return pic
      }
      return "data:iamge/png;base64," + pic
    },
    backList() {
      this.$emit("input", false)
      this.$emit("detail-back", true)
    },
    back() {
      let data = {}
      let ctx = this

      // TODO: 逻辑补充，部分用户可能没有对应的联系方式和地址
      ctx._.each(ctx.dataBack, (obj, key) => {
        if (typeof obj !== "object") {
          data[key] = obj
        } else if (ctx._.isArray(obj) && key === "phones") {

          if (ctx.currentPhoneId !== "") {
            data[key] = ctx._.find(ctx.dataBack[key], o => o.phoneId === ctx.currentPhoneId)
          } else {
            data[key] = null
          }
        } else if (ctx._.isArray(obj) && key === "addresses") {
          if (ctx.currentAddressId !== "") {
            data[key] = ctx._.find(ctx.dataBack[key], o => o.addressId === ctx.currentAddressId)
          } else {
            data[key] = null
          }
        }
      })
      ctx.$emit('slelect-data', data)
      ctx.$emit('input', false)
    },
    dicIdtoText(data) {
      let ctx = this

      let dic = {}
      ctx._.each(ctx.dicConfigList, o => {
        dic[o.id] = ctx.getDicData(o.id)
      })

      ctx._.each(ctx.dicConfigList, dicObj => {
        if (dicObj.property === "identityType") {
          data.identityType = valueToName(data.identityType, dic[dicObj.id]) || ""
        } else if (dicObj.property === "phoneType") {
          ctx._.each(data.phones, phoneObj => {
            phoneObj.phoneType = valueToName(phoneObj.phoneType, dic[dicObj.id]) || ""
          })
        } else if (dicObj.property === "addressType") {
          ctx._.each(data.addresses, addressObj => {
            addressObj.addressType = valueToName(addressObj.addressType, dic[dicObj.id]) || ""
          })
        }
      })
      
      function valueToName(value, dic) {
        let obj = ctx._.find(dic, o => {
          return o.dicItemCode === value
        })
        if (obj) {
          return obj.dicItemName || ""
        }
      }
    }
  },
  watch:  {
    value(val) {
      if (val) {
        this.currentPhoneId = ""
        this.currentAddressId = ""
        this.data = null
        this.dataBack = {}
        this.showTips = false
        this.nowTips = "tips4"
      }
    },
    customerId(val) {
      if (!val) { return }
      this.init()
    }
  }
}
</script>
<style lang="less" scoped>
@dt-bbbbbb: #bbbbbb;
@dt-f9545: #f95454;
@dt-ffffff: #ffffff;
@dt-iconcolor: #dedede;
.ml34 { margin-left: 34px; }
.ml20 { margin-left: 20px; }
.mt34 { margin-top: 34px; }
.mt45 { margin-top: 45px; }
.mt25 { margin-top: 25px; }
.mt20 {margin-top: 20px; }
.mb42 { margin-bottom: 42px; }
.pl20 { padding-left: 20px; }
.minh { min-height: 100px; }
.minh60 { min-height: 60px; }
.minh90 { min-height: 90px; }
.active { color: @dt-f9545; }
.unactive { color: #999999; }
.text-box { display: inline-block; }
.rg { text-align: right; }
.wrapper { overflow: hidden; }
.line { border-top: 2px solid @dt-iconcolor; }
.singer-btn {
  background-color: @dt-f9545;
  color: @dt-ffffff;
}
.bg-ffffff { background-color: @dt-ffffff;}

.custdetail-page {
  width: 750px;
  .info-card {
    margin: 0 20px;
    background: rgba(255, 255, 255, 1);
    border-radius: 14px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.11);
  }
  .title-box {
    padding: 41.5px 0;
    .title-name {
      height: 30px;
      line-height: 30px;
      font-weight: bold;
      padding-left: 14px;
      margin: 0 auto;
    }
    &::before {
      content: " ";
      height: 30px;
      border-left: 8px solid @dt-f9545;
      background: rgba(249, 84, 84, 1);
    }
  }
  .tele-info {
    margin-top: 11px;
    padding: 0 20px;
    background-color: @dt-ffffff;
  }
  .address-info {
    margin-top: 11px;
    padding: 0 20px;
    margin-bottom: 50px;
    background-color: @dt-ffffff;

    .address-content {
      padding: 20px 0;
    }
  }
  .img-box {
    height: 160px;
  }
}
</style>

