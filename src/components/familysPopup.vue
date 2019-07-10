<template>
  <div class="family-popup">
    <x-dialog v-model="showDialog" class="dialog-demo dialog-adds">
      <div class="dialog-save dialog-adds-box">
        <h5>是否将保单添加至已有家庭？</h5>
        <div class="del-select">
          <ul class="radio">
            <li v-for="(item,index) in initData" :key="index" @click="radioChange(index)">
              <ul v-if="Object.keys(item).length != 0" class="radio-lis">
                <li>添加到
                  <span style="color:#feb028">{{item.familyName}}的家庭</span>
                  <icon class="dt-icon round" :name="radioValue == index?'select3':'round'"></icon>
                </li>
                <li>来自{{item.familyName}}</li>
                <li>
                  <ul class="round-peoples">
                    <li :class="v.isMain == 1?'is-trusteeship':'no-trusteeship'" v-for="(v,i) in item.customerVoList" :key="i">{{v.customerAlias | formatName}}</li>
                  </ul>
                </li>
              </ul>
              <span v-if="Object.keys(item).length == 0">新建家庭</span>
              <icon v-if="Object.keys(item).length == 0" class="dt-icon round" :name="radioValue == index?'select3':'round'"></icon>
            </li>
          </ul>
          <x-button type="primary" @click.native="enter">确定</x-button>
        </div>
      </div>
      <div class="close-icon" @click="closeClick">
        <span class="vux-close"></span>
      </div>
    </x-dialog>
  </div>
</template>
<script>
import { XDialog, XButton } from "vux";
export default {
  components: {
    XDialog,
    XButton
  },
  data() {
    return {
      radioValue: null
    };
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    initData: {
      type: Array,
      default: []
    }
  },
  watch: {},
  created() {},
  filters: {
    formatName(val) {
      if (val) {
        if (val.length > 2) {
          return val.substring(val.length - 2, val.length);
        } else {
          return val;
        }
      }
    }
  },
  methods: {
    closeClick() {
      this.$emit("closePopup", false);
    },
    enter() {
      this.$emit("enter", this.initData[this.radioValue]);
    },
    radioChange(i) {
      console.log(i);
      console.log(this.initData[i]);
      this.radioValue = i;
    }
  }
};
</script>
<style  lang="less">
.family-popup {
  .weui-cell:before,
  .weui-cells:before,
  .weui-cells:after {
    border: none !important;
  }
  .dialog-adds {
    .dialog-save {
      padding: 30px 20px;
      .name-weight {
        font-size: 36px;
      }
      h5 {
        margin-top: 30px;
        margin-bottom: 70px;
        color: #333;
        font-size: 34px;
        padding: 0 16px;
      }
      button {
        width: 240px;
        height: 80px;
        font-size: 30px;
      }
      .weui-btn_primary {
        background-color: #28c76a;
        font-weight: bold;
      }
      .del-select {
        margin-top: 30px;
        border-top: 2px solid #e8e8e8;
        > h5 {
          margin-bottom: 0px !important;
        }
        .radio {
          text-align: left;
          width: 490px;
          margin: 10px auto;
          > li {
            padding: 0 30px;
            line-height: 80px;
          }
          span {
            font-size: 30px;
            color: #666;
          }
          .round {
            width: 28px;
            height: 28px;
            // vertical-align: text-top;
            float: right;
            margin-top: 26px;
          }
        }
        button {
          width: 100%;
        }
      }
    }
    .dialog-adds-box {
      padding: 40px 0 20px;
      .radio {
        margin: 0 !important;
        width: 100% !important;
        > li:first-child {
          border: none;
          padding-top: 0px !important;
        }
        > li:last-child {
          padding-top: 10px !important;
        }
        > li {
          border-top: 2px solid #eee;
          margin-bottom: 28px;
          padding-top: 28px !important;
          .radio-lis {
            > li {
              line-height: 40px;
            }
            .round {
              margin-top: 6px;
            }
            .round-peoples {
              // li:first-child {
              //   margin-left: 0;
              // }
              li {
                margin: 6px 6px 6px 0;
                width: 60px;
                height: 60px;
                line-height: 60px;
                border-radius: 50%;
                font-size: 22px;
                text-align: center;
                display: inline-block;
                overflow: hidden;
                vertical-align: middle;
              }
              .is-trusteeship {
                background-color: #95e4b6;
                color: #fff;
                border: 2px solid #95e4b6;
              }
              .no-trusteeship {
                background-color: #fff;
                color: #95e4b6;
                border: 2px solid #95e4b6;
              }
            }
          }
        }
      }

      .del-select {
        border: none;
        padding: 0 20px;
      }
      h5 {
        text-align: center;
        padding-bottom: 20px !important;
        margin-bottom: 0px !important;
        border-bottom: 2px solid #28c76a;
      }
      .radio-lis {
        li:nth-child(1) {
          color: #333;
        }
        li:nth-child(2) {
          color: #999;
          font-size: 28px;
        }
      }
    }
  }
  .weui-dialog {
    border-radius: 8px;
  }

  .close-icon {
    display: inline-block;
    position: absolute;
    top: 20px;
    right: 20px;
  }
}
</style>