<template>
  <div class="ig-switch" :class="{checked:currentValue}">
    <input type="checkbox" class="ig-switch-input" v-model="currentValue" :disabled="disabled">
    <span class="label" @click="changeCurrentValue" :class="{optlable:disabled}">{{ currentValueLabel }}</span>
  </div>
</template>
<script>

/**
 * dt-switch 组件
 * @des:
 * 主要针对 展示为 inputType 为 switch 类型组件的展示
 * @props
 * value: v-model 的绑定值支持双向绑定
 * options: 可选值列表，固定的为两组数据
 * value-map: 单个可选对象中标识 value 和 key 值的属性名数组，具体用法同vux的selector 组件
 * disabled: 控制组件是否可用
 */
export default {
  name: "dt-switch",
  props: {
    value:{
      type:[Boolean, String]
    },
    options:{
      type: Array,
      default() {
        return [
        {
          text:"男",
          id:"M",
        },
        {
          text:"女",
          id:"F"
        }
        ]
      },
      required: true
    },
    valueMap: {
      type: Array,
      default() {
        return ["id", "text"]
      },
      validator (val) {
        if (!val.length || val.length !== 2) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[dt-switch error] dt-switch prop:valueMap\'s length should be 2')
          }
          return false
        }
        return true
      }
    },
    inline:{
      type:Boolean
    },
    disabled:{
      type:Boolean,
      default:false
    },
  },
  watch: {
    currentValue(value) {
      if (this.options.length === 0) { return }
      let selectValue = this.currentValue?(typeof this.options[0]=="object"?this.options[0][this.valueMap[0]]:this.options[0]):(typeof this.options[0]=="object"?this.options[1][this.valueMap[0]]:this.options[1])

      this.$emit('on-change', selectValue)
      this.$emit('input', selectValue)
    },
    value (val) {
      this.currentValue = this.toBoolean(val)
    }
  },
  data() {
    return {
      currentValue: this.toBoolean(this.value)
    }
  },
  computed: {
    currentValueLabel() {
      if (this.options.length === 0) { return }
      return this.currentValue?(this.options[0][this.valueMap[1]]?this.options[0][this.valueMap[1]]:this.options[0]):(this.options[1][this.valueMap[1] ]?this.options[1][this.valueMap[1] ]:this.options[1])
    }
  },
  created() {
    
  },
  methods: {
    toBoolean (val) {
      if (this.options.length === 0) { return }

      if(val==this.options[0]||val==this.options[0][this.valueMap[0]]){
        return true
      } else{
        return false
      }
    },
    changeCurrentValue(ev) {
      if (this.disabled) { return }
      this.currentValue = !this.currentValue
    }
  }
}
</script>
<style scoped lang="less">
.ig-switch {
  position: relative;
  display: inline-block;
  .label {
    position: absolute;
    line-height: 20px;
    left: 35px;
    top: 50%;
    transform: translateY(-50%);
  }
  .optlable {
    opacity:0.6;
  }
}

.ig-switch.checked {
  .label {
    left: 10px;
    color: #fff;
  }
}

.ig-switch.inline {
  display: inline-block;
}

.ig-switch-input {
  position: relative;
  vertical-align: middle;
  -webkit-appearance: none;
  appearance: none;
  display: inline-block;
  width: 60px;
  height: 32px;
  border: 2px solid #dfdfdf;
  outline: 0;
  border-radius: 16px;
  box-sizing: border-box;
  background-color: #ffffff;
  transition: background-color 0.1s, border 0.1s;
}

.ig-switch-input:checked {
  border: 2px solid #f95454;
  background-color: #f95454;
}

.iig-switch-input:before {
  content: " ";
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 30px;
  border-radius: 15px;
  background-color: #FDFDFD;
  transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
}

.ig-switch-input:after {
  content: " ";
  position: absolute;
  top: 0;
  left: 1px;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #FFFFFF;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
}

.ig-switch-input:checked:after {
  transform: translateX(28px);
}
.ig-switch-input[disabled] {
  opacity: 0.6;
}

</style>