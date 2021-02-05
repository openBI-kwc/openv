<template lang="pug">
  .tooltip-box
    ElTooltip(v-if="content" :content="content" :placement="placement" :offset="offset" :effect="effect" :popperOptions="{removeOnDestroy: true}")
      .content(slot="content") {{content}}
      slot(v-if="content")
    slot(v-else)
</template>
<script>
export default {
  props: {
    effect: {
      type: String,
      default: 'dark'
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    offset: {
      type: Number,
      default: 0
    },
    content: {
      type: String,
      default: ''
    }
  }
}
</script>
