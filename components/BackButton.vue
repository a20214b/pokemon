<template>
  <button class="back-button">
    <slot />
  </button>
</template>

<script>
export default {
  methods: {
    onClickButton() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.back-button {
  border-radius: 0.5rem;
  border: solid 4px #555;
  padding: 0.4em 1em;
  cursor: pointer;
  display: inline-block;
  background-color: #fff;
  color: #555;
  text-decoration: none;
}

.back-button:not(:disabled):hover {
  transform: translate(-1px, -1px);
  box-shadow: 1px 1px 0 #555;
}

.back-button:not(:disabled):active {
  transform: translate(1px, 1px);
  box-shadow: none;
}

.back-button:disabled {
  border-color: #aaa;
  cursor: default;
}
</style>
