<template>
  <div class="dt-pages card-editTemplate-page">
    <div class="dt-header" ref="topInfo">
      <dtHeader title="选择当前模板" :leftBack="false" @headerLeft="goBack"> </dtHeader>
      <div class="template">
        <div class="current-template" v-html="initialSlideData == agentData.cardTemplate?'当前模板':'可选模板'"></div>
      </div>
    </div>

    <div class="dt-content">
      <swiper :options="swiperOption" @slideChange="swiperChange" ref="mySwiper">
        <swiper-slide>
          <div class="template-box">
            <div class="template-data" style="background:#c2d1ca">
              <div class="template-select">
                <div class="template-portrait" style="border: solid 0.004rem #a2d7dd;">
                  <img :src="agentData.photoUrl" />
                </div>
                <div class="content-template">
                  <p class="name" v-html="agentData.cardName !=undefined &&agentData.cardName !=''?agentData.cardName:'姓名'"></p>
                  <div>
                    <span class="occupation" v-html="agentData.position !=undefined &&agentData.position !=''?agentData.position:'职位名称'"></span>
                    <span class="occupation-years" v-html="yeadr !=undefined && yeadr !=''?' 从业'+yeadr+'年':'从业年限'"></span>
                  </div>
                  <div class="phone-box">
                    <img src="../../assets/imgs/Telephone.png" class="telephone" />
                    <span class="phone" style="color:#6db3bb" v-html="agentData.phoneNumber !=undefined&& agentData.phoneNumber !=''?agentData.phoneNumber:'你的手机号'"></span>
                  </div>
                </div>
                <img src="../../assets/imgs/eye.png" class="img-eye" />
                <img src="../../assets/imgs/wrist.png" class="img-wrist" />
                <img src="../../assets/imgs/keyboard.png" class="img-keyboard" />
              </div>

              <p class="autograph" v-html="agentData.sign != undefined&&agentData.sign !=''?agentData.sign:'一句话座右铭'"></p>
              <div class="select">
                <div class="select-title" v-for="(item,index) in agentData.tags" :key="index" :class="index==1?'label1':index==2?'label2':''">{{item.tagLable}}</div>
                <div class="select-title" v-if="tagsNum == 0" v-html="tagsNum ==0?'标签展示':''"></div>
              </div>
              <div class="combination">
                <div class="company">
                  <img src="../../assets/imgs/company01.png" class="company-img" />
                  <span style="color:#6db3bb" class="company-title" v-html="agentData.companyName!=undefined && agentData.companyName !=''?agentData.companyName:'公司名称' "></span>
                </div>
                <div class="weChat">
                  <img src="../../assets/imgs/weChat01.png" class="weChat-img" />
                  <span class="weChat-title" v-html="agentData.wxNumber != undefined &&agentData.wxNumber !=''?agentData.wxNumber:'你的微信号'"></span>
                </div>
                <div class="weChat">
                  <img src="../../assets/imgs/address.png" class="weChat-img" />
                  <span class="weChat-title" v-html="agentData.address != undefined && agentData.address !=''?agentData.address:'你的地址'"></span>
                </div>
              </div>
              <div>
                <div class="honor">
                  <img src="../../assets/imgs/honor.png" class="honor-img" />
                  <span class="honor-text"> 所获荣誉</span>
                </div>
                <div class="honor-conten">
                  <div class="honor-positi" v-for="(item,index) in agentData.honors" :key="index">
                    <span class="honor-box"></span>
                    <p class="honor-title">{{item.str}}</p>
                  </div>
                  <!-- 当为登入或者没有荣誉的时候展示 -->
                  <div class="honor-positi" v-if="honors == 0">
                    <span class="honor-box"></span>
                    <p class="honor-title">你的荣誉展示</p>
                  </div>
                </div>
                <div class="lately-dynamic">
                  <div class="lately-mar">
                    <div class="lately-hear">
                      <h4 class="lately-left">近期动态</h4>
                      <p class="lately-right">查看更多 <icon class="dt-icon nextIcon" name="next"></icon>
                      </p>
                    </div>
                    <div v-if="dynamicList !=null">
                      <div class="lately-title">
                        <p>{{dynamicList.message}}</p>
                      </div>
                      <div class="lately-img">
                        <div class="lately-picture" v-for="(item,index) in dynamicList.images" :key="index">
                          <img :src="item" />
                        </div>
                      </div>
                      <div class="lately-location" v-if="dynamicList.location !=''&&dynamicList.location !=undefined">
                        <img src="../../assets/imgs/adds.png" class="location-img" />
                        <span>{{dynamicList.location}}</span>
                      </div>
                      <div class="lately-tiem" v-if="dynamicList.likeNum !=undefined">
                        <div class="tiem-box">
                          <p><span>{{dynamicList.updateTime}}</span> <span>{{dynamicList.createTime}}</span></p>
                        </div>
                        <div class="tiem-right">
                          <span v-if="dynamicList.likeNum>0">{{dynamicList.likeNum}}</span>
                          <img src="../../assets/imgs/save.png" />
                        </div>
                      </div>
                    </div>
                    <div v-if="dynamicList ==null">
                      <img src="../../assets/imgs/no-entry.png" class="no-entry" />
                      <p class="lately-title1">建议您使用动态发布功能，让客户更了解你</p>
                    </div>
                  </div>
                </div>
                <div class="bont-bottom"></div>
              </div>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="template-box">
            <div class="template-data" style="background:#bdd4da">
              <div class="template-select">
                <div class="template-portrait" style="border: solid 0.004rem #9bbad6;">
                  <img :src="agentData.photoUrl" />
                </div>
                <div class="content-template">
                  <p class="name" v-html="agentData.cardName !=undefined &&agentData.cardName !=''?agentData.cardName:'姓名'"></p>
                  <div>
                    <span class="occupation" v-html="agentData.position !=undefined &&agentData.position !=''?agentData.position:'职位名称'"></span>
                    <span class="occupation-years" v-html="yeadr !=undefined && yeadr !=''?' 从业'+yeadr+'年':'从业年限'"></span>
                  </div>
                  <div class="phone-box">
                    <img src="../../assets/imgs/Telephone01.png" class="telephone" />
                    <span class="phone" style="color:#6db3bb" v-html="agentData.phoneNumber !=undefined&& agentData.phoneNumber !=''?agentData.phoneNumber:'你的手机号'"></span>
                  </div>
                </div>
                <img src="../../assets/imgs/eye.png" class="img-eye" />
                <img src="../../assets/imgs/wrist.png" class="img-wrist" />
                <img src="../../assets/imgs/keyboard.png" class="img-keyboard" />
              </div>

              <p class="autograph" v-html="agentData.sign != undefined&&agentData.sign !=''?agentData.sign:'一句话座右铭'"></p>
              <div class="select">
                <div class="select-title" v-for="(item,index) in agentData.tags" :key="index" :class="index==1?'label1':index==2?'label2':''">{{item.tagLable}}</div>
                <div class="select-title" v-if="tagsNum == 0" v-html="tagsNum ==0?'标签展示':''"></div>
              </div>
              <div class="combination">
                <div class="company">
                  <img src="../../assets/imgs/company01.png" class="company-img" />
                  <span style="color:#6db3bb" class="company-title" v-html="agentData.companyName!=undefined && agentData.companyName !=''?agentData.companyName:'公司名称' "></span>
                </div>
                <div class="weChat">
                  <img src="../../assets/imgs/weChat01.png" class="weChat-img" />
                  <span class="weChat-title" v-html="agentData.wxNumber != undefined &&agentData.wxNumber !=''?agentData.wxNumber:'你的微信号'"></span>
                </div>
                <div class="weChat">
                  <img src="../../assets/imgs/address.png" class="weChat-img" />
                  <span class="weChat-title" v-html="agentData.address != undefined && agentData.address !=''?agentData.address:'你的地址'"></span>
                </div>
              </div>
              <div>
                <div class="honor">
                  <img src="../../assets/imgs/honor.png" class="honor-img" />
                  <span class="honor-text"> 所获荣誉</span>
                </div>
                <div class="honor-conten">
                  <div class="honor-positi" v-for="(item,index) in agentData.honors" :key="index">
                    <span class="honor-box"></span>
                    <p class="honor-title">{{item.str}}</p>
                  </div>
                  <!-- 当为登入或者没有荣誉的时候展示 -->
                  <div class="honor-positi" v-if="honors == 0">
                    <span class="honor-box"></span>
                    <p class="honor-title">你的荣誉展示</p>
                  </div>
                </div>
                <div class="lately-dynamic">
                  <div class="lately-mar">
                    <div class="lately-hear">
                      <h4 class="lately-left">近期动态</h4>
                      <p class="lately-right">查看更多 <icon class="dt-icon nextIcon" name="next"></icon>
                      </p>
                    </div>
                    <div v-if="dynamicList !=null">
                      <div class="lately-title">
                        <p>{{dynamicList.message}}</p>
                      </div>
                      <div class="lately-img">
                        <div class="lately-picture" v-for="(item,index) in dynamicList.images" :key="index">
                          <img :src="item" />
                        </div>
                      </div>
                      <div class="lately-location" v-if="dynamicList.location !=''&&dynamicList.location !=undefined">
                        <img src="../../assets/imgs/adds.png" class="location-img" />
                        <span>{{dynamicList.location}}</span>
                      </div>
                      <div class="lately-tiem" v-if="dynamicList.likeNum !=undefined">
                        <div class="tiem-box">
                          <p><span>{{dynamicList.updateTime}}</span> <span>{{dynamicList.createTime}}</span></p>
                        </div>
                        <div class="tiem-right">
                          <span v-if="dynamicList.likeNum>0">{{dynamicList.likeNum}}</span>
                          <img src="../../assets/imgs/save.png" />
                        </div>
                      </div>
                    </div>
                    <div v-if="dynamicList ==null">
                      <img src="../../assets/imgs/no-entry.png" class="no-entry" />
                      <p class="lately-title1">建议您使用动态发布功能，让客户更了解你</p>
                    </div>
                  </div>
                </div>
                <div class="bont-bottom"></div>
              </div>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="template-box">
            <div class="template-data">
              <div class="template-select">
                <div class="template-portrait">
                  <img :src="agentData.photoUrl" />
                </div>
                <div class="content-template">
                  <p class="name" v-html="agentData.cardName !=undefined &&agentData.cardName !=''?agentData.cardName:'姓名'"></p>
                  <div>
                    <span class="occupation" v-html="agentData.position !=undefined &&agentData.position !=''?agentData.position:'职位名称'"></span>
                    <span class="occupation-years" v-html="yeadr !=undefined && yeadr !=''?' 从业'+yeadr+'年':'从业年限'"></span>
                  </div>
                  <div class="phone-box">
                    <img src="../../assets/imgs/Telephone02.png" class="telephone" />
                    <span class="phone" v-html="agentData.phoneNumber !=undefined&& agentData.phoneNumber !=''?agentData.phoneNumber:'你的手机号'"></span>
                  </div>
                </div>
                <img src="../../assets/imgs/eye.png" class="img-eye" />
                <img src="../../assets/imgs/wrist.png" class="img-wrist" />
                <img src="../../assets/imgs/keyboard.png" class="img-keyboard" />
              </div>

              <p class="autograph" v-html="agentData.sign != undefined&&agentData.sign !=''?agentData.sign:'一句话座右铭'"></p>
              <div class="select">
                <div class="select-title" v-for="(item,index) in agentData.tags" :key="index" :class="index==1?'label1':index==2?'label2':''">{{item.tagLable}}</div>
                <div class="select-title" v-if="tagsNum == 0" v-html="tagsNum ==0?'标签展示':''"></div>
              </div>
              <div class="combination">
                <div class="company">
                  <img src="../../assets/imgs/company01.png" class="company-img" />
                  <span class="company-title" v-html="agentData.companyName!=undefined && agentData.companyName !=''?agentData.companyName:'公司名称' "></span>
                </div>
                <div class="weChat">
                  <img src="../../assets/imgs/weChat01.png" class="weChat-img" />
                  <span class="weChat-title" v-html="agentData.wxNumber != undefined &&agentData.wxNumber !=''?agentData.wxNumber:'你的微信号'"></span>
                </div>
                <div class="weChat">
                  <img src="../../assets/imgs/address.png" class="weChat-img" />
                  <span class="weChat-title" v-html="agentData.address != undefined && agentData.address !=''?agentData.address:'你的地址'"></span>
                </div>
              </div>
              <div>
                <div class="honor">
                  <img src="../../assets/imgs/honor.png" class="honor-img" />
                  <span class="honor-text"> 所获荣誉</span>
                </div>
                <div class="honor-conten">
                  <div class="honor-positi" v-for="(item,index) in agentData.honors" :key="index">
                    <span class="honor-box"></span>
                    <p class="honor-title">{{item.str}}</p>
                  </div>
                  <!-- 当为登入或者没有荣誉的时候展示 -->
                  <div class="honor-positi" v-if="honors == 0">
                    <span class="honor-box"></span>
                    <p class="honor-title">你的荣誉展示</p>
                  </div>
                </div>
                <div class="lately-dynamic">
                  <div class="lately-mar">
                    <div class="lately-hear">
                      <h4 class="lately-left">近期动态</h4>
                      <p class="lately-right">查看更多 <icon class="dt-icon nextIcon" name="next"></icon>
                      </p>
                    </div>
                    <div v-if="dynamicList !=null">
                      <div class="lately-title">
                        <p>{{dynamicList.message}}</p>
                      </div>
                      <div class="lately-img">
                        <div class="lately-picture" v-for="(item,index) in dynamicList.images" :key="index">
                          <img :src="item" />
                        </div>
                      </div>
                      <div class="lately-location" v-if="dynamicList.location !=''&&dynamicList.location !=undefined">
                        <img src="../../assets/imgs/adds.png" class="location-img" />
                        <span>{{dynamicList.location}}</span>
                      </div>
                      <div class="lately-tiem" v-if="dynamicList.likeNum !=undefined">
                        <div class="tiem-box">
                          <p><span>{{dynamicList.updateTime}}</span> <span>{{dynamicList.createTime}}</span></p>
                        </div>
                        <div class="tiem-right">
                          <span v-if="dynamicList.likeNum>0">{{dynamicList.likeNum}}</span>
                          <img src="../../assets/imgs/save.png" />
                        </div>
                      </div>
                    </div>
                    <div v-if="dynamicList ==null">
                      <img src="../../assets/imgs/no-entry.png" class="no-entry" />
                      <p class="lately-title1">建议您使用动态发布功能，让客户更了解你</p>
                    </div>
                  </div>
                </div>
                <div class="bont-bottom"></div>
              </div>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="template-box">
            <div class="template-data" style="background:#c0c0c0">
              <div class="template-select">
                <div class="template-portrait" style="border: solid 0.004rem #c3a769;">
                  <img :src="agentData.photoUrl" />
                </div>
                <div class="content-template">
                  <p class="name" v-html="agentData.cardName !=undefined &&agentData.cardName !=''?agentData.cardName:'姓名'"></p>
                  <div>
                    <span class="occupation" v-html="agentData.position !=undefined &&agentData.position !=''?agentData.position:'职位名称'"></span>
                    <span class="occupation-years" v-html="yeadr !=undefined && yeadr !=''?' 从业'+yeadr+'年':'从业年限'"></span>
                  </div>
                  <div class="phone-box">
                    <img src="../../assets/imgs/Telephone03.png" class="telephone" />
                    <span class="phone" style="color:#bfa05d" v-html="agentData.phoneNumber !=undefined&& agentData.phoneNumber !=''?agentData.phoneNumber:'你的手机号'"></span>
                  </div>
                </div>
                <img src="../../assets/imgs/eye.png" class="img-eye" />
                <img src="../../assets/imgs/wrist.png" class="img-wrist" />
                <img src="../../assets/imgs/keyboard.png" class="img-keyboard" />
              </div>

              <p class="autograph" v-html="agentData.sign != undefined&&agentData.sign !=''?agentData.sign:'一句话座右铭'"></p>
              <div class="select">
                <div class="select-title" v-for="(item,index) in agentData.tags" :key="index" :class="index==1?'label1':index==2?'label2':''">{{item.tagLable}}</div>
                <div class="select-title" v-if="tagsNum == 0" v-html="tagsNum ==0?'标签展示':''"></div>
              </div>
              <div class="combination">
                <div class="company">
                  <img src="../../assets/imgs/company01.png" class="company-img" />
                  <span style="color:#bfa05d" class="company-title" v-html="agentData.companyName!=undefined && agentData.companyName !=''?agentData.companyName:'公司名称' "></span>
                </div>
                <div class="weChat">
                  <img src="../../assets/imgs/weChat01.png" class="weChat-img" />
                  <span class="weChat-title" v-html="agentData.wxNumber != undefined &&agentData.wxNumber !=''?agentData.wxNumber:'你的微信号'"></span>
                </div>
                <div class="weChat">
                  <img src="../../assets/imgs/address.png" class="weChat-img" />
                  <span class="weChat-title" v-html="agentData.address != undefined && agentData.address !=''?agentData.address:'你的地址'"></span>
                </div>
              </div>
              <div>
                <div class="honor">
                  <img src="../../assets/imgs/honor.png" class="honor-img" />
                  <span class="honor-text"> 所获荣誉</span>
                </div>
                <div class="honor-conten">
                  <div class="honor-positi" v-for="(item,index) in agentData.honors" :key="index">
                    <span class="honor-box"></span>
                    <p class="honor-title">{{item.str}}</p>
                  </div>
                  <!-- 当为登入或者没有荣誉的时候展示 -->
                  <div class="honor-positi" v-if="honors == 0">
                    <span class="honor-box"></span>
                    <p class="honor-title">你的荣誉展示</p>
                  </div>
                </div>
                <div class="lately-dynamic">
                  <div class="lately-mar">
                    <div class="lately-hear">
                      <h4 class="lately-left">近期动态</h4>
                      <p class="lately-right">查看更多 <icon class="dt-icon nextIcon" name="next"></icon>
                      </p>
                    </div>
                    <div v-if="dynamicList !=null">
                      <div class="lately-title">
                        <p>{{dynamicList.message}}</p>
                      </div>
                      <div class="lately-img">
                        <div class="lately-picture" v-for="(item,index) in dynamicList.images" :key="index">
                          <img :src="item" />
                        </div>
                      </div>
                      <div class="lately-location" v-if="dynamicList.location !=''&&dynamicList.location !=undefined">
                        <img src="../../assets/imgs/adds.png" class="location-img" />
                        <span>{{dynamicList.location}}</span>
                      </div>
                      <div class="lately-tiem" v-if="dynamicList.likeNum !=undefined">
                        <div class="tiem-box">
                          <p><span>{{dynamicList.updateTime}}</span> <span>{{dynamicList.createTime}}</span></p>
                        </div>
                        <div class="tiem-right">
                          <span v-if="dynamicList.likeNum>0">{{dynamicList.likeNum}}</span>
                          <img src="../../assets/imgs/save.png" />
                        </div>
                      </div>
                    </div>
                    <div v-if="dynamicList ==null">
                      <img src="../../assets/imgs/no-entry.png" class="no-entry" />
                      <p class="lately-title1">建议您使用动态发布功能，让客户更了解你</p>
                    </div>
                  </div>
                </div>
                <div class="bont-bottom"></div>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="footer">
      <div class="dt-btn-box">
        <div class="btn-down" @click="edit" :style="initialSlideData === agentData.cardTemplate?'background:#bbb':''">更换模板</div>
        <div class="pos-btn" :style="{display:$store.state.maskView}">更换模板</div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  XInput,
  Group,
  XButton,
  Flexbox,
  FlexboxItem,
  Checker,
  CheckerItem,
  Datetime,
  Selector,
  Cell
} from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import { getDevice } from "@/config/utils";
export default {
  components: {
    XInput,
    Group,
    XButton,
    Flexbox,
    FlexboxItem,
    dtHeader,
    Selector,
    Checker,
    Datetime,
    CheckerItem,
    Cell
  },
  data() {
    return {
      tags: [
        {
          tagLable: "保险今日明星"
        },
        {
          tagLable: "保单达人"
        },
        {
          tagLable: "很值得信赖"
        }
      ],
      device: getDevice(),
      swiperOption: {
        initialSlide: this.$route.query.id ? this.$route.query.id : 0, //设定初始化时slide的索引
        // loop: true,
        // slidesPerView: "auto",
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        speed: 300,
        coverflowEffect: {
          rotate: 0,
          stretch: 10, // slide左右距离
          depth: 400, // slide前后距离
          modifier: 0.5, //
          slideShadows: false // 滑块遮罩层
        }
      },
      dataStyle: "",
      agentData: {},
      yeadr: "",
      dynamicList: null,
      tagsNum: 0,
      honors: 0,
      initialSlideData: ""
    };
  },
  created() {
    // this.initData();
    let $this = this;
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
  },
  mounted() {
    if (this.$store.state.app_token) {
      this.initData();
      this.agentZone();
    }
  },
  watch: {},
  computed: {},
  methods: {
    swiperChange() {
      this.initialSlideData = this.$refs.mySwiper.swiper.activeIndex;
    },
    async initData() {
      let results = await api.getAgentCard();
      if (results.status == 1) {
        this.agentData = results.data;
        this.initialSlideData = this.$refs.mySwiper.swiper.activeIndex;
        if (results.data.tags == null) {
          this.tagsNum = 0;
        } else {
          this.tagsNum = results.data.tags.length;
        }
        if (results.data.honors != null) {
          this.honors = results.data.honors.length;
        }
        let workTime = this.agentData.workYears;
        if (workTime) {
          let years = workTime.split("-")[0];
          let month = workTime.split("-")[1];
          let date = new Date();
          let dateYears = date.getFullYear();
          let dateMonth = date.getMonth() + 1;
          let nYears = dateYears - years;
          let workYears;
          if (nYears == 0) {
            workYears = 1;
          }
          if (nYears > 0 && dateMonth - month >= 0) {
            workYears = nYears + 1;
          } else if (nYears > 0) {
            workYears = nYears;
          }
          this.yeadr = workYears;
        }
      }
    },
    //代理人获取最近动态
    async agentZone() {
      let results = await api.getAgentZoneRecentDynamic();

      if (results.status == 1) {
        if (results.data != null) {
          let now = new Date(results.data.updateTime.replace(/-/g, "/"));
          let month = now.getMonth() + 1;
          let date = now.getDate();
          let hours = now.getHours();
          let minutes = now.getMinutes();
          if (minutes < 10) {
            minutes = "0" + minutes;
          }
          this.dynamicList = results.data;
          this.dynamicList.updateTime = month + "-" + date;
          this.dynamicList.createTime = hours + ":" + minutes;
        }
      }
    },
    goBack() {
      let device = this.device;
      let from = this.$route.query.from;
      if (from) {
        this.$router.go(-1);
      } else if (device == "android") {
        bmAndroid.goHomePage();
      } else if (device == "ios" || device == "iPhoneX") {
        window.webkit.messageHandlers.goHomePage.postMessage(null);
      }
    },
    datStyle(index) {
      this.dataStyle = index;
    },
    async edit() {
      let device = this.device;
      if (this.initialSlideData == this.agentData.cardTemplate) {
        return;
      }
      if (this.agentData.phoneNumber == "") {
        this.agentData.phoneNumber = null;
      }
      let data = this.$refs.mySwiper.swiper.activeIndex;
      let results = await api.getChangeTemplate({
        templateCode: data,
        templateType: "1"
      });
      if (results.status == 1) {
        let from = this.$route.query.from;
        if (from) {
          this.$router.go(-1);
        } else if (device == "android") {
          bmAndroid.goHomePage();
        } else if (device == "ios" || device == "iPhoneX") {
          window.webkit.messageHandlers.goHomePage.postMessage(null);
        }
      } else {
        if (results.status == 4) {
          this.$confirm({
            content: "此功能需要开通会员",
            confirmText: "购买",
            onConfirm() {
              if (device == "android") {
                bmAndroid.gotoAppPage(4);
              } else if (device == "ios" || device == "iPhoneX") {
                window.webkit.messageHandlers.gotoAppPage.postMessage(4);
              }
            },
            onCancel() {}
          });
        } else {
          this.$toast("保存失败");
        }
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

.card-editTemplate-page {
  .template {
    width: 100%;
    height: 80px;
    background: #f7f7f7;
    line-height: 80px;
    position: fixed;
    .current-template {
      padding-left: 50px;
    }
  }
  .dt-content {
    background: #ffffff;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-top: 80px;
    .no-entry {
      width: 40%;
      height: auto;
      margin-top: 20px;
      margin-left: 30%;
    }
    .no-entry-text {
      text-align: center;
      color: #cccccc;
      font-size: 30px;
      line-height: 54px;
      padding-bottom: 39px;
    }
    .lately-title1 {
      text-align: center;
      color: #cccccc;
      font-size: 20px;
      line-height: 54px;
      padding-bottom: 39px;
    }
    .template-data {
      background-color: #f6e7d7;
      position: relative;
      border-radius: 12px;
    }
    .img-eye {
      position: absolute;
      right: 0;
      top: 54px;
      width: 64px;
    }
    .img-wrist {
      position: absolute;
      right: 87px;
      top: 37px;
      width: 133px;
    }
    .img-keyboard {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 165px;
    }
    .template-box {
      padding-top: 20px;
      margin: 0px 70px;
      margin-bottom: 10px;
      // background-color: #f6e7d7;
      .template-select {
        // background-color: #f6e7d7;
        width: 610px;
        height: 220px;

        // border-radius: 12px;
        .template-portrait {
          display: inline-block;
          margin-top: 46px;
          margin-left: 32px;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          border: solid 3px #fcc0c0;
          background-color: #ffffff;
          overflow: hidden;
          float: left;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .content-template {
          display: inline-block;
          position: relative;
          margin-left: 23px;
          .name {
            font-size: 42px;
            margin-top: 59px;
          }
          .occupation {
            font-size: 28px;
            color: #000000;
            line-height: 48px;
            // margin-left: 10px;
          }
          .occupation-years {
            // width: 100px;
            // height: 30px;
            background-color: #ffffff;
            border-radius: 15px 15px 15px 0px;
            opacity: 0.5;
            display: inline-block;
            padding: 2px 12px;
            font-size: 20px;
            color: #999999;
            // line-height: 44px;
          }
          .phone-box {
            margin-top: 10px;
          }
          .telephone {
            display: inline-block;
            width: 36px;
            height: 36px;
            // background-color: #d77567;
          }
          .phone {
            position: relative;
            top: -6px;
            color: #d77567;
          }
        }
      }
      .autograph {
        margin-left: 35px;
        font-size: 24px;
        color: #868686;
        line-height: 44px;
      }
      .select {
        padding: 14px 34px;
        position: relative;
        border-bottom: 1px solid #ffffff;
        .select-title {
          background-color: #ffffff;
          font-size: 24px;
          color: #f6c55a;
          border: solid 2px #f6c55a;
          border-radius: 20px;
          padding: 8px 13px;
          margin-right: 13px;
          margin-top: 8px;
          display: inline-block;
        }
        .label1 {
          border: solid 2px #6aa8fe;
          color: #6aa8fe;
        }
        .label2 {
          border: solid 2px #a1e155;
          color: #a1e155;
        }
      }
      .combination {
        // border-bottom: 1px solid #ffffff;
        margin-left: 40px;
        margin-top: 27px;
        padding-bottom: 27px;
        .company {
          img {
            width: 29px;
            height: 32px;
          }
          .company-title {
            position: relative;
            top: -6px;
            font-size: 32px;
            color: #d77567;
          }
        }
        .weChat {
          margin-top: 15px;
          img {
            width: 31px;
            height: 25px;
          }
          .weChat-title {
            position: relative;
            top: -4px;
            color: #7e7d65;
            font-size: 26px;
          }
        }
      }
      .honor {
        border-top: 1px solid #ffffff;
        padding-left: 40px;
        padding-top: 24px;
        img {
          width: 26px;
        }
        .honor-text {
          position: relative;
          top: -4px;
          font-size: 30px;
          color: #666666;
        }
      }
      .honor-conten {
        margin-left: 50px;
        margin-bottom: 21px;
        // margin-top: 20px;
      }
      .honor-positi {
        position: relative;
        // padding-left: 39px;
        .honor-box {
          width: 6px;
          height: 6px;
          background-color: #6a9094;
          border-radius: 50%;
          display: block;
          float: left;
          position: absolute;
          top: 15px;
        }
        .honor-title {
          font-size: 24px;
          color: #58787c;
          line-height: 36px;
          padding-left: 24px;
        }
      }
      .lately-dynamic {
        margin: 0 20px;
        // margin-bottom: 59px;
        background: #ffffff;
        box-shadow: 2px 4px 10px 0px rgba(0, 0, 0, 0.04);
        border-radius: 10px;
        position: relative;
        .lately-mar {
          padding: 5px 37px;
          .lately-hear {
            padding: 15px 8px;
            border-bottom: 1px solid #e8e8e8;
            font-size: 21px;

            .lately-left {
              color: #333333;
              // float: left;
              display: inline-block;
            }
            .lately-right {
              float: right;
              color: #999999;
              .nextIcon {
                width: 19px;
                height: 19px;
                // line-height: 28px;
                padding-bottom: 3px;
              }
            }
          }
          .lately-title {
            padding: 25px 8px 20px 8px;
            font-size: 20px;
            color: #333333;
          }
          .lately-img {
            padding: 0 8px;
            .lately-picture {
              width: 151px;
              height: 151px;
              display: inline-block;
              background: #a2d7dd;
              border-radius: 10px;
              margin-left: 3px;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
          .lately-location {
            padding-left: 16px;
            padding-top: 10px;
            padding-bottom: 15px;
            img {
              width: 26px;
              height: 26px;
              display: inline-block;
            }
            span {
              color: #4ed388;
              font-size: 17px;
            }
          }
          .lately-tiem {
            padding-left: 16px;
            padding-bottom: 21px;
            font-size: 17px;
            color: #666666;
            position: relative;
            .tiem-box {
              display: inline-block;
            }

            .tiem-right {
              position: absolute;
              top: 0;
              right: 0;
              font-size: 17px;
              color: #333333;
              img {
                width: 28px;
              }
            }
          }
        }
      }
      .bont-bottom {
        padding-top: 59px;
      }
    }
    .optional {
      width: 100%;
      height: 80px;
      background: #f7f7f7;
      line-height: 80px;
      .optional-template {
        padding-left: 50px;
      }
    }
    .optional-style {
      display: inline-block;
      width: 80px;
      height: 80px;
      background: #c2d1ca;
    }
  }
  .footer {
    position: fixed;
    bottom: 60px;
    width: 100%;
    z-index: 1;
  }
  .dt-btn-box {
    width: 500px;
    margin: 0 auto;
    border-radius: 40px;
    line-height: 80px;
    height: 80px;
    font-size: 30px;
    color: #ffffff;
  }
  .btn-down {
    border-radius: 40px;
    background-color: #28c76a;
  }
  .pos-btn {
    border-radius: 40px;
  }
}
</style>
