<template>
  <div class="back-test">
    <template v-if="GGJBacktest">
      <div class="flex space-between" id="st-back-test-ggj">
        <h4>{{ $t('7', {name: GGJBacktest.nickName}) }}</h4>
        <a @click="onShowModal" class="btn download-backtest" v-if="!userId">
          {{ $t('6') }}
        </a>
        <a :href="`/file/products/${detail.displayProductId || id}/user/${GGJBacktest.id}/backtest`" class="btn download-backtest" v-else>
          {{ $t('6') }}
        </a>
      </div>
      <iframe id="back_test_contents" width="1000px" height="600px" frameborder="0" scroll="no" class="mb-50" 
              :src="`/backtest/render/${detail.displayProductId || id}/user/${GGJBacktest.id}/1`"
      ></iframe>
    </template>
    <div class="flex space-between mb-20">
      <h4>{{ $t('2') }}</h4>
      <a @click="onShowModal" class="btn download-backtest" v-if="!userId">
        {{ $t('6') }}
      </a>
      <a :href="'/file/products/' + (detail.displayProductId || id) + '/backtest'" class="btn download-backtest" v-else>
        {{ $t('6') }}
      </a>
    </div>
    <iframe id="back_test_contents" frameborder="0" scroll="no" width="100%"
            :src="'/backtest/render/' + (detail.displayProductId || id) + '/1'"
    ></iframe>
    <template v-if="displayData.length">
      <div v-for="item in displayData" class="mt-80 mb-50" :key="'backtest-' + item.id">
        <div class="flex space-between mb-20 mt-50" id="st-back-test">
          <h4>{{ $t('7', {name: item.nickName}) }}</h4>
          <a @click="onShowModal" class="btn download-backtest" v-if="!userId">
            {{ $t('6') }}
          </a>
          <a :href="`/file/products/${detail.displayProductId || id}/user/${item.id}/backtest`" class="btn download-backtest" v-else>
            {{ $t('6') }}
          </a>
        </div>
        <iframe id="back_test_contents" width="1000px" height="600px" frameborder="0" scroll="no"
                :src="`/backtest/render/${detail.displayProductId || id}/user/${item.id}/1`"
        ></iframe>
      </div>
    </template>
    <GogoModal :show="isShowModal" :cancel-text="$t('5')" @close="onClose" @ok="onGoToRegister" :ok-text="'OK'" :width="'400px'" :height="'auto'">
      <div slot="modal-body" class="p-30">
        {{ $t('4') }}
      </div>
    </GogoModal>
  </div>
</template>
<script>
import i18n from '@@/lang/mobile/systemtrade-id-backtest.json'
import title from '@@/../common/pages'
import { filterInt } from '@/utils/client/common'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'

const obj = Object.assign(
  {
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    components: {
      GogoModal,
      LazyComp01,
    },
    scrollToTop: true,
    i18n: {
      messages: i18n,
    },
    computed: {
      userId() {
        return this.$store.state.user.id
      },
    },
    data() {
      return {
        isShowModal: false,
      }
    },
    async asyncData({ app, params, error }) {
      const id = params.id
      const locale = app.i18n.locale
      const detail = await app.GoGoHTTP.get(`/api/v3/surface/systemtrade/fx/${id}/backtest`)
      if (!detail || !Object.keys(detail).length) {
        return error({ statusCode: 404 })
      }
      if (detail.code) {
        return error({ statusCode: 404, exists: detail.exists })
      }
      const titleChunk = i18n[locale]['7'].replace('{name}', detail.name)
      return {
        id,
        detail,
        displayData: (detail.data || []).filter(e => e.id != 110001),
        GGJBacktest: (detail.data || []).filter(e => e.id == 110001)[0] || undefined,
        titleChunk,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/systemtrade/fx/${id}/backtest`,
          },
        ],
      }
    },
    methods: {
      descriptionTemplate() {
        return this.detail.description || this.detail.name
      },
      onShowModal() {
        this.isShowModal = true
      },
      onGoToRegister() {
        location.href = `/register?u=/systemtrade/fx/${this.id}`
      },
      onClose() {
        this.isShowModal = false
      },
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
.back-test {
  margin-top: 0;
  width: 100%;
  padding: 4vw;
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  .download-backtest {
    display: block;
    background: #2eaf56;
    padding: 10px;
    color: white;
    border-radius: 0;
    height: 42px;
  }
  iframe {
    max-width: 100%;
    height: 70vh;
  }
}
</style>