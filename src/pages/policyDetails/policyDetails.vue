<template>
  <div class="dt-pages policy-details-page">
    <div class="dt-header">
      <dtHeader title="保单详情" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content" ref="wrap">
      <div class="policy-content">
        <div class="policy-item" ref="policy-info">
          <div class="policy-title">
            <span class="title">1 基本信息</span>
            <b class="solid"></b>
            <b class="semicircle sleft"></b>
            <b class="semicircle sright"></b>
            <p class="edit-btn">
              <span
                v-if="!policyDetails.info.editstatus"
                @click="editPolicyInfo(policyDetails.info)"
                class="edit"
              >
                <icon name="edit" class="dt-icon"></icon>编辑
              </span>
              <span
                v-if="policyDetails.info.editstatus"
                @click="savePolicyInfo(policyDetails.info)"
              >保存</span>
            </p>
          </div>
          <div class="policy-text">
            <p>保险公司：{{policyDetails.info.companyName}}</p>
          </div>
          <div class="policy-table">
            <div class="policy-table-li">
              <span class="li-blue w30">保单号</span>
              <span
                v-if="!policyDetails.info.editstatus"
                class="li-value w70 ellipsis"
              >{{policyDetails.info.policyNo}}</span>
              <span v-if="policyDetails.info.editstatus" class="li-value w70">
                <x-input
                  v-model="policyDetails.info.policyNo"
                  @on-change="validatePolicyNoInput(policyDetails.info,4,...arguments)"
                  required
                ></x-input>
              </span>
            </div>
            <div class="policy-table-li">
              <span class="li-blue w30">生效日期</span>
              <span
                v-if="!policyDetails.info.editstatus"
                class="li-value w70"
              >{{policyDetails.info.year}}年{{policyDetails.info.month}}月{{policyDetails.info.day}}日</span>
              <span v-if="policyDetails.info.editstatus" class="li-value w70 calendar-style">
                <calendar
                  :item="policyDetails.info"
                  :pindex="0"
                  :index="0"
                  @validateValue="validateValue"
                  @transfervalue="conversionValue"
                ></calendar>
              </span>
            </div>
            <div class="policy-table-li">
              <span class="li-blue w30">保费合计</span>
              <span
                v-if="!policyDetails.info.editstatus"
                class="li-value w70"
              >{{policyDetails.info.premium}}元</span>
              <span v-if="policyDetails.info.editstatus" class="li-value w70 premium">
                <x-input
                  v-model="policyDetails.info.premium"
                  type="number"
                  @on-blur="validatePremiumInput(policyDetails.info,2,...arguments)"
                  required
                ></x-input>元
              </span>
            </div>
            <div class="policy-table-li">
              <span class="li-blue w30">交费银行</span>
              <span
                class="li-value w70"
                v-if="!policyDetails.info.editstatus"
              >{{policyDetails.info.bankName}}</span>
              <div class="li-value w70 bankName" v-if="policyDetails.info.editstatus">
                <selector
                  placeholder="请选择"
                  class="death_selector"
                  v-model="policyDetails.info.bankName"
                  :value="policyDetails.info.bankName"
                  :value-map="['id', 'value']"
                  :options="bankList"
                ></selector>
              </div>
            </div>
          </div>
        </div>
        <div class="policy-item pdt30" v-if="dutyStatus" ref="policy-duty">
          <div class="policy-title">
            <span class="title">2 可选责任</span>
            <b class="solid"></b>
            <b class="semicircle sleft"></b>
            <b class="semicircle sright"></b>
            <p class="edit-btn">
              <span
                v-if="!policyDetails.optduty.editstatus"
                @click="editOptDutyInfo(policyDetails.optduty)"
                class="edit"
              >
                <icon name="edit" class="dt-icon"></icon>编辑
              </span>
              <span
                v-if="policyDetails.optduty.editstatus"
                @click="saveOptDutyInfo(policyDetails.optduty)"
              >保存</span>
            </p>
          </div>
          <div class="policy-optduty">
            <div
              class="policy-optduty-li"
              v-for="(item,index) in policyDetails.optduty.fields"
              :key="index"
            >
              <div @click="spreadOptDuty(item)" class="title">
                {{item.productName}}
                <span class="optduty-icon">
                  <icon name="duty-spread" v-if="!item.status" class="dt-icon icon-spread"></icon>
                  <icon name="duty-retract" v-if="item.status" class="dt-icon icon-retract"></icon>
                </span>
              </div>
              <ul v-if="item.status">
                <li v-for="(pitem,pindex) in item.liabilityVoList" :key="pindex">
                  <span>{{pitem.liabLabel}}</span>
                  <span @click="selectOptDuty(policyDetails.optduty,pitem)" class="operation">
                    <icon v-if="pitem.isSelect == 1" class="dt-icon icon-current" name="select3"></icon>
                    <i v-if="pitem.isSelect == 0" class="icon-select"></i>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="policy-item pdt20" ref="policy-insurance">
          <div class="policy-title">
            <span class="title">
              <i v-text="dutyStatus?'3':'2'"></i>险种信息
            </span>
            <b class="solid"></b>
            <b class="semicircle sleft"></b>
            <b class="semicircle sright"></b>
            <p class="edit-btn">
              <span
                v-if="!policyDetails.insurance.editstatus"
                @click="editInsuranceInfo(policyDetails.insurance)"
                class="edit"
              >
                <icon name="edit" class="dt-icon"></icon>编辑
              </span>
              <span
                v-if="policyDetails.insurance.editstatus"
                class="add"
                @click="addInsuranceInfo(policyDetails.insurance)"
              >
                <icon name="add5" class="dt-icon add3"></icon>添加
              </span>
              <span
                v-if="policyDetails.insurance.editstatus"
                @click="saveInsuranceInfo(policyDetails.insurance)"
              >保存</span>
            </p>
          </div>
          <div
            class="policy-insurance-item"
            v-for="(pitem,pindex) in policyDetails.insurance.fields"
            :key="pindex"
          >
            <div class="policy-text">
              <p>
                {{pitem.productName}}
                <span
                  v-if="policyDetails.insurance.editstatus"
                  @click="deleteInsurance(policyDetails.insurance.fields,pindex,pitem)"
                >
                  <icon name="remove2" class="dt-icon"></icon>
                </span>
              </p>
            </div>
            <div class="policy-table">
              <div
                class="policy-table-li"
                v-if="!item.display"
                :class="item.type == 'textarea'?'t-textarea-content':''"
                v-for="(item,index) in pitem.productParamList"
                :key="index"
              >
                <div
                  v-if="!policyDetails.insurance.editstatus"
                  class="li-blue w38 fl"
                >{{item.rowsName}}</div>
                <div v-if="!policyDetails.insurance.editstatus" class="li-value w62 fl">
                  <div
                    v-if="item.paramList.length==1"
                    v-for="(citem,cindex) in item.paramList"
                    :key="cindex"
                  >
                    <div v-if="citem.element == 'select'">
                      <div v-for="(ditem,dindex) in citem.selectDataList" :key="dindex">
                        <span v-if="ditem.key == citem.value">{{ditem.value}}</span>
                      </div>
                    </div>
                    <div v-if="citem.element == 'textarea'">
                      <span>{{citem.value}}</span>
                    </div>
                    <div v-if="citem.element == 'input'">
                      <span>{{citem.value}}</span>
                      <span class="unit" v-if="citem.unit && citem.value">{{citem.unit}}</span>
                    </div>
                  </div>
                  <div v-if="item.paramList.length==2">
                    <span v-if="item.paramList[1].element == 'input'">{{item.paramList[1].value}}</span>
                    <span
                      v-if="item.paramList[0].element == 'select' && ditem.key == item.paramList[0].value"
                      v-for="(ditem,dindex) in item.paramList[0].selectDataList"
                      :key="dindex"
                    >{{ditem.value}}</span>
                  </div>
                </div>
                <div
                  class="li-blue w38 fl"
                  :class="item.boolFlag ?'warn-title': ''"
                  v-if="policyDetails.insurance.editstatus"
                >{{item.rowsName}}</div>
                <div
                  v-if="policyDetails.insurance.editstatus"
                  class="li-value w62 fl editinsurance"
                >
                  <group>
                    <div
                      v-if="item.paramList.length==1"
                      v-for="(citem,cindex) in item.paramList"
                      :key="cindex"
                    >
                      <div
                        v-if="citem.element == 'input'"
                        class="itemIpt"
                        :ref="`${pindex}-${index}-${cindex}`"
                      >
                        <x-input
                          :type="citem.type == 'number' || citem.type == 'int' ?'number':'text' "
                          :placeholder="citem.placeholder?citem.placeholder:'请输入'"
                          v-model="citem.value"
                          @on-blur="validateInsureValue(citem,item,pindex,...arguments)"
                        ></x-input>
                        <span class="unit fl" v-if="citem.unit">{{citem.unit}}</span>
                      </div>
                      <div v-if="citem.element == 'select'" :ref="`${pindex}-${index}-${cindex}`">
                        <selector
                          :placeholder="citem.placeholder?citem.placeholder:'请选择'"
                          v-model="citem.value"
                          :value-map="['key', 'value']"
                          :options="citem.selectDataList"
                          @on-change="validateInsureValue(citem,item,pindex,...arguments)"
                        ></selector>
                      </div>
                      <div v-if="citem.element == 'textarea'" :ref="`${pindex}-${index}-${cindex}`">
                        <x-textarea
                          v-model="citem.value"
                          :value="citem.value"
                          :placeholder="citem.placeholder"
                          :rows="2"
                          :show-counter="false"
                          @on-change="validateInsureValue(citem,item,pindex,...arguments)"
                          autosize
                        ></x-textarea>
                      </div>
                    </div>
                    <div class="specialfield" v-if="item.paramList.length>1">
                      <div class="field-content">
                        <div
                          class="field-item"
                          v-for="(citem,cindex) in item.paramList"
                          :key="cindex"
                        >
                          <div
                            v-if="citem.element == 'input'"
                            :ref="`${pindex}-${index}-${cindex}`"
                          >
                            <x-input
                              :type="citem.type == 'number' || citem.type == 'int' ?'number':'text' "
                              :disabled="citem.required == 'norequired' || citem.iptStatus == 'norequired' ? true : false"
                              :placeholder="citem.placeholder?citem.placeholder:'请输入'"
                              v-model="citem.value"
                              @on-blur="validateInsureValue(citem,item,pindex,...arguments)"
                            ></x-input>
                            <span class="unit fl" v-if="citem.unit">{{citem.unit}}</span>
                          </div>
                          <div
                            v-if="citem.element == 'select'"
                            :ref="`${pindex}-${index}-${cindex}`"
                          >
                            <selector
                              :placeholder="citem.placeholder?citem.placeholder:'请选择'"
                              v-model="citem.value"
                              :readonly="citem.iptStatus == 'norequired' ? true : false"
                              :value-map="['key', 'value']"
                              :options="citem.selectDataList"
                              @on-change="validateInsureValue(citem,item,pindex,...arguments)"
                            ></selector>
                          </div>
                        </div>
                      </div>
                    </div>
                  </group>
                </div>
              </div>
            </div>
            <div class="policy-duty" v-if="!policyDetails.insurance.editstatus">
              <p
                class="openDuty"
                :class="pitem.dutyStatus ? 'open':'close'"
                @click="openDutyContent(pitem)"
              >保障责任
                <icon name="duty-spread" v-if="!pitem.dutyStatus" class="dt-icon icon-spread"></icon>
                <icon name="duty-retract" v-if="pitem.dutyStatus" class="dt-icon icon-retract"></icon>
              </p>
              <div class="duty-list-content" v-if="pitem.dutyStatus">
                <div class="duty-compute">
                  <!-- <div class="duty-tips" v-if="pitem.liabilityList.length == 0 || pitem.section.length == 0">
                    暂无保障责任
                  </div>-->
                  <div
                    class="duty-compute-select"
                    v-if="pitem.liabilityList.length > 0 && pitem.section.length > 0"
                  >
                    <div class="compute-name">保单年度第</div>
                    <group class="compute-selector">
                      <selector
                        class="compute-select-style"
                        v-model="pitem.currentValue"
                        :value="pitem.currentValue"
                        :value-map="['id', 'value']"
                        :options="pitem.section"
                        @on-change="selectDutylimit(pindex,pitem,...arguments)"
                      ></selector>
                    </group>
                    <div class="compute-name">年</div>
                  </div>
                  <div class="duty-compute-range" v-if="pitem.section && pitem.section.length>1">
                    <span @click="minusDutylimit(pindex,pitem,...arguments)">
                      <icon class="dt-icon icon-remove" name="remove"></icon>
                    </span>
                    <div class="duty-range-bar">
                      <group>
                        <cell primary="content">
                          <range
                            v-model="pitem.currentValue"
                            :min="pitem.minYear"
                            :max="pitem.maxYear"
                            @on-change="selectDutyRange(pindex,pitem,...arguments)"
                          ></range>
                        </cell>
                      </group>
                    </div>
                    <span @click="addDutylimit(pindex,pitem,...arguments)">
                      <icon class="dt-icon icon-add2" name="add3"></icon>
                    </span>
                  </div>
                </div>
                <div
                  class="policy-duty-item"
                  v-if="dutyItem.display && dutyItem.listStatus"
                  :class="'color'+dindex%2"
                  v-for="(dutyItem,dindex) in pitem.liabilityList"
                  :key="dindex"
                >
                  <div class="title">
                    <span class="t-icon"></span>
                    {{dutyItem.liabName}}
                  </div>
                  <div class="title-duty" @click="openDutyList(pindex,pitem,dutyItem)">
                    <span>
                      <em
                        v-if="!dutyItem.ensureStatus"
                      >{{dutyItem.liabStatus?'件数':'保障额度'}}：{{dutyItem.liabStatus?'1':dutyItem.limit}}</em>
                      <em v-if="dutyItem.ensureStatus">保障详情</em>
                      <icon name="spread" v-if="!dutyItem.status" class="dt-icon"></icon>
                      <icon name="retract" v-if="dutyItem.status" class="dt-icon"></icon>
                    </span>
                  </div>
                  <div class="duty-item-content" v-if="dutyItem.status">
                    <p>
                      <i>①</i>
                      保险单所载名称：{{dutyItem.liabLabel}}
                    </p>
                    <p>
                      <span>
                        <i>②</i>
                        责任类别：{{dutyItem.liabType}}
                      </span>
                    </p>
                    <p v-for="(liabItem,lindex) in dutyItem.liabDataList" :key="lindex">
                      <span :class="liabItem.rowsName =='备注'?'len':''">
                        <i v-if="lindex == 0">③</i>
                        <i v-if="lindex == 1">④</i>
                        <i v-if="lindex == 2">⑤</i>
                        <i v-if="lindex == 3">⑥</i>
                        <i v-if="lindex == 4">⑦</i>
                        <i v-if="lindex == 5">⑧</i>
                        <i v-if="lindex == 6">⑨</i>
                        <i v-if="lindex == 7">⑩</i>
                        {{liabItem.rowsName}}：{{liabItem.dataNote}}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="policy-item" ref="policy-proposer">
          <div class="policy-title w-title">
            <span class="title">
              <i v-text="dutyStatus?'4':'3'"></i>投保人信息
            </span>
            <b class="solid"></b>
            <b class="semicircle sleft"></b>
            <b class="semicircle sright"></b>
            <p class="edit-btn">
              <span
                v-if="!policyDetails.proposer.editstatus"
                @click="editProposerInfo(policyDetails.proposer)"
                class="edit"
              >
                <icon name="edit" class="dt-icon"></icon>编辑
              </span>
              <span
                v-if="policyDetails.proposer.editstatus"
                @click="saveProposerInfo(policyDetails.proposer)"
              >保存</span>
            </p>
          </div>
          <div
            class="policy-table policy-user"
            v-for="(item,index) in policyDetails.proposer.fields"
            :key="index"
          >
            <div class="policy-table-li" :ref="`proposer-${index}`">
              <span v-if="!policyDetails.proposer.editstatus" class="li-blue w15 fl">姓名</span>
              <span
                v-if="!policyDetails.proposer.editstatus"
                class="li-center w85 c666"
              >{{item.customerAlias}}</span>
              <div v-if="policyDetails.proposer.editstatus" class="li-blue w15 fl">姓名</div>
              <div
                v-if="policyDetails.proposer.editstatus"
                class="li-center w85 c666 fl policy-user-name"
              >
                <x-input
                  v-model="item.customerAlias"
                  :max="7"
                  @keyup.native="validateCharacter(item,7,1)"
                  @on-change="validateNameInput(item,5,...arguments)"
                  required
                ></x-input>
                <span @click="selectUser('proposer',index,item)">
                  <icon class="dt-icon icon-user" name="client"></icon>
                </span>
              </div>
            </div>
            <div class="policy-table-li">
              <span class="li-blue w15">性别</span>
              <span class="li-blue w55">出生日期</span>
              <span class="li-blue w30 bn">手机号</span>
            </div>
            <div class="policy-table-li">
              <span
                class="li-center w15 br"
                v-if="!policyDetails.proposer.editstatus"
                v-html="item.gender == 1 ? '男':'女'"
              ></span>
              <div class="li-center w15 br editgender" v-if="policyDetails.proposer.editstatus">
                <selector
                  placeholder="请选择"
                  class="death_selector"
                  v-model="item.gender"
                  :value="item.gender"
                  :value-map="['id', 'name']"
                  :options="selectGenderVal"
                ></selector>
              </div>
              <span
                v-if="!policyDetails.proposer.editstatus"
                class="li-center w55 br"
              >{{item.year}}年{{item.month}}月{{item.day}}日</span>
              <div v-if="policyDetails.proposer.editstatus" class="li-value w55 calendar-style br">
                <calendar
                  :item="item"
                  :pindex="0"
                  :index="0"
                  @validateValue="validateValue"
                  @transfervalue="conversionValue"
                ></calendar>
              </div>
              <span
                class="li-center w30"
                v-if="!policyDetails.proposer.editstatus"
              >{{item.phoneNumber}}</span>
              <div class="li-center w30" v-if="policyDetails.proposer.editstatus">
                <x-input
                  v-model="item.phoneNumber"
                  type="number"
                  :max="11"
                  is-type="china-mobile"
                  @on-blur="validatePhoneInput(item,3,...arguments)"
                  required
                ></x-input>
              </div>
            </div>
          </div>
        </div>
        <div class="policy-item" ref="policy-insured">
          <div class="policy-title w-title">
            <span class="title">
              <i v-text="dutyStatus?'5':'4'"></i>被保人信息
            </span>
            <b class="solid"></b>
            <b class="semicircle sleft"></b>
            <b class="semicircle sright"></b>
            <p class="edit-btn">
              <span
                v-if="!policyDetails.insured.editstatus"
                @click="editInsuredInfo(policyDetails.insured)"
                class="edit"
              >
                <icon name="edit" class="dt-icon"></icon>编辑
              </span>
              <span
                @click="addPolicyUser(policyDetails.insured.fields)"
                v-if="policyDetails.insured.editstatus && policyDetails.insured.fields.length<6"
                class="add"
              >
                <icon name="add5" class="dt-icon add3"></icon>添加
              </span>
              <span
                v-if="policyDetails.insured.editstatus"
                @click="saveInsuredInfo(policyDetails.insured)"
              >保存</span>
            </p>
          </div>
          <div
            class="policy-table policy-user"
            :class="policyDetails.insured.editstatus ? 'mbt80':''"
            v-for="(item,index) in policyDetails.insured.fields"
            :key="index"
          >
            <div class="policy-table-li" :ref="`insured-${index}`">
              <span v-if="!policyDetails.insured.editstatus" class="li-blue w15 fl">姓名</span>
              <span
                v-if="!policyDetails.insured.editstatus"
                class="li-center w85 c666"
              >{{item.customerAlias}}</span>
              <div v-if="policyDetails.insured.editstatus" class="li-blue w15 fl">姓名</div>
              <div
                v-if="policyDetails.insured.editstatus"
                class="li-center w85 c666 fl policy-user-name"
              >
                <x-input
                  v-model="item.customerAlias"
                  :max="7"
                  @keyup.native="validateCharacter(item,7,1)"
                  :is-type="iptValidateVal"
                  @on-change="validateNameInput(item,5,...arguments)"
                  required
                ></x-input>
                <span @click="selectUser('insured',index,item)">
                  <icon class="dt-icon icon-user" name="client"></icon>
                </span>
              </div>
            </div>
            <div class="policy-table-li">
              <span class="li-blue w15">性别</span>
              <span class="li-blue w55">出生日期</span>
              <span class="li-blue w30 bn">手机号</span>
            </div>
            <div class="policy-table-li">
              <span
                class="li-center w15 br"
                v-if="!policyDetails.insured.editstatus"
                v-html="item.gender == 1 ? '男':'女'"
              ></span>
              <div class="li-center w15 br editgender" v-if="policyDetails.insured.editstatus">
                <selector
                  placeholder="请选择"
                  class="death_selector"
                  v-model="item.gender"
                  :value="item.gender"
                  :value-map="['id', 'name']"
                  :options="selectGenderVal"
                ></selector>
              </div>
              <span
                v-if="!policyDetails.insured.editstatus"
                class="li-center w55 br"
              >{{item.year}}年{{item.month}}月{{item.day}}日</span>
              <div v-if="policyDetails.insured.editstatus" class="li-value w55 calendar-style br">
                <calendar
                  :item="item"
                  :pindex="0"
                  :index="0"
                  @validateValue="validateValue"
                  @transfervalue="conversionValue"
                ></calendar>
              </div>
              <span
                class="li-center w30"
                v-if="!policyDetails.insured.editstatus"
              >{{item.phoneNumber}}</span>
              <div class="li-center w30" v-if="policyDetails.insured.editstatus">
                <x-input
                  v-model="item.phoneNumber"
                  type="number"
                  :max="11"
                  is-type="china-mobile"
                  @on-blur="validatePhoneInput(item,3,...arguments)"
                  required
                ></x-input>
              </div>
            </div>
            <span
              v-if="policyDetails.insured.editstatus"
              @click="deletePolicyUser(index,policyDetails.insured.fields,1,item)"
              class="delete"
            >删除
              <icon class="dt-icon icon-remove" name="remove"></icon>
            </span>
          </div>
        </div>
        <div class="policy-item pdt30" ref="policy-beneficiary">
          <div class="policy-title w-title">
            <span class="title">
              <i v-text="dutyStatus?'6':'5'"></i>身故受益人
            </span>
            <b class="solid"></b>
            <b class="semicircle sleft"></b>
            <b class="semicircle sright"></b>
            <p class="edit-btn">
              <span
                v-if="!policyDetails.beneficiary.editstatus"
                @click="editBeneficiaryInfo(policyDetails.beneficiary)"
                class="edit"
              >
                <icon name="edit" class="dt-icon"></icon>编辑
              </span>
              <span
                @click="addDeathItem()"
                v-if="policyDetails.beneficiary.editstatus && policyDetails.beneficiary.fields.length==0"
                class="add"
              >
                <icon name="add5" class="dt-icon add3"></icon>添加
              </span>
              <span
                v-if="policyDetails.beneficiary.editstatus"
                @click="saveBeneficiaryInfo(policyDetails.beneficiary)"
              >保存</span>
            </p>
          </div>
          <div class="policy-beneficiary">
            <div
              class="policy-ben-list"
              v-if="!policyDetails.beneficiary.editstatus"
              v-for="(item,index) in policyDetails.beneficiary.fields"
              :key="index"
            >
              <div class="title">
                <span v-if="index == 0">第一顺位</span>
                <span v-if="index == 1">第二顺位</span>
                <span v-if="index == 2">第三顺位</span>
              </div>
              <p v-for="(pitem,pindex) in item.benefits" :key="pindex">
                <span class="icon-user"></span>
                <span v-if="pitem.type == 1" class="mr70">
                  <i>{{pitem.name}}</i>
                </span>
                <span v-if="pitem.type == 2" class="mr70">
                  <em>姓名：</em>
                  <i class="user-name">{{pitem.name}}</i>
                </span>
                <span v-if="pitem.type == 2">
                  <em>比例：</em>
                  <i>{{pitem.proportion}}%</i>
                </span>
              </p>
            </div>
            <div class="death_bd" v-if="policyDetails.beneficiary.editstatus">
              <div
                class="death_item"
                v-for="(dbitem,pindex) in policyDetails.beneficiary.fields"
                :key="pindex"
              >
                <div class="death_bt">
                  <span
                    v-if="policyDetails.beneficiary.fields.length<3 && policyDetails.beneficiary.status == 0"
                    @click="addDeathItem()"
                  >
                    <icon class="dt-icon icon-add" name="add3"></icon>
                  </span>
                  <span v-if="pindex == 0">第一顺位</span>
                  <span v-if="pindex == 1">第二顺位</span>
                  <span v-if="pindex == 2">第三顺位</span>
                </div>
                <div class="death_li" v-for="(dbitemli,index) in dbitem.benefits" :key="index">
                  <div class="death-user" v-if="dbitemli.type == 1">
                    <span class="icon-user"></span>
                    <span>
                      <b>{{dbitemli.name}}</b>
                    </span>
                    <span @click="removeDeathli(dbitem,pindex,index,dbitemli)">
                      <icon class="dt-icon icon-remove" name="remove"></icon>
                    </span>
                  </div>
                  <div
                    class="death-user label-user"
                    v-if="dbitemli.type == 2"
                    @click="editDeathli(dbitem,dbitemli)"
                  >
                    <span class="icon-user"></span>
                    <span>
                      <label class="label-name">
                        <em>姓名:</em>
                        <b class="ml24 user-name">{{dbitemli.name}}</b>
                      </label>
                      <label>
                        <em>比例:</em>
                        <b class="ml24">{{dbitemli.proportion}}%</b>
                      </label>
                    </span>
                    <span @click="removeDeathli(dbitem,pindex,index,dbitemli)">
                      <icon class="dt-icon icon-remove" name="remove"></icon>
                    </span>
                  </div>
                  <div
                    class="select_death"
                    v-if="policyDetails.beneficiary.status == 0 && dbitemli.type == 3 && dbitem.status != 2"
                  >
                    <div class="select_death_user">
                      <span class="icon-user"></span>
                    </div>
                    <div class="select_death_content">
                      <group>
                        <selector
                          placeholder="请选择受益方式"
                          class="death_selector"
                          v-model="dbitemli.value"
                          :value="dbitemli.value"
                          :value-map="['id', 'name']"
                          :options="selectBenefitVal"
                          @on-change="selectDeath(dbitem,dbitemli,...arguments)"
                        ></selector>
                      </group>
                      <div class="appoint_death" v-if="dbitemli.value == 2">
                        <group>
                          <x-input
                            title="姓名:"
                            class="appoint_death_name"
                            :max="7"
                            @keyup.native="validateCharacter(dbitemli,7,0)"
                            :is-type="iptValidateVal"
                            v-model="dbitemli.name"
                            :placeholder="iptdefaultTips"
                            @on-blur="appointDeath(dbitem,dbitemli,0,...arguments)"
                          ></x-input>
                          <x-input
                            title="比例:"
                            type="tel"
                            :max="3"
                            v-model="dbitemli.proportion"
                            :placeholder="iptdefaultTips"
                            @on-blur="appointDeath(dbitem,dbitemli,1,...arguments)"
                          ></x-input>
                          <b>%</b>
                        </group>
                      </div>
                      <span @click="removeDeathli(dbitem,pindex,index,dbitemli)">
                        <icon class="dt-icon icon-remove" name="remove"></icon>
                      </span>
                    </div>
                  </div>
                  <div
                    class="select_death"
                    v-if="(policyDetails.beneficiary.status == 1  || dbitem.status == 2) && dbitemli.type == 3 "
                  >
                    <div class="select_death_user">
                      <span class="icon-user"></span>
                    </div>
                    <div class="select_death_content">
                      <div class="appoint_death" v-if="dbitemli.value == 2">
                        <group>
                          <x-input
                            title="姓名:"
                            class="appoint_death_name"
                            :max="7"
                            @keyup.native="validateCharacter(dbitemli,7,0)"
                            :is-type="iptValidateVal"
                            v-model="dbitemli.name"
                            :placeholder="iptdefaultTips"
                            @on-blur="appointDeath(dbitem,dbitemli,0,...arguments)"
                          ></x-input>
                          <x-input
                            title="比例:"
                            type="tel"
                            :max="3"
                            v-model="dbitemli.proportion"
                            :placeholder="iptdefaultTips"
                            @on-blur="appointDeath(dbitem,dbitemli,1,...arguments)"
                          ></x-input>
                          <b>%</b>
                        </group>
                      </div>
                      <span @click="removeDeathli(dbitem,pindex,index,dbitemli)">
                        <icon class="dt-icon icon-remove" name="remove"></icon>
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  class="add-user"
                  v-if="dbitem.benefits.length<6 && (dbitem.status == 0 || dbitem.status == 2 )"
                  @click="addDeathli(dbitem.benefits,dbitem)"
                >
                  <icon class="dt-icon icon-add2" name="add3"></icon>添加受益人
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="policy-details-footer">
        <span class="nextPolicy" @click="addPolicy">继续下一张保单</span>
        <span class="generateReport" @click="saveFamilyReport">生成家庭报告</span>
      </div>
    </div>
    <addPolicyPopup
      :totalStatus="totalDialog"
      :policyStatus="policyPrompt"
      @popupConfirm="confirmAddPolicy"
      @popupCancel="cancelAddPolicy"
    ></addPolicyPopup>
    <familysPopup
      :showDialog="showDialog"
      :initData="familyListVoList"
      @closePopup="closePopup"
      @enter="selectfamily"
    ></familysPopup>
    <div class="total-dialog" v-if="insuredPopupDialog" @scroll.prevent @touchmove.prevent></div>
    <div class="insuredPopup" v-if="insuredPopupObj.length>0">
      <div class="title">请确定被保人与险种的关系</div>
      <div class="list-item" v-for="(pitem,pindex) in insuredPopupObj" :key="pindex">
        <div class="tit">{{pitem.productName}}</div>
        <div class="list-info" v-for="(item,index) in pitem.insuredParamList" :key="index">
          <div class="list-name">{{item.rowsName}}</div>
          <div class="list-value">
            <selector
              :placeholder="item.param.placeholder?item.placeholder:'请选择'"
              v-model="item.param.value"
              :value-map="['key', 'value']"
              :options="item.param.selectDataList"
            ></selector>
          </div>
        </div>
      </div>
      <p>
        <button class="confirm" @click="confirmInsured">确定</button>
      </p>
    </div>
    <div v-if="guide && guide.policyDetails != 1" class="polick-mask">
      <img @click="closeMask" src="../../assets/imgs/policy-mask.png" alt>
    </div>
  </div>
</template>
<script>
import {
  XInput,
  Group,
  XButton,
  Selector,
  Flexbox,
  FlexboxItem,
  Datetime,
  XTextarea,
  Range,
  Cell
} from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import calendar from "@/components/calendarAlone";
import { scrollToElement, getDevice } from "@/config/utils.js";
import { bank } from "@/utils/index";
import familysPopup from "@/components/familysPopup";
import addPolicyPopup from "@/components/addPolicyPopup";
import familysPopupVue from "../../components/familysPopup.vue";
import familyAddressVue from "../familyList/familyAddress.vue";
import { pipeline } from "stream";

export default {
  name: "policyDetails",
  components: {
    XInput,
    Group,
    XButton,
    Selector,
    Datetime,
    XTextarea,
    Flexbox,
    FlexboxItem,
    dtHeader,
    Range,
    Cell,
    calendar,
    familysPopup,
    addPolicyPopup
  },
  data() {
    return {
      guide: null,
      device: getDevice(),
      bankList: bank(),
      iptdefaultTips: "请输入",
      dutyStatus: false,
      policyDetails: {
        info: {
          editstatus: false,
          birthday: "",
          year: "",
          month: "",
          day: "",
          premium: ""
        },
        optduty: {
          editstatus: false,
          fields: []
        },
        insurance: {
          editstatus: false,
          fields: []
        },
        proposer: {
          editstatus: false,
          fields: []
        },
        insured: {
          editstatus: false,
          fields: []
        },
        beneficiary: {
          editstatus: false, //0正常 1不能添加顺位
          fields: []
        }
      },
      proposerTmp: {
        customerAlias: "",
        gender: 1,
        date: "",
        year: "",
        month: "",
        day: "",
        birthday: "",
        phoneNumber: ""
      },
      selectBenefitVal: [
        {
          id: 1,
          name: "法定受益人"
        },
        {
          id: 2,
          name: "指定受益人"
        }
      ],
      selectGenderVal: [
        {
          id: 1,
          name: "男"
        },
        {
          id: 2,
          name: "女"
        }
      ],
      policyId: "",
      showDialog: false,
      familyListVoList: [],
      uuid: null,
      familyId: null,
      currentUserType: null,
      currentUserIndex: null,
      insuredDeleteIds: [], //被删的投保人
      selectfamilyType: null, //判断是投保人还是被保人的选择家庭弹框
      customerDeleteIds: [], //后台返回的被删的投保人
      insuranceDeleteIds: [], //被删的险种id
      policyPrompt: false, //录入保单方式弹框
      totalDialog: false,
      insuredPopupObj: [],
      insuredPopupDialog: false,
      from: false,
      exportReportId: null, //导出报告的家庭id
      iptValidateVal: val => {
        let reg = /^[\u4e00-\u9fa5a-zA-Z0-9\-_]+[\u4e00-\u9fa5a-zA-Z0-9\-_]*$/;
        return {
          valid: reg.test(val),
          msg: "只支持中英文、数字、下划线"
        };
      }
    };
  },
  // 禁止缓存数据  防止下次选择数据不更新
  deactivated() {
    //this.$destroy(true);
  },
  async created() {
    this.guide = this.$store.state.guide;
    this.policyId =
      this.$route.query.detailPolicyId || this.$store.state.detailPolicyId;
    let from = this.$route.query.from;
    if (from) {
      this.from = true;
    }
    this.initData();
    let $this = this;
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
  },
  async activated() {
    let customerData = this.$store.state.customerData;
    let currentUserIndex = this.currentUserIndex;
    let currentUserType = this.currentUserType;
    if (JSON.stringify(customerData) != "{}" && currentUserType) {
      let policyInfo = this.policyInfoTmp;
      let policyUserInfo = [];
      if (currentUserType == "proposer") {
        policyUserInfo = this.policyDetails.proposer.fields;
      } else if (currentUserType == "insured") {
        policyUserInfo = this.policyDetails.insured.fields;
      }
      policyUserInfo[currentUserIndex].birthday = customerData.birthday;
      policyUserInfo[currentUserIndex].customerAlias =
        customerData.customerAlias;
      policyUserInfo[currentUserIndex].gender = customerData.gender;
      policyUserInfo[currentUserIndex].remark = customerData.remark;
      policyUserInfo[currentUserIndex].customerListId = customerData.customerId;
      this.$store.state.customerData = {};
      this.currentUserIndex = null;
      this.currentUserType = null;
      var vueElement = this.$refs[`${currentUserType}-${currentUserIndex}`][0];
      scrollToElement.call(this, vueElement, 200);
    }
  },
  methods: {
    async initData() {
      let policyId = this.policyId;
      if (!policyId) {
        this.$alert("保单id不存在");
        return false;
      }
      this.insuredDeleteIds = [];
      this.$store.state.detailPolicyId = policyId;
      let policyInfoResult = await api.findPolicyDetail({
        id: policyId
      });
      if (policyInfoResult.status == 1) {
        let policyBaseInfo = policyInfoResult.data;
        //保单基本信息
        let info = this.policyDetails.info;
        let date = policyBaseInfo.effectiveStartDate.split("-");
        info.companyName = policyBaseInfo.companyName;
        info.policyNo = policyBaseInfo.policyNo;
        info.effectiveStartDate = policyBaseInfo.effectiveStartDate;
        info.premium = policyBaseInfo.premium;
        info.birthday = policyBaseInfo.effectiveStartDate;
        info.year = date[0];
        info.month = date[1];
        info.day = date[2];
        info.bankName = policyBaseInfo.bankName;
        info.policyId = policyId;
        info.familyId = policyBaseInfo.familyId;
        this.exportReportId = policyBaseInfo.familyId;
        this.companyId = policyBaseInfo.companyId;
        //投保人
        let proposerInfo = this.policyDetails.proposer;
        let proposerFields = proposerInfo.fields;
        proposerFields.length = 0;
        let insurerBirthady = policyBaseInfo.insurer.birthday.split("-");
        proposerFields.push({
          customerId: policyBaseInfo.insurer.customerId,
          customerListId: policyBaseInfo.insurer.customerId,
          customerAlias: policyBaseInfo.insurer.customerAlias,
          gender: policyBaseInfo.insurer.gender,
          year: insurerBirthady[0],
          month: insurerBirthady[1],
          day: insurerBirthady[2],
          birthday: policyBaseInfo.insurer.birthday,
          phoneNumber: policyBaseInfo.insurer.phoneNumber,
          remark: policyBaseInfo.insurer.remark
        });
        proposerInfo.customerId = policyBaseInfo.insurer.customerId;
        proposerInfo.customerAlias = policyBaseInfo.insurer.customerAlias;
        //被保人
        let insured = this.policyDetails.insured.fields;
        insured.length = 0;
        let policyinsureds = policyBaseInfo.insureds;
        for (let i = 0; i < policyinsureds.length; i++) {
          let policyinsuredObj = policyinsureds[i];
          let insuredBirthady = policyinsuredObj.birthday.split("-");
          insured.push({
            customerId: policyinsuredObj.customerId,
            customerListId: policyinsuredObj.customerId,
            customerAlias: policyinsuredObj.customerAlias,
            gender: policyinsuredObj.gender,
            year: insuredBirthady[0],
            month: insuredBirthady[1],
            day: insuredBirthady[2],
            birthday: policyinsuredObj.birthday,
            phoneNumber: policyinsuredObj.phoneNumber,
            remark: policyinsuredObj.remark
          });
        }
        //受益人
        let benefitRelas = policyInfoResult.data.benefitRelas;
        let deathBenefit = this.policyDetails.beneficiary;
        deathBenefit.fields.length = 0;
        let arr1 = []; //第一顺位
        let arr2 = []; //第二顺位
        let arr3 = []; //第三顺位
        let obj1 = {};
        let obj2 = {};
        let obj3 = {};
        for (let i = 0; i < benefitRelas.length; i++) {
          let benefitType;
          let benefitStatus = 0;
          if (benefitRelas[i].benefitType == 1) {
            benefitType = 1;
            deathBenefit.status = 1;
            benefitStatus = 1;
          } else {
            benefitType = 2;
            benefitStatus = 2;
          }
          let benefitObj = {
            type: benefitType, //添加受益人
            name: benefitRelas[i].benefitName,
            proportion: benefitRelas[i].percentOfBenefit.toString(),
            value: ""
          };
          if (benefitRelas[i].benefitLevel == 1) {
            obj1.status = benefitStatus;
            arr1.push(benefitObj);
          } else if (benefitRelas[i].benefitLevel == 2) {
            obj2.status = benefitStatus;
            arr2.push(benefitObj);
          } else if (benefitRelas[i].benefitLevel == 3) {
            obj3.status = benefitStatus;
            arr3.push(benefitObj);
          }
        }
        if (arr1.length > 0) {
          obj1.benefits = arr1;
          deathBenefit.fields.push(obj1);
        }
        if (arr2.length > 0) {
          obj2.benefits = arr2;
          deathBenefit.fields.push(obj2);
        }
        if (arr3.length > 0) {
          obj3.benefits = arr3;
          deathBenefit.fields.push(obj3);
        }
      } else {
        this.$alert(policyInfoResult.msg);
        // return false;
      }
      let insuranceResult = await api.findInsuranceByPolicyId({
        id: policyId
      });
      if (insuranceResult.status == 1) {
        if (insuranceResult.data) {
          let productDetails = insuranceResult.data;
          for (let i = 0; i < productDetails.length; i++) {
            productDetails[i].dutyStatus = false;
            let insured = [];
            for (
              let j = 0;
              j < productDetails[i].insuredParamList.length;
              j++
            ) {
              var obj = {
                rowsName: productDetails[i].insuredParamList[j].rowsName,
                type: 0,
                paramList: [productDetails[i].insuredParamList[j].param],
                display: false
              };
              if (productDetails[i].insuredParamList[j].rowsName == "投保人") {
                obj.display = true;
              }
              productDetails[i].insuredParamList[j].param.required = "required";
              insured.push(obj);
            }
            let newArray = insured.concat(productDetails[i].productParamList);
            productDetails[i].productParamList = newArray;
            for (
              let k = 0;
              k < productDetails[i].productParamList.length;
              k++
            ) {
              for (
                let c = 0;
                c < productDetails[i].productParamList[k].paramList.length;
                c++
              ) {
                if (!productDetails[i].productParamList[k].paramList[c].value) {
                  productDetails[i].productParamList[k].paramList[c].value = "";
                }
              }
            }
            let remark = "";
            if (productDetails[i].remark) {
              remark = productDetails[i].remark;
            }
            productDetails[i].productParamList.push({
              rowsName: "备注",
              type: "textarea",
              paramList: [
                {
                  name: "remark",
                  element: "textarea",
                  max: 200,
                  value: remark
                }
              ]
            });
          }
          this.policyDetails.insurance.fields = productDetails;
        }
      } else {
        this.$alert(insuranceResult.msg);
        //  return false;
      }
      let dutyResult = await api.findPolicyLiability({
        id: policyId
      });
      if (dutyResult.status == 1) {
        if (dutyResult.data) {
          this.dutyStatus = true;
          let duties = dutyResult.data;
          for (let i = 0; i < duties.length; i++) {
            duties[i].status = false;
          }
          this.policyDetails.optduty.fields = duties;
        }
      } else {
        this.$alert(dutyResult.msg);
      }
    },
    goBack() {
      //清缓存
      this.$store.commit("clearCacheByName", "policyDetails");
      setTimeout(() => {
        this.$store.commit("setCacheByName", "policyDetails");
      }, 200);
      let policyMakeFrom = this.$store.state.policyMakeFrom;
      let type = this.$route.query.type;
      let detailPolicyId = this.$route.query.detailPolicyId;
      if (
        policyMakeFrom == "family" ||
        policyMakeFrom == "tatalList" ||
        policyMakeFrom == "popup"
      ) {
        this.$router.go(-1);
      } else {
        this.$router.push({
          path: "/trusteeshipList"
        });
      }
      this.$store.state.policyId = null;
    },
    //删除险种
    deleteInsurance(list, index, pitem) {
      list.splice(index, 1);
      this.insuranceDeleteIds.push(pitem.productId);
    },
    async openDutyContent(pitem) {
      if (pitem.dutyStatus) {
        pitem.dutyStatus = !pitem.dutyStatus;
        return false;
      }
      if (pitem.liabilityList && pitem.liabilityList.length > 0) {
        pitem.dutyStatus = !pitem.dutyStatus;
        return false;
      }
      let liabilityObj;
      let result = await api.findInsuranceLiability({
        id: pitem.productId
      });
      if (result.status == 1) {
        if (result.data) {
          liabilityObj = result.data;
        } else {
          pitem.dutyStatus = !pitem.dutyStatus;
          pitem.liabilityList = [];
          return false;
        }
      } else {
        this.$alert(result.msg);
        return false;
      }
      let yearLiabMap = liabilityObj.yearLiabMap;
      let newYearLiabMap = [];
      for (let p in yearLiabMap) {
        newYearLiabMap.push({
          year: p,
          list: yearLiabMap[p]
        });
      }
      if (newYearLiabMap.length == 0) {
        pitem.liabilityList = [];
        pitem.dutyStatus = !pitem.dutyStatus;
        return false;
      }
      let totalYear = liabilityObj.totalYear; //总共多少年
      let startYear = liabilityObj.startYear;
      let passedYear = liabilityObj.passedYear;
      pitem.yearLiabMap = newYearLiabMap;
      pitem.startYear = startYear;
      pitem.totalYear = liabilityObj.totalYear;
      pitem.passedYear = passedYear;
      pitem.maxYear = startYear + liabilityObj.totalYear - 1;
      pitem.minYear = startYear;
      let sections = [];
      for (let i = 0; i < totalYear; i++) {
        sections.push({
          id: startYear + i,
          value: i + 1
        });
        if (i == passedYear) {
          pitem.currentValue = startYear + i;
        }
      }
      pitem.section = sections;
      //遍历所有年份里面有的责任id
      let currentLiability = [];
      for (let i = 0; i < newYearLiabMap.length; i++) {
        if (newYearLiabMap[i].year == pitem.currentValue) {
          currentLiability = newYearLiabMap[i].list;
        }
      }
      let liabilityList = liabilityObj.liabilityList; //责任列表
      for (let i = 0; i < liabilityList.length; i++) {
        liabilityList[i].status = false;
        liabilityList[i].display = false;
        liabilityList[i].liabStatus = false;
        for (let j = 0; j < currentLiability.length; j++) {
          if (liabilityList[i].liabilityId == currentLiability[j].liabilityId) {
            liabilityList[i].display = true;
            liabilityList[i].limit = currentLiability[j].faceAmt;
            if (currentLiability[j].faceAmt == 0) {
              liabilityList[i].ensureStatus = true;
            }
            liabilityList[i].listStatus = true;
          }
        }
        if (
          liabilityList[i].liabNo == "HOMI_01" ||
          liabilityList[i].liabNo == "HOMI_02"
        ) {
          liabilityList[i].liabStatus = true;
          liabilityList[i].listStatus = true;
        }
      }
      pitem.liabilityList = liabilityList;
      pitem.dutyStatus = !pitem.dutyStatus;
    },
    updateDutyList(pindex, item) {
      let yearLiabMap = item.yearLiabMap;
      //遍历所有年份里面有的责任id
      let currentLiability = [];
      for (let i = 0; i < yearLiabMap.length; i++) {
        if (yearLiabMap[i].year == item.currentValue) {
          currentLiability = yearLiabMap[i].list;
        }
      }
      let liabilityList = item.liabilityList; //责任列表
      for (let i = 0; i < liabilityList.length; i++) {
        liabilityList[i].status = false;
        liabilityList[i].display = false;
        liabilityList[i].liabStatus = false;
        for (let j = 0; j < currentLiability.length; j++) {
          if (liabilityList[i].liabilityId == currentLiability[j].liabilityId) {
            liabilityList[i].display = true;
            liabilityList[i].limit = currentLiability[j].faceAmt;
            if (currentLiability[j].faceAmt == 0) {
              liabilityList[i].ensureStatus = true;
            }
            liabilityList[i].listStatus = true;
          }
        }
        if (
          liabilityList[i].liabNo == "HOMI_01" ||
          liabilityList[i].liabNo == "HOMI_02"
        ) {
          liabilityList[i].liabStatus = true;
          liabilityList[i].listStatus = true;
        }
      }
      item.liabilityList = liabilityList;
      let policyInfo = this.policyDetails.insurance.fields;
      let obj = policyInfo[pindex];
      this.$set(policyInfo, pindex, item);
    },
    openDutyList(pindex, item, dutyItem) {
      let status = dutyItem.status;
      dutyItem.status = !status;
      let policyInfo = this.policyDetails.insurance.fields;
      let obj = policyInfo[pindex];
      this.$set(policyInfo, pindex, item);
    },
    selectDutyRange(pindex, item, data) {
      item.currentValue = data;
      this.updateDutyList(pindex, item);
    },
    selectDutylimit(pindex, item, data) {
      item.currentValue = data;
      this.updateDutyList(pindex, item);
    },
    addDutylimit(pindex, item, data) {
      if (item.currentValue >= item.maxYear) {
        item.currentValue = item.currentValue;
      } else {
        item.currentValue = item.currentValue + 1;
      }
      this.updateDutyList(pindex, item);
    },
    minusDutylimit(pindex, item, data) {
      if (item.currentValue <= item.minYear) {
        item.currentValue = item.currentValue;
      } else {
        item.currentValue = item.currentValue - 1;
      }
      this.updateDutyList(pindex, item);
    },
    validatePolicyNoInput(item, type, data) {
      this.validateInput(item, "", data, type);
    },
    validatePhoneInput(item, type, data) {
      this.validateInput(item, "", data, type);
    },
    validatePremiumInput(item, type, data) {
      this.validateInput(item, "", data, type);
    },
    validateNameInput(item, type, data) {
      this.validateInput(item, "", data, type);
    },
    validateValue(data) {
      //type: 1; //日历
      let pitem = {
        boolFlag: true
      };
      this.validateInput(data.item, pitem, data.value, 1);
    },
    validateInsureValue(item, pitem, pindex, data) {
      this.validateInput(item, pitem, data, "", pindex);
    },
    validateInput(item, pitem, data, type, pindex) {
      if (
        item.element == "select" &&
        ((data == false && data != "0") || data == undefined)
      ) {
        return false;
      }
      let policyInfo = this.policyDetails.insurance.fields;
      let insuranceObj = policyInfo[pindex];
      let validateObj = item;
      if (data != "") {
        let inputStatus = false;
        //判断手机号
        if (type == 3) {
          let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
          if (!reg.test(data)) {
            inputStatus = true;
          }
        }
        if (type == 4) {
          //判断保单号
          let reg = /^[A-Za-z0-9]+$/;
          if (!reg.test(data)) {
            inputStatus = true;
            if (!pitem) {
              validateObj.boolFlag = true;
            }
            this.$toast("请输入正确的保单号");
            return false;
          } else {
            validateObj.boolFlag = false;
          }
        }
        if (type == 5) {
          let reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
          if (!reg.test(data)) {
            inputStatus = true;
            if (!pitem) {
              validateObj.boolFlag = true;
            }
            this.$toast("只支持中英文、数字、下划线");
            return false;
          } else {
            if (!pitem) {
              validateObj.boolFlag = false;
            }
          }
        }
        //判断特殊选项，如果选择终身，那么就不用输入值
        if (
          validateObj.name == "payYearsFlag" ||
          validateObj.name == "coverYearsFlag" ||
          validateObj.name == "annPeriodFlag"
        ) {
          let paramlist = pitem.paramList;
          let requiredText = "required";
          if (data == "3" || data == "6") {
            requiredText = "norequired";
          }
          for (let i = 0; i < paramlist.length; i++) {
            if (paramlist[i].element == "input") {
              if (requiredText == "norequired") {
                paramlist[i].value = "";
                paramlist[i].placeholder = " ";
              }
              paramlist[i].required = requiredText;
            }
          }
        }
        //判断交费方式为 趸交
        if (validateObj.name == "chargePeriodType") {
          let paramValue = "";
          let paramRequiredText = "required";
          if (data == "0") {
            paramValue = "1";
            paramRequiredText = "norequired";
          }
          let productParamList = insuranceObj.productParamList;
          for (let i = 0; i < productParamList.length; i++) {
            let paramList = productParamList[i].paramList;
            for (let j = 0; j < paramList.length; j++) {
              let paramObj = paramList[j];
              if (paramObj.name == "payYearsFlag") {
                if (data == "0") {
                  paramObj.value = paramValue;
                  paramObj.iptStatus = "norequired";
                } else {
                  paramObj.iptStatus = "required";
                }
              } else if (
                paramObj.name == "payYears" &&
                paramObj.element == "input"
              ) {
                if (data == "0") {
                  paramObj.value = paramValue;
                  paramObj.iptStatus = "norequired";
                } else {
                  paramObj.iptStatus = "required";
                }
              }
            }
          }
        }
        if (validateObj.element == "input") {
          if (validateObj.type == "int") {
            let reg = /^[0-9]*$/;
            if (!reg.test(data)) {
              inputStatus = true;
            }
          } else if (validateObj.type == "number") {
            let reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
            if (!reg.test(data)) {
              if (data == "0") {
                if (validateObj.name == "insNum") {
                  inputStatus = true;
                }
              } else {
                inputStatus = true;
              }
            } else {
              data = parseFloat(data).toFixed(2);
            }
          }
          if (
            parseInt(data) > validateObj.max ||
            parseInt(data) < validateObj.min
          ) {
            inputStatus = true;
            let rowsName = pitem.rowsName;
            this.$alert(
              rowsName +
                "必须大于" +
                validateObj.min +
                "且小于等于" +
                validateObj.max
            );
          }
        }
        if (inputStatus) {
          this.$toast("填写格式不对！");
          if (pitem) {
            pitem.boolFlag = true;
          }
        } else {
          if (pitem) {
            pitem.boolFlag = false;
            validateObj.value = data;
          }
        }
      } else {
        if (validateObj.required) {
          pitem.boolFlag = true;
        } else {
          if (pitem) {
            pitem.boolFlag = false;
          }
        }
      }
      if (type == 1) {
        var datetime = data.split("-");
        validateObj.year = datetime[0];
        validateObj.month = datetime[1];
        validateObj.day = datetime[2];
      }
      if (type == 2) {
        let reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
        if (!reg.test(data)) {
          this.$toast("填写格式不对！");
          if (!pitem) {
            validateObj.boolFlag = true;
          }
          return false;
        } else {
          validateObj.boolFlag = false;
          validateObj.premium = parseFloat(data).toFixed(2);
        }
      }
      if (pindex || pindex == 0) {
        this.$set(policyInfo, pindex, insuranceObj);
      }
    },
    conversionValue(data) {
      let item = data.item;
      let calendarObj = item;
      if (data.type == 0) {
        calendarObj.year = data.year;
      } else if (data.type == 1) {
        calendarObj.month = data.month;
      } else if (data.type == 2) {
        calendarObj.day = data.day;
      }
      if (data.day) {
        calendarObj.day = data.day;
      }
      if (calendarObj.year && calendarObj.month && calendarObj.day) {
        calendarObj.birthday =
          calendarObj.year + "-" + calendarObj.month + "-" + calendarObj.day;
      }
    },
    //编辑基本信息
    editPolicyInfo(item) {
      this.scorllAnimate("policy-info");
      item.editstatus = true;
    },
    //保存基本信息
    async savePolicyInfo(item) {
      let info = this.policyDetails.info;
      if (info.policyNo == "") {
        this.$toast("请填写保单号");
        return false;
      }
      if (info.premium == "") {
        this.$toast("请填写保费");
        return false;
      }
      if (info.boolFlag) {
        this.$toast("基本信息填写格式不对！");
        return false;
      }
      let result = await api.editPolicyDetail({
        policyId: info.policyId,
        bankName: info.bankName,
        policyNo: info.policyNo,
        premium: info.premium,
        effectiveStartDate: info.birthday
      });
      if (result.status == 1) {
        item.editstatus = false;
        this.initData();
      } else {
        this.$alert(result.msg);
        return false;
      }
    },
    //展开可选责任
    async spreadOptDuty(item) {
      item.status = !item.status;
    },
    //选中和取消可选责任
    selectOptDuty(optduty, pitem) {
      if (optduty.editstatus) {
        let dutyInfo = this.dutyInfo;
        if (pitem.isSelect) {
          pitem.isSelect = 0;
        } else {
          pitem.isSelect = 1;
        }
      }
    },
    //编辑可选责任
    editOptDutyInfo(item) {
      this.scorllAnimate("policy-duty");
      item.editstatus = true;
    },
    //保存可选责任
    async saveOptDutyInfo(item) {
      let products = [];
      let dutyInfo = this.policyDetails.optduty.fields;
      for (let i = 0; i < dutyInfo.length; i++) {
        let obj = {
          productId: dutyInfo[i].productId,
          liabilityIds: []
        };
        for (let j = 0; j < dutyInfo[i].liabilityVoList.length; j++) {
          if (dutyInfo[i].liabilityVoList[j].isSelect == 1) {
            obj.liabilityIds.push(dutyInfo[i].liabilityVoList[j].liabilityId);
          }
        }
        products.push(obj);
      }
      let result = await api.addPolicyLiability({
        products: products
      });
      if (result.status == 1) {
        this.initData();
        item.editstatus = false;
      } else {
        this.$alert(result.msg);
      }
    },
    //编辑险种信息
    editInsuranceInfo(item) {
      this.scorllAnimate("policy-insurance");
      item.editstatus = true;
    },
    //保存险种信息
    async saveInsuranceInfo(item) {
      let insuranceDeleteIds = this.insuranceDeleteIds;
      let result;
      let insurances = this.policyDetails.insurance.fields;
      if (insurances.length == 0) {
        this.$toast("请添加险种");
        return false;
      }
      for (let i = 0; i < insurances.length; i++) {
        for (let j = 0; j < insurances[i].productParamList.length; j++) {
          if (insurances[i].productParamList[j].boolFlag) {
            this.$toast(
              "请输入正确的" + insurances[i].productParamList[j].rowsName
            );
            return false;
          }
        }
      }
      if (insuranceDeleteIds.length > 0) {
        result = await api.deletePolicyInsuranceById({
          ids: insuranceDeleteIds
        });
        if (result.status == 1) {
        } else {
          this.$alert(result.msg);
          return false;
        }
      }
      await this.updatePolicyInsuranceInfo();
    },
    //更新险种信息
    async updatePolicyInsuranceInfo() {
      let products = [];
      let insurances = this.policyDetails.insurance.fields;
      for (let i = 0; i < insurances.length; i++) {
        let insuranceObj = {
          productId: insurances[i].productId,
          productName: insurances[i].productName,
          productNo: insurances[i].productNo
        };
        let insuredObj = {};
        let productParam = {};
        for (let j = 0; j < insurances[i].productParamList.length; j++) {
          let productParamList = insurances[i].productParamList[j];
          if (productParamList.type == 0) {
            let insuredRowsName = productParamList.rowsName;
            let insuredValue = productParamList.paramList[0].value;
            if (j == 0) {
              insuredObj.insured1Id = insuredValue;
              insuredObj.insured1RowsName = insuredRowsName;
            } else if (j == 1) {
              insuredObj.insured2Id = insuredValue;
              insuredObj.insured2RowsName = insuredRowsName;
            } else if (j == 2) {
              insuredObj.insured3Id = insuredValue;
              insuredObj.insured3RowsName = insuredRowsName;
            }
          } else {
            for (let k = 0; k < productParamList.paramList.length; k++) {
              let paramObj = productParamList.paramList[k];
              productParam[paramObj.name] = paramObj.value;
              if (paramObj.name == "remark") {
                insuranceObj.remark = paramObj.value;
              }
            }
          }
        }
        insuranceObj.insuredParam = insuredObj; //被保险人
        insuranceObj.productParam = productParam; //险种参数
        products.push(insuranceObj);
      }
      let result = await api.editPolicyDetailInsuranceInfo({
        policyId: this.policyId,
        products: products
      });
      if (result.status == 1) {
        this.initData();
        this.policyDetails.insurance.editstatus = false;
      } else {
        this.$alert(result.msg);
        return false;
      }
    },
    addInsuranceInfo(item) {
      this.$store.state.entryMode = 1;
      item.editstatus = false;
      //清缓存
      this.$store.commit("clearCacheByName", "policyInsurance");
      setTimeout(() => {
        this.$store.commit("setCacheByName", "policyInsurance");
      }, 200);
      this.$router.push({
        path: "/policyInsurance",
        query: {
          policyId: this.policyId,
          companyId: this.companyId,
          entryMode: 1 //编辑时录入险种
        }
      });
    },
    //编辑投保人信息
    editProposerInfo(item) {
      this.scorllAnimate("policy-proposer");
      item.editstatus = true;
    },
    //保存投保人信息
    async saveProposerInfo(item) {
      let proposerInfo = this.policyDetails.proposer;
      let proposer = proposerInfo.fields[0];
      let policyInfo = this.policyDetails.info;
      if (proposer.length == 0) {
        this.$toast("请添加投保人");
        return false;
      }
      if (proposer.customerAlias == "") {
        this.$toast("请填写投保人姓名");
        return false;
      }
      if (proposer.customerAlias.length <= 1) {
        this.$toast("请输入正确的姓名");
        return false;
      }
      if (proposer.boolFlag) {
        this.$toast("投保人信息填写格式不对");
        return false;
      }
      let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
      if (proposer.phoneNumber && !reg.test(proposer.phoneNumber)) {
        this.$toast("填写格式不对！");
        return false;
      }
      let result = await api.policyDetailCheckinsure({
        policyId: this.policyId,
        phoneNumber: proposer.phoneNumber,
        gender: proposer.gender,
        customerId: proposerInfo.customerId,
        customerAlias: proposer.customerAlias,
        familyId: proposer.familyId,
        birthday: proposer.birthday,
        remark: proposer.remark,
        familyId: policyInfo.familyId,
        custInsuredVos: this.policyDetails.insured.fields
      });
      if (result.status == 1) {
        if (result.data) {
          this.familyListVoList = result.data.familyListVoList;
          this.uuid = result.data.uuid;
          if (this.familyListVoList) {
            this.selectfamilyType = 0;
            this.showDialog = true;
          }
        } else {
          this.initData();
          this.policyDetails.proposer.editstatus = false;
        }
      } else {
        this.$alert(result.msg);
      }
    },
    closePopup() {
      this.showDialog = false;
      api.deleteCustomerRedis({
        id: this.uuid
      });
    },
    async selectfamily(obj) {
      if (obj) {
        this.familyId = obj.familyId;
        if (this.familyId) {
          if (this.selectfamilyType == 0) {
            let result = await api.editPolicyDetailInsure({
              familyId: this.familyId,
              uuid: this.uuid
            });
            if (result.status == 1) {
              this.showDialog = false;
              this.policyDetails.proposer.editstatus = false;
              this.initData();
            } else {
              this.$alert(result.msg);
            }
          } else if (this.selectfamilyType == 1) {
            this.editPolicyInsured();
          }
        }
      } else {
        this.$toast("请选择家庭");
      }
    },
    //删除投保人&&被保人
    deletePolicyUser(index, list, type, item) {
      list.splice(index, 1);
      if (type == 1) {
        if (item.customerId) {
          this.insuredDeleteIds.push(item.customerId);
        }
      }
    },
    //添加投保人&&被保人
    addPolicyUser(list) {
      let proposerTmp = this._.cloneDeep(this.proposerTmp);
      list.push(proposerTmp);
    },
    selectUser(type, index, item) {
      this.currentUserType = type;
      this.currentUserIndex = index;
      let customerListId;
      if (item.customerListId) {
        customerListId = item.customerListId;
      }
      this.$router.push({
        path: "/clientList",
        query: {
          customerId: customerListId
        }
      });
    },
    //编辑被保人信息
    editInsuredInfo(item) {
      this.scorllAnimate("policy-insured");
      item.editstatus = true;
    },
    //保存被保人信息
    async saveInsuredInfo(item) {
      let insured = item.fields;
      for (let i = 0; i < insured.length; i++) {
        if (insured.length == 1) {
          if (insured[i].customerAlias == "") {
            this.$toast("请填写被保人姓名");
            return false;
          }
          if (insured[i].customerAlias.length <= 1) {
            this.$toast("请输入正确的姓名");
            return false;
          }
          if (insured[i].birthday == "") {
            this.$toast("请填写被保人生日");
            return false;
          }
        } else {
          if (insured[i].birthday == "" || insured[i].customerAlias == "") {
            insured.splice(i, 1);
          }
        }
        let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
        if (insured[i].phoneNumber && !reg.test(insured[i].phoneNumber)) {
          this.$toast("填写格式不对！");
          return false;
        }
        if (insured[i].boolFlag) {
          this.$toast("填写格式不对！");
          return false;
        }
      }
      if (insured.length == 0) {
        this.$toast("请添加被保人");
        return false;
      }
      let policyInfo = this.policyDetails.info;
      let proposerInfo = this.policyDetails.proposer;
      let proposer = proposerInfo.fields[0];
      let result = await api.policyDetailCheckInsured({
        custInsuredVos: insured,
        customerId: proposerInfo.customerId,
        customerAlias: proposerInfo.customerAlias,
        deleteIds: this.insuredDeleteIds,
        familyId: policyInfo.familyId,
        policyId: policyInfo.policyId,
        effectiveStartDate: policyInfo.effectiveStartDate
      });
      if (result.status == 1) {
        this.familyListVoList = result.data.familyListVoList;
        this.uuid = result.data.insuredEditVo.uuid;
        this.customerDeleteIds = result.data.insuredEditVo.deleteIds;
        this.editCalVos = result.data.insuredEditVo.editCalVos;
        if (this.familyListVoList) {
          this.showDialog = true;
          this.selectfamilyType = 1;
        } else {
          this.familyId = policyInfo.familyId;
          this.editPolicyInsured();
        }
      } else {
        this.$alert(result.msg);
      }
    },
    async editPolicyInsured() {
      let result = await api.editPolicyInsured({
        deleteIds: this.customerDeleteIds,
        editCalVos: this.editCalVos,
        familyId: this.familyId,
        policyId: this.policyId,
        uuid: this.uuid
      });
      if (result.status == 1) {
        this.showDialog = false;
        if (result.data) {
          this.insuredPopupObj = result.data;
          this.insuredPopupDialog = true;
        } else {
          this.policyDetails.insured.editstatus = false;
          this.initData();
        }
      } else {
        this.$alert(result.msg);
      }
    },
    //添加受益人
    addDeathli(list, dbitem) {
      let benefitsSize = list.length;
      if (benefitsSize > 10) {
        return false;
      }
      let value = "";
      let beneficiary = this.policyDetails.beneficiary;
      if (beneficiary.status == 1 || dbitem.status == 2) {
        value = "2";
      }
      let noComplete = 0;
      for (let i = 0; i < dbitem.benefits.length; i++) {
        if (
          dbitem.benefits[i].name == "" ||
          dbitem.benefits[i].proportion == ""
        ) {
          noComplete++;
        }
        if (
          dbitem.benefits[i].name != "" &&
          dbitem.benefits[i].proportion != "" &&
          dbitem.benefits[i].type == 2
        ) {
          value = "2";
        }
      }
      if (dbitem.benefits.length >= noComplete && noComplete != 0) {
        this.$toast("请填写完整已添加的受益人信息再添加新的受益人");
        return false;
      }
      list.push({
        type: 3, //添加受益人
        name: "",
        proportion: "",
        value: value
      });
    },
    //删除受益人
    removeDeathli(item, pindex, index, dbitemli) {
      item.benefits.splice(index, 1);
      let beneficiary = this.policyDetails.beneficiary;
      let fields = this.policyDetails.beneficiary.fields;
      if (pindex != 0) {
        if (item.benefits.length == 0) {
          fields.splice(pindex, 1);
        }
      }
      if (dbitemli.type == 1) {
        beneficiary.status = 0;
        item.status = 0;
      }
      if (item.benefits.length == 0) {
        item.status = 0;
      }
      if (fields.length < 3) {
        beneficiary.status = 0;
      }
    },
    //编辑受益人
    editBeneficiaryInfo(item) {
      this.scorllAnimate("policy-beneficiary");
      item.editstatus = true;
    },
    //编辑单个受益人
    editDeathli(dbItem, dbitemli) {
      dbitemli.type = 3; //编辑状态
      dbitemli.value = 2;
    },
    //选择指定受益人或法定受益人
    selectDeath(dbitem, dbitemli, data) {
      let beneficiary = this.policyDetails.beneficiary;
      if (data) {
        if (dbitemli.value == 1) {
          dbitemli.type = 1;
          dbitemli.name = "法定受益人";
          dbitemli.proportion = "100";
          beneficiary.status = 1; //不能添加顺位
          dbitem.status = 1; //不能添加受益人
        } else if (dbitemli.value == 2) {
          dbitem.status = 2; //只能添加指定受益人
        }
      }
    },
    //新增顺位
    addDeathItem() {
      let deathBenefitSize = this.policyDetails.beneficiary.fields.length;
      deathBenefitSize++;
      if (deathBenefitSize > 3) {
        return false;
      }
      let flag = true;
      let beneftiStatus = false;
      let deathBenefitList = this.policyDetails.beneficiary.fields;
      for (let i = 0; i < deathBenefitList.length; i++) {
        if (flag) {
          for (let j = 0; j < deathBenefitList[i].benefits.length; j++) {
            beneftiStatus = true;
            if (
              deathBenefitList[i].benefits[j].name == "" ||
              deathBenefitList[i].benefits[j].proportion == ""
            ) {
              flag = false;
              break;
            }
          }
        }
      }
      if (flag && beneftiStatus) {
        let value = "";
        if (this.policyDetails.beneficiary.fields.length >= 1) {
          value = "2";
        }
        this.policyDetails.beneficiary.fields.push({
          status: 0,
          benefits: [
            {
              type: 3, //添加受益人
              name: "",
              proportion: "",
              value: value
            }
          ]
        });
      } else {
        this.$toast("请填写完整已添加的受益人信息");
      }
    },
    validateCharacter(item, maxLength, type) {
      let str;
      if (type == 0) {
        str = item.name;
      } else if (type == 1) {
        str = item.customerAlias;
      }
      function getLength(str) {
        return str.length;
      }
      function limitMaxLength(str, maxLength) {
        let result = [];
        for (let i = 0; i < maxLength; i++) {
          let char = str[i];
          if (/[^ -~]/.test(char)) maxLength--;
          result.push(char);
        }
        return result.join("");
      }
      if (getLength(str) > maxLength) {
        if (type == 0) {
          item.name = limitMaxLength(str, maxLength);
        } else if (type == 1) {
          item.customerAlias = limitMaxLength(str, maxLength);
        }
      }
    },
    //填写指定受益人参数
    appointDeath(dbitem, dbitemli, type, data) {
      if (type == 1) {
        data = data.replace(/[^\d]/g, "");
        if (data) {
          if (parseInt(data) > 100) {
            data = "100";
          } else if (parseInt(data) <= 0) {
            data = "";
          }
          dbitemli.proportion = data;
          let benefits = dbitem.benefits;
          let sum = 0;
          for (let i = 0; i < benefits.length; i++) {
            sum += parseInt(benefits[i].proportion);
          }
          if (sum > 100) {
            this.$toast("每个顺位的受益人比例相加不能超过100");
            dbitemli.proportion = "";
            return false;
          }
          if (dbitemli.name && data != "") {
            dbitemli.type = 2;
          }
        } else {
          dbitemli.proportion = "";
        }
      } else if (type == 0) {
        if (data) {
          if (dbitemli.proportion) {
            dbitemli.type = 2;
          }
        }
      }
    },
    //保存受益人
    async saveBeneficiaryInfo(item) {
      let beneficiary = item.fields;
      //过滤不完整的受益人信息
      for (let i = 0; i < beneficiary.length; i++) {
        for (let j = 0; j < beneficiary[i].benefits.length; j++) {
          if (
            beneficiary[i].benefits[j].name == "" ||
            beneficiary[i].benefits[j].proportion == 0
          ) {
            beneficiary[i].benefits.splice(j, 1);
            j--;
          } else if (beneficiary[i].benefits[j].name.length <= 1) {
            this.$toast("请输入正确的姓名");
            return false;
          }
        }
        if (beneficiary[i].benefits.length == 0) {
          beneficiary.splice(i, 1);
          i--;
        }
      }
      //计算每个顺位的受益人的比例相加必须为100
      let sumStatus = true;
      for (let i = 0; i < beneficiary.length; i++) {
        let sum = 0;
        for (let j = 0; j < beneficiary[i].benefits.length; j++) {
          sum += parseInt(beneficiary[i].benefits[j].proportion);
        }
        if (sum != 100) {
          sumStatus = false;
          break;
        }
      }
      if (!sumStatus) {
        this.$toast("每个顺位的受益人比例相加必须为100");
        return false;
      }
      let benefitRelas = [];
      let deathBenefitFields = this.policyDetails.beneficiary.fields;
      for (let i = 0; i < deathBenefitFields.length; i++) {
        for (let j = 0; j < deathBenefitFields[i].benefits.length; j++) {
          let obj = {
            benefitLevel: parseInt(i + 1)
          };
          obj.benefitName = deathBenefitFields[i].benefits[j].name;
          obj.percentOfBenefit = parseInt(
            deathBenefitFields[i].benefits[j].proportion
          );
          let benefitType;
          if (deathBenefitFields[i].benefits[j].type == 1) {
            benefitType = 1;
          } else if (deathBenefitFields[i].benefits[j].type == 2) {
            benefitType = 0;
          }
          obj.benefitType = benefitType;
          benefitRelas.push(obj);
        }
      }
      let result = await api.editPolicyDetailBenefit({
        policyId: this.policyId,
        benefitRelas: benefitRelas
      });
      if (result.status == 1) {
        item.editstatus = false;
        this.initData();
      } else {
        this.$alert(result.msg);
      }
    },
    addPolicy() {
      // this.totalDialog = true;
      // this.policyPrompt = true;
      this.confirmAddPolicy();
    },
    cancelAddPolicy() {
      let policyPrompt = this.policyPrompt;
      if (policyPrompt) {
        this.totalDialog = false;
        this.policyPrompt = false;
      }
    },
    confirmAddPolicy(obj) {
      // let scanning = obj.scanning;
      // let entrypolicy = obj.entrypolicy;
      // if (entrypolicy) {
      //清缓存
      this.$store.commit("clearCacheArr");
      setTimeout(() => {
        this.$store.commit("setCacheArr");
      }, 200);
      this.$store.state.policyId = null;
      this.$store.state.entryMode = 0;
      let type = this.$route.query.type;
      this.$store.state.policyMakeFrom = "popup";
      this.$router.push({
        path: "/policyMake",
        query: {
          from: "popup"
        }
      });
      // }
    },
    cancelInsuredPopupDialog() {
      this.insuredPopupDialog = false;
    },
    async confirmInsured() {
      let insurances = this.insuredPopupObj;
      let products = [];
      for (let i = 0; i < insurances.length; i++) {
        let insuranceObj = {
          productId: insurances[i].productId,
          productName: insurances[i].productName,
          productNo: insurances[i].productNo
        };
        let insuredObj = {};
        for (let j = 0; j < insurances[i].insuredParamList.length; j++) {
          let insuredParamList = insurances[i].insuredParamList[j];
          let insuredRowsName = insuredParamList.rowsName;
          let insuredValue = insuredParamList.param.value;
          if (!insuredValue) {
            this.$toast("请选择被保人");
            return false;
          }
          if (j == 0) {
            insuredObj.insured1Id = insuredValue;
            insuredObj.insured1RowsName = insuredRowsName;
          } else if (j == 1) {
            insuredObj.insured2Id = insuredValue;
            insuredObj.insured2RowsName = insuredRowsName;
          } else if (j == 2) {
            insuredObj.insured3Id = insuredValue;
            insuredObj.insured3RowsName = insuredRowsName;
          }
        }
        insuranceObj.insuredParam = insuredObj; //被保险人
        products.push(insuranceObj);
      }
      let result = await api.editPolicyInsured({
        deleteIds: this.customerDeleteIds,
        editCalVos: this.editCalVos,
        familyId: this.familyId,
        policyId: this.policyId,
        uuid: this.uuid,
        products: products
      });
      if (result.status == 1) {
        this.insuredPopupDialog = false;
        this.insuredPopupObj = [];
        this.policyDetails.insured.editstatus = false;
        this.initData();
      } else {
        this.$alert(result.msg);
      }
    },
    async saveFamilyReport() {
      let exportReportId = this.exportReportId;
      let res = await api.effectiveFamily({
        id: exportReportId
      });
      if (res.status == 1) {
        if (res.data.number == 0) {
          this.$alert("该家庭无有效保单");
          return;
        }
      } else {
        this.$alert(res.msg);
        return;
      }
      let result = await api.saveFamilyReport({
        familyId: exportReportId
      });
      if (result.status == 1) {
        this.$router.push({
          path: "/reportSimple",
          query: {
            familyId: exportReportId,
            from: "policyDetails"
          }
        });
      } else {
        if (result.status == 4) {
          let device = this.device;
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
          this.$alert(result.msg);
        }
      }
    },
    scorllAnimate(obj) {
      var vueElement = this.$refs[obj];
      scrollToElement.call(this, vueElement, 200);
    },
    // 关闭引导提示遮罩
    closeMask() {
      this.$store.state.guide.policyDetails = 1;
      this.guide.policyDetails = 1;
      this.$userGuide({
        policyDetails: 1
      });
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

.policy-details-page {
  background: #28c76a;
  color: #222;
  font-size: 28px;
  .polick-mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.75);
    z-index: 999;
    img {
      width: 96%;
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .dt-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .policy-content {
    padding: 0 25px 115px;
  }
  .policy-item {
    background: #fff;
    border-radius: 10px;
    padding: 35px 25px 50px;
    margin-top: 30px;
    .policy-title {
      font-size: 34px;
      position: relative;
      height: 40px;
      margin-bottom: 15px;
      .title {
        width: 180px;
        display: inline-block;
        position: absolute;
        font-weight: 600;
        bottom: 0;
        z-index: 2;
        i {
          font-style: normal;
        }
      }
      .edit-btn {
        position: absolute;
        right: 0;
        color: #28c76a;
        font-size: 28px;
        .edit {
          padding: 7px 20px;
          border: 2px #28c76a solid;
          border-radius: 28px;
          font-size: 26px;
          .dt-icon {
            color: #28c76a;
            position: relative;
            top: -3px;
            margin-right: 3px;
          }
        }
        .add {
          padding: 7px 20px;
          border: 2px #28c76a solid;
          border-radius: 28px;
          font-size: 26px;
          margin-right: 20px;
          .dt-icon {
            color: #28c76a;
            position: relative;
            top: -3px;
            margin-right: 3px;
          }
        }
      }
      .solid {
        background: #fee2d1;
        display: block;
        width: 180px;
        height: 24px;
        position: absolute;
        bottom: -3px;
        opacity: 0.9;
        z-index: 1;
      }
      .semicircle {
        background: #28c569;
        border-radius: 50%;
        height: 35px;
        width: 35px;
        position: absolute;
        top: 40px;
      }
      .sleft {
        left: -45px;
      }
      .sright {
        right: -45px;
      }
    }
    .w-title {
      .title {
        width: 215px;
      }
      .solid {
        width: 215px;
      }
    }
    .policy-insurance-item {
      margin-bottom: 20px;
      .specialfield {
        overflow: hidden;
        align-items: center;
        display: flex;
        .field-name {
          float: left;
          width: 0.29467rem;
          margin-right: 0.055rem;
          font-size: 0.0445rem;
        }
        .field-content {
          float: left;
          width: 436px;
        }
        .field-item {
          float: left;
          width: 50%;
          .weui-cell__hd {
            display: none;
          }
          .weui-select {
            padding-left: 0;
          }
          .vux-x-input {
            padding: 6px;
            width: 0.24rem;
            font-size: 0.04rem;
          }
        }
        .itemIpt {
          float: left;
        }
        .vux-selector-readonly {
          padding: 6px 0;
          text-align: left;
          color: #666;
          font-size: 0.04rem;
        }
        .vux-x-input.disabled .weui-input {
          color: #666;
          -webkit-text-fill-color: #666;
        }
      }
    }
    .policy-text {
      font-size: 30px;
      p {
        line-height: 50px;
        position: relative;
        padding-right: 50px;
      }
      .dt-icon {
        color: #28c76a;
        position: absolute;
        right: 0;
        top: 5px;
      }
    }
    .policy-optduty {
      margin-top: 40px;
      .policy-optduty-li {
        margin-top: 25px;
        padding-bottom: 30px;
        border-bottom: 1px #dedede solid;
        .title {
          color: #222222;
          font-size: 30px;
          position: relative;
          .dt-icon {
            position: absolute;
            color: #656565;
            right: 10px;
          }
        }
        li {
          font-size: 26px;
          margin-top: 35px;
          color: #666666;
          position: relative;
          .operation {
            position: absolute;
            right: 45px;
            .icon-select {
              height: 39px;
              width: 39px;
              border: 2px #28c76a solid;
              border-radius: 50%;
              font-style: normal;
              display: block;
            }
            .icon-current {
              color: #28c76a;
              height: 46px;
              width: 46px;
            }
          }
        }
      }
    }
    .policy-table-tmp {
      flex: 1;
      line-height: 78px;
      .li-blue {
        text-align: center;
        background: #f2fcf6;
        border-right: 1px #dedede solid;
      }
      .li-value {
        padding-left: 5%;
        color: #666;
      }
    }
    .policy-table {
      border: 1px #dedede solid;
      border-bottom: none;
      margin-top: 25px;
      .policy-table-li {
        border-bottom: 1px #dedede solid;
        overflow: hidden;
        align-items: center;
        display: flex;
        .fl {
          float: left;
        }
        .w38 {
          padding: 25px 15px;
        }
        .weui-textarea {
          font-size: 0.04rem;
        }
        .warn-title {
          color: #f00;
        }
        .weui-icon-warn {
          display: none;
        }
      }
      .t-textarea-content {
        background: #f2fcf6;
        .li-value {
          border-left: 1px #dedede solid;
          padding-left: 5%;
          padding-top: 10px;
          background: #fff;
          position: relative;
          left: -0.00133rem;
          min-height: 0.13rem;
        }
        .li-blue {
          border-right: none;
        }
      }
      .itemIpt {
        font-size: 0.04rem;
      }
      .w30 {
        width: 32%;
      }
      .w33 {
        width: 33.3%;
      }
      .w50 {
        width: 50%;
      }
      .w15 {
        width: 15%;
      }
      .w35 {
        width: 35%;
      }
      .w38 {
        width: 38%;
      }
      .w55 {
        width: 53%;
      }
      .w62 {
        width: 62%;
      }
      .w70 {
        width: 70%;
      }
      .w85 {
        width: 85%;
      }
      .li-blue {
        text-align: center;
        background: #f2fcf6;
        border-right: 1px #dedede solid;
        padding: 25px 0;
      }
      .li-value {
        color: #666;
        padding: 20px 0 20px 5%;
        .weui-cells {
          margin-top: 0;
        }
      }
      .bankName {
        padding: 2px 0 2px 5%;
      }
      .editinsurance {
        padding: 0 0 0 5%;
        .weui-cells:before {
          border: none;
        }
        .vux-x-input {
          float: left;
          width: 0.3rem;
        }
        .weui-cells:after {
          border: none;
        }
      }
      .special {
        .weui-cell {
          float: left;
          width: 105px;
        }
      }
      .t-textarea {
        line-height: 42px;
      }
      .weui-select {
        padding-left: 0;
      }
      .li-center {
        text-align: center;
        padding: 20px 0;
        .vux-input-icon {
          display: none;
        }
      }
      .editgender {
        padding: 1px 0;
        .weui-select {
          padding: 0 9px;
        }
      }
      .li-note_l {
        text-align: center;
        vertical-align: middle;
        display: table-cell;
        background: #f2fcf6;
      }
      .li-note_r {
        padding: 10px;
        width: 66.7%;
        background: #fff;
        border-left: 1px #dedede solid;
        line-height: 40px;
      }
      .tr-blue {
        background: #f2fcf6;
      }
      .br {
        border-right: 1px #dedede solid;
      }
      .bn {
        border-right: none;
      }
      .c666 {
        color: #666;
      }
      .weui-cell {
        padding: 0;
      }
      .premium {
        .weui-cell {
          display: inline-block;
          width: 145px;
        }
        .weui-cell__bd {
          display: inline-block;
          width: 115px;
          flex: auto;
        }
        .weui-cell__ft {
          display: inline-block;
        }
      }
      .ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .policy-user {
      position: relative;
      .policy-table-li {
        position: relative;
        .li-value {
          padding-left: 10px;
        }
        .sr_ipt {
          margin-left: 5px;
          margin-right: 0;
          .weui-cell__bd {
            width: 30px;
          }
        }
        .sr_fr {
          margin-right: 3px;
          .weui-cell__bd {
            min-width: 36px;
          }
        }
        .vux-datetime {
          right: 2px;
        }
      }
      .calendar-style {
        height: auto;
        padding-left: 0 !important;
      }
      .icon-user {
        float: left;
        color: #28c76a;
        margin: 20px;
      }
      .policy-user-name {
        align-items: center;
        display: flex;
        padding: 0;
        .weui-cell {
          float: left;
          width: 85%;
        }
        .weui-cell:before {
          border-top: none;
        }
      }
      .weui-input {
        text-align: center;
      }
      .delete {
        position: absolute;
        right: 20px;
        bottom: -60px;
        .dt-icon {
          color: #fff;
          background: #28c76a;
          border-radius: 50%;
          margin-left: 15px;
          position: relative;
          top: -4px;
        }
      }
      .weui-icon-clear {
        display: none !important;
      }
    }
    .mbt80 {
      margin-bottom: 80px;
    }
    .mbt60 {
      margin-bottom: 60px;
    }
    .policy-duty {
      .icon-spread {
        color: #ccc;
      }
      .icon-retract {
        color: #ccc;
      }
      .openDuty {
        font-size: 30px;
        text-align: center;
        color: #ccc;
        font-weight: bold;
        margin-top: 30px;
        .dt-icon {
          margin-left: 10px;
          position: relative;
          top: -2px;
        }
      }
      .open {
        color: #333;
        .icon-retract {
          color: #333;
        }
      }
      .policy-duty-item {
        padding: 30px 0;
        margin-top: 20px;
        position: relative;
        .title {
          height: 72px;
          line-height: 72px;
          background: #f9fefb;
          border-radius: 0 33px 33px 0;
          width: 90%;
          font-size: 32px;
          position: relative;
          padding-left: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .t-icon {
            position: absolute;
            top: 15px;
            left: 30px;
            display: inline-block;
            width: 33px;
            height: 40px;
            background: url("../../assets/imgs/diseaseicon.png") no-repeat;
            background-size: cover;
          }
        }
        .title-duty {
          font-size: 32px;
          margin: 20px 30px 10px 90px;
          position: relative;
          .dt-icon {
            color: #c0c0c0;
            position: absolute;
            right: 0;
            top: 3px;
          }
          em {
            font-style: normal;
          }
        }
        .duty-item-content {
          margin: 0 30px 0 90px;
          p {
            margin-top: 20px;
            span {
              margin-right: 20px;
            }
            i {
              font-style: normal;
              position: relative;
              top: -3px;
            }
          }
          .len {
            line-height: 50px;
          }
        }
      }
      .color0 {
        background: #fcf3f2;
      }
      .color1 {
        background: #f2f4fc;
      }
    }
    .policy-beneficiary {
      font-size: 30px;
      .title {
        height: 80px;
        text-align: center;
        font-size: 30px;
        line-height: 80px;
        margin-top: 20px;
        background: #f2fcf6;
      }
      .policy-ben-list {
        .icon-user {
          color: #000;
          position: relative;
          top: 7px;
          margin-right: 15px;
          width: 44px;
          height: 44px;
          display: inline-block;
          background-image: url("../../assets/imgs/user-syr.png");
          background-repeat: no-repeat;
          background-size: cover;
          i {
            color: #5374f2;
          }
        }
      }
      i {
        font-style: normal;
      }
      .weui-icon-clear {
        position: absolute;
        right: 0.09rem;
        bottom: 0.05rem;
      }
      .appoint_death_name {
        .weui-icon-clear {
          position: absolute;
          right: 0.02rem;
        }
      }
      span {
        i {
          color: #5374f2;
        }
      }
      p {
        margin-top: 20px;
      }
      .mr70 {
        margin-right: 70px;
        width: 49%;
        display: inline-block;
      }
      em {
        display: inline-block;
        font-style: normal;
        overflow: hidden;
      }
      .user-name {
        display: inline-block;
        max-width: 200px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        position: relative;
      }
    }
  }
  .pdt30 {
    padding-bottom: 35px;
  }
  .pdt20 {
    padding-bottom: 15px;
  }
  .policy-details-footer {
    font-size: 30px;
    text-align: center;
    height: 100px;
    overflow: hidden;
    line-height: 100px;
    margin-bottom: 3px;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 3;
    span {
      width: 49.7%;
      float: left;
    }
    .nextPolicy {
      background: #fff;
    }
    .generateReport {
      background: #fcd222;
      margin-left: 0.6%;
    }
  }
  .duty-list-content {
    border-top: 1px #dedede solid;
    margin-top: 30px;
  }
  .duty-compute {
    .weui-cells:before {
      border: none;
    }
    .weui-cells:after {
      border: none;
    }
    .duty-tips {
      text-align: center;
      margin-top: 15px;
    }
    .duty-compute-select {
      overflow: auto;
      padding-top: 10px;
      color: #222222;
      text-align: center;
      margin: 30px auto 10px;
      width: 400px;
      .weui-cells {
        margin-top: 0;
        border: 1px #bfbebe solid;
        border-radius: 5px;
      }
      .compute-selector {
        width: 170px;
        margin-left: 19px;
        margin-right: 19px;
        position: relative;
        float: left;
      }
      .compute-select-style {
        height: 60px;
        border-radius: 10px;
      }
      .compute-name {
        float: left;
        position: relative;
        height: 60px;
        line-height: 60px;
      }
    }
    .duty-compute-range {
      position: relative;
      .duty-range-bar {
        margin: 0 50px;
      }
      .range-handle {
        height: 40px;
        width: 40px;
        background-color: #e0dfdf;
        border: 2px #fff solid;
        margin-top: 0.018rem;
      }
      .range-bar {
        height: 13px !important;
      }
      .range-quantity {
        background: #a9e9c4;
      }
      .weui-cell {
        padding: 10px 40px;
      }
      .weui-cells {
        overflow: auto;
        padding: 5px 0;
        width: 100%;
        margin-top: 0;
      }
      .vux-range-input-box {
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
      .range-min,
      .range-max {
        font-size: 28px;
      }
      .range-min {
        left: -0.1rem;
      }
      .icon-add2 {
        padding: 5px;
        height: 26px;
        width: 26px;
        border-radius: 50%;
        color: #28c76a;
        background: #fff;
        border: 3px #28c76a solid;
        position: absolute;
        right: 5px;
        top: 15px;
      }
      .icon-remove {
        color: #28c76a;
        background: #fff;
        border-radius: 50%;
        padding: 5px;
        height: 26px;
        width: 26px;
        border: 3px #28c76a solid;
        position: absolute;
        left: 5px;
        top: 15px;
      }
    }
  }
  .calendar-style {
    position: relative;
    height: 70px;
    .calendar-content {
      .sr_ipt {
        padding: 0;
        margin-left: 0 !important;
      }
      .sr_fr {
        margin-left: 2px !important;
      }
      .vux-datetime {
        right: 10px;
        top: 8px;
      }
    }
  }
  .death_bd {
    margin-top: 30px;
    margin-bottom: 20px;
    padding-bottom: 30px;
    background: #fff;
    .death_item {
      margin-top: 20px;
    }
    .death_bt {
      text-align: center;
      position: relative;
      line-height: 70px;
      font-size: 30px;
      background: #f2fcf6;
      padding: 10px;
      border-radius: 10px;
      .icon-add {
        position: absolute;
        left: 20px;
        top: 20px;
      }
    }
    .dt-icon {
      color: #fff;
      background: #28c76a;
      border-radius: 15px;
      padding: 5px;
      width: 36px;
      height: 36px;
    }
    .death_li {
      position: relative;
      margin-top: 15px;
      border-bottom: 1px #dedede solid;
      .icon-user {
        position: absolute;
        left: 0px;
        top: 24px;
        color: #252525;
        width: 44px;
        height: 44px;
        background-image: url("../../assets/imgs/user-syr.png");
        background-repeat: no-repeat;
        background-size: cover;
      }
      .icon-remove {
        position: absolute;
        top: 25px;
        right: 20px;
        border-radius: 50%;
      }
      .select_death {
        margin-left: 60px;
        .weui-cells:before {
          border: none;
        }
        .weui-cells {
          background: transparent;
          margin-top: 0;
        }
        .appoint_death {
          position: relative;
          b {
            position: absolute;
            right: 0.02rem;
            bottom: 30px;
            font-style: normal;
            font-weight: 100;
          }
          .weui-cell {
            padding: 10px 0;
          }
          .weui-cell:before {
            border: none;
          }
          .weui-cell__hd {
            width: 42px;
          }
          .weui-cell__bd {
            border: 1px #ddd solid;
            border-radius: 5px;
            flex: 0;
          }
          .weui-input {
            text-align: center;
          }
          .weui-input::-webkit-input-placeholder {
            font-size: 0.04rem;
            text-align: center;
          }
        }
        .select_death_user {
          height: 85px;
        }
        .select_death_content {
          position: relative;
          padding-bottom: 30px;
          .weui-cells:after {
            border-bottom: none;
          }
          .icon-remove {
            top: 15px;
          }
        }
      }
      .death-user {
        padding-bottom: 30px;
        padding-left: 64px;
        font-size: 30px;
        padding-top: 30px;
        position: relative;
        b {
          font-weight: normal;
          color: #5477e9;
          overflow: hidden;
          display: inline-block;
        }
        label {
          width: 40%;
          display: inline-block;
        }
        .label-name {
          width: 55%;
        }
        .ml24 {
          margin-left: 20px;
        }
        em {
          font-style: normal;
          display: inline-block;
        }
      }
    }
    .weui-select {
      border: 1px #ddd solid;
    }
  }
  .add-user {
    padding-top: 30px;
    font-size: 30px;
    text-align: center;
    margin-bottom: 10px;
    .icon-add2 {
      margin-right: 15px;
      border-radius: 50%;
      color: #fff;
      background: #28c76a;
      padding: 7px;
      width: 28px;
      height: 28px;
      position: relative;
      top: -4px;
    }
  }
  .insuredPopup {
    background: #fff;
    border-radius: 10px;
    position: absolute;
    top: 30%;
    left: 50%;
    width: 600px;
    margin-left: -300px;
    z-index: 1001;
    color: #333333;
    font-size: 28px;
    .confirm {
      background: #28c76a;
      height: 80px;
      line-height: 80px;
      text-align: center;
      color: #fff;
      border-radius: 10px;
      width: 540px;
      font-size: 30px;
      margin: 30px;
    }
    .title {
      padding: 50px 40px 30px;
      font-size: 30px;
      font-weight: 600;
      border-bottom: 1px #e8e8e8 solid;
    }
    .list-item {
      margin: 45px 45px 0;
      font-size: 28px;
      .tit {
        border-left: 9px #28c76a solid;
        padding-left: 20px;
      }
      .list-info {
        overflow: hidden;
        margin-top: 20px;
        .list-name {
          float: left;
          width: 40%;
          height: 75px;
          line-height: 75px;
        }
        .list-value {
          float: left;
          width: 60%;
        }
      }
    }
  }
}
@media screen and (max-width: 320px) {
  .policy-details-page .policy-item .policy-user .policy-table-li {
    .sr_fr {
      .weui-cell__bd {
        min-width: 30px;
      }
    }
    .sr_ipt {
      margin-left: 3px;
      .weui-cell__bd {
        width: 26px;
      }
    }
    .editgender {
      .weui-select {
        padding: 0 6px;
      }
    }
  }
  .policy-details-page .policy-item .policy-table .special {
    .weui-cell {
      width: 89px;
    }
  }
}
</style>
