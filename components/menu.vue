<template>
  <section class="menu" v-show="visible">
    <div class="menu__close" @click="close" @contextmenu.prevent="close"></div>
    <article class="menu__gui" :style="menuStyle">
      <slot></slot>
    </article>
  </section>
</template>

<script>
export default {
  props: ['visible', 'menuStyle', 'close'],
  methods: {
    closeMenu () {
      this.closeSubMenus()
    },
    closeSubMenus () {
      let assets = Object.values(this.assets)
      assets.filter(a => a.sub).map(a => {
        a.show = false
      })
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/base';
.menu {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &__gui {
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
  }

  &__close {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 998;
  }

  &__sub {
    position: relative;
  }

  &__list {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 100%;

    &:before {
      top: 50%;
      transform: translateY(-50%);
    }
  }

  &__item {
    img {
      height: 23px;
    }

    span {
      font-size: 12px;
      line-height: 25px;
    }
  }

  &__item + &__item {
    margin-top: 10px;
  }

  &__assets + &__assets {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 5px dotted gray;
  }

  &__asset + &__asset {
    border-top: 1px solid gray;
    margin-top: 10px;
    padding-top: 10px;
  }

  &__link {
    color: black;
    text-decoration: none;
    display: grid;
    grid-column-gap: 10px;
    grid-template-columns: auto 1fr;

    &:hover {
      font-weight: bold;
      img {
        opacity: .5;
      }
    }
  }
}
</style>
