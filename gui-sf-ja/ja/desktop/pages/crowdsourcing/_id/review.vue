<template>
  <div class="flex space-between w-1000">
    <div class="left-content">
      <div class="flex mid review-title-1 mb-30">
        <Pencil02 />
        <div class="txt"> {{ $t('14') }} </div>
      </div>
      <span class="load-more">{{ $t('16') }}</span>
      <div class="mt-20 date">{{ $t(24, { date: formatTime(review.completedAt, 7) }) }}</div>
      <div class="review-title-2">{{ review.title }}</div>
      <div class="review-rate pl-15 mt-20">
        <div class="flex mid">
          <p>{{ $t('7') }}</p>
          <div class="rate-star ml-10 flex">
            <rate class="fs-28" :options="{ readOnly: false }" :alway-show="true" v-model="review.rvQuality" />
          </div>
        </div>
        <div class="flex mid">
          <p>{{ $t('8') }}</p>
          <div class="rate-star ml-10 flex">
            <rate class="fs-28" :options="{ readOnly: false }" :alway-show="true" v-model="review.rvSpeed" />
          </div>
        </div>
        <div class="flex mid">
          <p>{{ $t('9') }}</p>
          <div class="rate-star ml-10 flex">
            <rate class="fs-28" :options="{ readOnly: false }" :alway-show="true" v-model="review.rvCommunication" />
          </div>
        </div>
      </div>
      <div class="pt-20">
        <textarea class="w-full p-10" v-model="review.content" :placeholder="$t(25)"></textarea>
      </div>
      <div class="submit-btn" @click="onPostReview">
        <div class="flex mid center">
          <span>{{ $t(22) }}</span>
          <Loading v-if="posting" class="ml-10 sm" style="width: 20px; height: 20px;" />
        </div>
      </div>
      <p v-show="postDone" class="text-center co-red mb-40">{{ $t('18') }}</p>
    </div>
    <div class="right-content pl-10 pr-10">
      <div class="right-title">{{ $t(23) }}</div>
      <div class="info-user-1">
        <a :href="'/users/' + (developer || {}).id" class="dev-ava">
          <img :src="'/img/users/' + (developer || {}).id + '/small'" alt="" />
        </a>
        <a :href="'/users/' + (developer || {}).id" class="user-name">{{ (developer || {}).name }}</a>
      </div>
      <div class="info-user-2">
        <div>{{ $t(3) }}</div>
        <div class="dev-count">{{ (developer || {}).total }}{{ $t('4') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/crowdsourcing-devs.json'
import title from '@@/../common/pages'
import { filterInt } from '@/utils/client/common'
import Rate from '@@/../components/product/Rate.vue'
import Loading from '@@/../components/icons/Loading.vue'
import Pencil02 from '@@/../components/icons/Pencil02.vue'

const obj = Object.assign(
  {
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    components: {
      Rate,
      Loading,
      Pencil02,
    },
    data() {
      return {
        postDone: false,
        posting: false,
      }
    },
    i18n: {
      messages: i18n,
    },
    async asyncData({ app, params, store, error }) {
      let locale = app.i18n.locale,
        titleSuf = i18n[locale]['20'],
        data = await app.GoGoHTTP.get(
          `/api/v3/surface/crowdsourcing/${params.id}/review`
        ),
        developer,
        titleChunk
      if (!data || !Object.keys(data).length) {
        return error({ statusCode: 404 })
      }
      developer = data.developer || {}
      titleChunk = `${(data.review || {}).title} - ${titleSuf}`
      store.commit('pushBC', {
        name: titleChunk,
        target: { name: 'crowdsourcing-id-review', params: params },
      })
      return {
        id: params.id,
        developer,
        review: data.review || {},
        titleChunk,
        linkMeta: [
          {
            rel: 'canonical',
            href: `${process.env.GOGO_URL}/crowdsourcing/${params.id}/review`,
          },
        ],
      }
    },
    methods: {
      onPostReview() {
        if (this.posting) {
          return
        }
        this.posting = true
        this.GoGoHTTP.put(
          `/api/v3/surface/crowdsourcing/${this.id}`,
          this.review
        )
          .then(data => {
            if (!data) {
              this.postDone = true
              this.posting = false
            }
          })
          .finally(() => {
            location.href = `/crowdsourcing/${this.id}`
          })
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.left-content {
  width: 76%;
  min-height: 300px;
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 5px 1px #ececec;
  .icon-cls {
    margin-right: 5px;
  }
  .review-title-1 {
    font-size: 28px;
    padding-top: 10px;
    padding-bottom: 10px;
    border-top: 1px solid #9c3;
    border-bottom: 1px solid #9c3;
  }
  .review-title-2 {
    font-size: 20px;
    margin-top: 5px;
    border-bottom: 1px solid #d9d9d9;
  }
  .date {
    color: #a0a0a0;
  }
  .load-more {
    border-radius: 18px;
    padding: 3px 10px;
    background: #9c3;
    color: white;
  }
  .review-rate {
    color: #2d2d2d;
    font-size: 14px;
    p {
      margin: 3px 0 0;
      font-size: 14px;
    }
  }
  .gg-rating {
    font-size: 28px;
    /deep/ a {
      display: none;
    }
  }
  textarea {
    height: 180px;
    resize: none;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    margin-bottom: 10px;
  }
  .submit-btn {
    height: 50px;
    width: 290px;
    background: #9c3;
    border: none;
    border-radius: 5px;
    color: #fff;
    margin: 10px auto 0 auto;
    line-height: 50px;
    font-size: 16px;
  }
}
.right-content {
  width: 22%;
  min-height: 300px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 5px 1px #ececec;
  .right-title {
    height: 40px;
    background: #9c3;
    line-height: 40px;
    padding: 0 10px;
    color: #fff;
    margin: 0 -10px;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    font-size: 18px;
  }
  .info-user-1 {
    padding: 10px 0;
    border-bottom: 1px solid #d9d9d9;
    .user-name {
      color: #585993;
      font-size: 14px;
    }
  }
  .info-user-2 {
    padding: 10px 0;
    border-bottom: 1px solid #d9d9d9;
    font-size: 14px;
    .dev-count {
      font-size: 22px;
      color: #2d2d2d;
    }
  }
  .dev-ava {
    display: block;
    width: 60px;
    height: 60px;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>
<style lang='scss'>
body {
  background-color: #f2f0ed !important;
}
#menu {
  background: #fff;
}
#header-01 {
  background: #fff;
}
</style>