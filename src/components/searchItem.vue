  <template>
  <div class="searchItem">
    <flexbox class="search-item-container">
      <flexbox-item class="serarch-text-container">
        <form action=".">
          <input type="search" ref="searchDom" name="" class="search-text" :placeholder="placeholder" v-model="currentValue" @change="change" @input="input" @blur="blur" @focus="focus" :disabled="disable">
          <!-- 添加隐藏域，阻止移动端搜索刷新页面bug -->
          <input type="text" style="display:none;" />
        </form>
        <icon v-show="currentValue != ''" @click.native="clear" class="dt-icon clear" name="clear"></icon>
        <span class="search-icon" @click="searchFor($event)">
          <x-icon class="xIcon" type="ios-search" size="30" style="fill: #ccc;"></x-icon>
        </span>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem } from "vux";
export default {
  name: "searchItem",
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ""
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  data() {
    return {
      currentValue: "",
      flag: true
    };
  },
  created() {
    this.currentValue = this.value;
  },
  mounted() {
    // 解决onInput事件中文输入法下多次触发事件
    this.$nextTick(() => {
      let searchDom = this.$refs.searchDom;
      searchDom.addEventListener("compositionstart", () => {
        this.flag = false;
      });
      searchDom.addEventListener("compositionend", () => {
        this.flag = true;
      });
    });
  },
  updated() {},
  watch: {
    value(val) {
      this.currentValue = val;
    }
  },
  components: {
    FlexboxItem,
    Flexbox
  },
  methods: {
    focus() {
      this.$emit("focus", this.currentValue);
    },
    blur() {
      this.$emit("blur", this.currentValue);
    },
    input() {
      setTimeout(() => {
        if (this.flag) {
          this.$emit("input", this.currentValue);
        }
      }, 0);
    },
    change() {
      this.$emit("change", this.currentValue);
    },
    searchFor(e) {
      this.$emit("submit", this.currentValue);
    },
    clear() {
      let searchDom = this.$refs.searchDom;
      this.currentValue = "";
      this.$emit("clear", this.currentValue);
      searchDom.focus();
    }
  }
};
</script>

<style scoped lang="less">
.searchItem {
  position: relative;
  width: 100%;
  height: 102px;
  padding: 7px 16px;
  .search-item-container {
    height: 100%;
  }
  .serarch-text-container {
    position: relative;
    width: 100%;
    height: 100%;
    padding-top: 9px;
    .search-text {
      display: inline-block;
      padding-left: 20px;
      padding-right: 150px;
      width: 100%;
      height: 70px;
      line-height: 70px;
      background: #fbf9fa;
      border: 2px solid #e9e9e9;
      left: 5%;
      top: 4px;
      border-radius: 30px;
    }
    .clear {
      position: absolute;
      width: 50px;
      height: 50px;
      right: 96px;
      top: 50%;
      transform: translateY(-42%);
    }
    .search-icon {
      position: absolute;
      width: 60px;
      height: 60px;
      right: 1%;
      top: 14px;
      background: #fbf9fa;
      .icon {
        color: #ccc;
      }
    }
    // 重置search框内清除图标样式
    input[type="search"]::-webkit-search-cancel-button {
      -webkit-appearance: none;
    }
  }
}
</style>
