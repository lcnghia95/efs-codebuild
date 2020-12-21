<template>
  <div class="lock-product text-center p-40">
    <div class="password-title">
      <b>{{t(21)}}</b>
    </div>
    <p class="mt-40 fs-12 hint">
      {{t(22)}}
    </p>
    <input
      class="input-field pl-20 pr-20"
      :class="isError ? 'is-error' : ''"
      v-model="password"
      :placeholder="isError ? t(35) : t(36)"
      type="password"
    />
    <div class="flex mid center mb-50">
      <button
        class="btn-lock flex mid center btn mt-10"
        @click="unlockArticle"
        :class="{ disabled: loading }"
        :disabled="loading || !password.trim()"
      >
        <span>{{t(23)}}</span>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: "article-password-lock",
  props: ["unlock"],
  data: () => ({
    loading: false,
    isError: false,
    password: ""
  }),
  methods: {
    unlockArticle() {
      this.unlock(this.password)
        .catch(() => (this.isError = true))
        .finally(() => (this.loading = false));
    }
  }
};
</script>
<style scoped lang="scss">
.lock-product {
  background: #eee;
  max-width: 620px;
  width: 100%;
  align-self: center;
  //border-radius: 10px;
  .password-title {
    display: inline-block;
    font-size: 26px;
    border-bottom: 1px solid #d9d9d9;
  }
  .hint {
    color: #2d2d2d;
  }
  .input-field {
    height: 35px;
    max-width: 310px;
    width: 100%;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    &::placeholder {
      color: #9f9f9f;
    }
    &.is-error {
      border: 1px solid red;
      &::placeholder {
        color: red;
      }
    }
  }
  .btn {
    color: white;
    width: 310px;
    background: #00a0e9;
    height: 50px;
  }
  .disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
</style>
