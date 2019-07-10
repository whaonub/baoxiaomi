<template>
  <div class="dt-pages drawCashHelp-page">
    <div class="dt-header">
      <dtHeader title="提现帮助" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
      <div class="text-item">
        <div class="title"><span>1</span>提现的入口在哪里？</div>
        <div class="text">
          登录后，在「 我的 」页面，点击「 我的钱包 」进入红包提现页，可查看个人在活动期间所有红包和可提现金额，点击“去提现”即可提
        </div>
      </div>
      <div class="text-item">
        <div class="title"><span>2</span>我为什么提不了现？</div>
        <div class="text">
         为保障账号安全，提现到银行卡需要绑定本人手机号、身份证号、银行卡账号等信息，（未成年人请在法定监护人的协助下绑定法定监护人的银行卡），在提现过程中，为了更好的保护用户的账号及红包余额的安全，可能适时提高安全验证手段（包括但不限于采取语音验证码验证、人脸识别等手段），同一用户每天仅可提现2次。
        </div>
      </div>
      <div class="text-item">
        <div class="title"><span>3</span>提现时无法绑定手机号？</div>
        <div class="text">
         为保障账号安全，提现到银行卡需要绑定本人手机号。每个手机号只能绑定到一个账号上，如果遇到手机号已经被绑定的情况，请更换其他手机号尝试。
        </div>
      </div>
      <div class="text-item">
        <div class="title"><span>4</span>提现时无法绑定银行卡？</div>
        <div class="text">
         支持通过银行卡提现，请确认使用的是您本人的储蓄卡，并正确填写了姓名、身份证号、银行卡号与预留手机号。
        </div>
      </div>
      <div class="text-item">
        <div class="title"><span>5</span>提现多久到账？</div>
        <div class="text">
         提现申请发起后，你的钱包现金将在3个工作日内到账，双休日、法定节假日或提现高峰顺延处理。
        </div>
      </div>
      <div class="text-item">
        <div class="title"><span>6</span>在哪里查看提现进度和到账情况？</div>
        <div class="text">
         登录后，在「 我的 」页面，点击「 我的钱包 」进入红包提现页，点击「提现记录 」查看提现历史和提现进度。
        </div>
      </div>
      <div class="text-item">
        <div class="title"><span>7</span>提现有效期多久？</div>
        <div class="text">
        提现开始日期为2018年10月1日。个人红包满10元（含10元），即可全部提现到银行卡。
        </div>
      </div>
      <div class="text-item">
        <div class="title"><span>8</span>更多反馈？</div>
        <div class="text">
        如有关于提现的问题，可到「 “我的”—“用户反馈” 」里反馈问题。
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dtHeader from "@/components/dtHeader";
import { getDevice } from "@/config/utils.js";
export default {
  name: "drawCashHelp",
  components: {
    dtHeader
  },
  data() {
    return {
      device: getDevice()
    };
  },
  created() {},
  methods: {
    goBack() {
      let device = this.device;
      if (device == "android") {
        bmAndroid.goHomePage();
      } else if (device == "ios" || device == "iPhoneX") {
        let isPc = this.$store.state.isPc;
        if (!isPc) {
          window.webkit.messageHandlers.goHomePage.postMessage(null);
        } else {
          this.$router.go(-1);
        }
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>
<style lang="less">
// 注意：在rootValue = 750px的设计稿中
// 现在 title cell 的高度为125
// 普通cell的高度为100
@dt-bbbbbb: #bbbbbb;
@dt-f9545: #f95454;
@dt-ffffff: #ffffff;
@dt-iconcolor: #dedede;

.drawCashHelp-page {
  background: #fff;
  .dt-content {
    overflow: auto;
    position: relative;
    padding: 30px;
    -webkit-overflow-scrolling: touch;
  }
  .text-item {
    padding-left: 50px;
    position: relative;
    padding-right: 10px;
    .title {
      color: #fda823;
      font-size: 28px;
      height: 32px;
      margin-top: 25px;
      margin-bottom: 25px;
      span {
        width: 36px;
        height: 36px;
        display: block;
        line-height: 36px;
        text-align: center;
        color: #fff;
        font-size: 20px;
        font-weight: 400;
        position: absolute;
        left: 0;
        top: 1px;
        background-color: #febc55;
        border-radius: 50%;
      }
    }
    .text {
      color: #666666;
      font-size: 26px;
      line-height: 45px;
    }
  }
}
</style>
