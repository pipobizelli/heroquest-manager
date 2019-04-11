<template>
  <section class="menu" :style="menuStyle">
    <ul class="menu__assets">
      <li class="menu__asset">
        <slot></slot>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  props: ['assets'],
  data () {
    return {
      menuStyle: '',
      visible: false
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/base';
.menu {
  @extend .container;
  background: lightgray;
  margin: 0 0 0 30px;
  padding: 10px;
  position: absolute;
  z-index: 999;

  &:before {
    content: "";
    position: absolute;
    display: block;
    top: 7px;
    left: -7px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 10px 10px 10px 0;
    border-color: transparent lightgray transparent transparent;
  }

  &--sub {
    // display: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 100%;

    &:before {
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
