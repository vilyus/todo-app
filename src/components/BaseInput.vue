<template>
  <BaseField
    class="BaseInput"
    v-bind="{ ...$attrs, value: model }"
    v-on="$listeners"
  >
    <template #default="{ generatedId, on: { focus: onFocus, blur: onBlur } }">
      <input
        v-model="model"
        :id="generatedId"
        @focus="onFocus"
        @blur="onBlur"
        @keyup.enter="$emit('enter')"
      />
    </template>

    <template v-if="$slots.append || $scopedSlots.append" #append>
      <slot name="append" />
    </template>
  </BaseField>
</template>

<script>
export default {
  name: 'BaseInput',

  inheritAttrs: false,
  model: { prop: 'value', event: 'input' },

  props: {
    value: { type: String, default: '' },
  },

  data: () => ({
    model: '',
  }),

  watch: {
    value: {
      handler(value) { this.model = value },
      immediate: true,
    },

    model: {
      handler(model) {
        if (model !== this.value) this.$emit('input', model)
      },
      immediate: true,
    },
  },
}
</script>
