<template>
  <div class="dt-pages user-agreement-page">
    <div class="dt-header">
      <dtHeader title="隐私政策" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
      <div class="text-content">
        <p>为向您提供更准确地个性化服务，在您使用保小秘产品或服务的过程中，我们可能会以如下方式收集和使用您提供的个人信息，本声明解释了这些情况下的信息收集和使用情况。保小秘非常重视对您的个人隐私的保护，在您使用保小秘产品和服务前，请您仔细阅读以下声明。</p>
        <p>我们收集以下信息： </p>
        <p> 获取用户姓名、身份证号、联系方式、地理位置以及其他根据具体服务的需要必要收集的信息。 </p>
        <p>作为用户，您可以查看您提供给我们的个人信息；如果您的个人信息有误，请联系我们的客服人员。</p>

        <p class="tit">一、收集资料的方法</p>
        <p>保小秘将会收集及存储您在旗下产品客户端输入的资料，或通过其他渠道向我们提供的信息。我们亦会从关联词、商业伙伴及其他独立第三方资料来源，获取与您有关并合法收集的个人或非个人资料 ；</p>
        <p>您在相关站点及其他供应商所作的隐私设定，可限制或阻止我们对有关资料的查阅；若您提供个人资料予我们，即表示您接受，保小秘将在您所需期限内留存您的资料以履行有关用途，您的资料将在遵守适用相关法律及规定的情况下收集。</p>

        <p class="tit">二、收集个人资料可做以下用途</p>
        <p>提供保小秘产品中所包含的相关服务；</p>
        <p>凡适科技（天津）有限公司旗下网站及APP管理；</p>
        <p>用户身份认证、客户服务、安全防范、诈骗监测、存档和备份用途，确保我们向您提供的产品的安全性；如果我们监测到您使用我们的服务用于欺诈或非法目的，我们将会相应采取措施停止服务；</p>
        <p>向您推送最新的资讯和活动方案；</p>
        <p>设计全新或改善目前所提供的产品及服务；</p>
        <p>服务内容个性化更新；</p>
        <p>协助执行法例、警方或其他政府监管机构调查，以及遵守适用法律和规例所实行的规定，或其他向政府机构承诺之义务；</p>
        <p>在收集之时所通知的其他用途；及与上述任何项目有关的其他用途。</p>
        <p>可能向您发送的信息：</p>
        <p>为保证服务完成所需的验证码；</p>
        <p>使用产品或服务时所必要的推送通知；</p>
        <p>关于保小秘产品或服务的新闻、特别优惠及促销活动消息。</p>

        <p class="tit">三、信息安全及隐私保护措施</p>
        <p>凡适科技（天津）有限公司及其关联公司采用严格的安全制度来确保我们收集的信息不丢失、不被滥用和变造；</p>
        <p>我们使用行业通行的安全技术和程序，来保护您的个人信息不被未经授权的访问、使用或泄露；</p>
        <p>为更好地提供服务升级产品，我们可能会将我们获得的数据提供给第三方用于分析统计。在提供服务的过程中，我们也会使用第三方的产品或服务。以上第三方企业或个人，只有在必须得情况下才会接触到用户信息，同时他们都受到严格的保密条款的约束；</p>
        <p>请注意，任何安全系统都存在可能的及未知的风险。</p>

        <p class="tit">四、变更</p>
        <p>随着保小秘服务的进一步提升，隐私声明的内容会随时更新，更新后的隐私声明一旦在网页上公布即有效代替原来的隐私声明。</p>

      </div>
    </div>
  </div>
</template>
<script>
import dtHeader from "@/components/dtHeader";
import { getDevice } from "@/config/utils.js";
export default {
  name: "userAgreement",
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

.user-agreement-page {
  background: #fff;
  .dt-content {
    overflow: auto;
    position: relative;
    padding: 30px;
    -webkit-overflow-scrolling: touch;
  }
  .title {
    font-weight: bold;
    font-size: 30px;
    text-align: center;
  }
  .text-content {
    line-height: 50px;
    font-size: 26px;
    p {
      margin-top: 10px;
      text-indent: 24px;
    }
    .tit {
      font-weight: bold;
      text-indent: 0;
    }
  }
}
</style>
