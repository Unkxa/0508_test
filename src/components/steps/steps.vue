<template>
  <ul class="steps">
    <li
      v-for="(item, i) in dataSource"
      :key="i"
      class="itemStep"
      :class="{
        'step--active': current === i,
        'step--finished': item.status === 'finished',
        'step--progress': item.status === 'progress',
        'step--disabled': item.disabled,
      }"
    >
      <div v-if="item.status !== 'finished'" class="step-icon" @click="stepChange(item, i)">
        {{ i + 1 }}
      </div>
      <div v-if="item.status === 'finished'" class="step-icon" @click="stepChange(item, i)">
        <ab-icon class="icon-size" className="FCcheck"></ab-icon>
      </div>
      <div class="step-name">{{ item.title }}</div>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'steps',
  props: {
    dataSource: {
      type: Array,
      default: () => [],
    },
    current: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      currentStep: 0,
    }
  },
  methods: {
    stepChange(current, index) {
      if (current.disabled) {
        return false
      }
      this.$emit('change', index)
    },
  },
}
</script>

<style lang="less" scoped>
.steps {
  display: flex;
  align-items: flex-start;
  padding: 16px 0;
  margin: 0 @marginBase * 2;
  background-color: #ffffff;
  .itemStep {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    flex: 1;
    font-size: 12px;
  }
  .step-icon {
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border-radius: 28px;
    background-color: #f2f3f5;
    color: #4e5969;
    font-size: 16px;
    cursor: pointer;
    &::after {
      position: absolute;
      top: 13.5px;
      width: calc(100% - 48px);
      height: 1px;
      background-color: #e5e6eb;
      margin-left: 16px;
      content: '';
    }
  }
  .itemStep:last-child .step-icon::after {
    display: none;
  }
  .step-description-box {
    margin-top: 4px;
  }
  .step-name {
    font-size: 16px;
    color: #1d2129;
    margin-top: 12px;
    font-weight: 500;
  }
  .step-description {
    font-size: 12px;
    color: #1d2129;
  }
  .description-count {
    // height: 10px;
    font-size: 14px;
    color: #165dff;
  }

  .step--finished {
    .step-icon {
      background-color: #e6f1ff;
      color: #165dff;
      &:hover {
        cursor: pointer;
      }
      &::after {
        background-color: #165dff;
      }
    }
  }
  .step--progress {
    .step-icon {
      background-color: #e6f4ff;
      color: #165dff;
      &:hover {
        cursor: pointer;
      }
      &::after {
        background-color: rgba(0, 0, 0, 0.06);
      }
    }
  }
  .step--waiting {
    .step-icon {
      &:hover {
        cursor: pointer;
      }
      &::after {
        background-color: #165dff;
      }
    }
  }
  .step--active {
    .step-icon {
      background-color: #165dff;
      color: #ffffff;
      cursor: pointer;
    }
  }
  .step--disabled {
    .step-icon {
      cursor: not-allowed;
    }
  }
  .icon-size {
    font-size: 16px;
  }
}
</style>
