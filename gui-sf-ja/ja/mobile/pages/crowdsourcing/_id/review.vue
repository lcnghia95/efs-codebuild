<template>
  <div>
    <!-- user info -->
    <div class="page-title flex mid">
      <Pencil02 class="mr-5" />
      <div>{{ $t(14) }}</div>
    </div>
    <div class="user-info flex p-10">
      <a :href="'/users/' + (developer || {}).id" class="dev-ava">
        <img :src="'/img/users/' + (developer || {}).id + '/small'" alt="" />
      </a>
      <div class="w-full ml-10">
        <div class="flex space-between info-row">
          <div class="info-label">{{ $t(26) }}</div>
          <span style="color: #707070;">{{ (developer || {}).name }}</span>
        </div>
        <div class="flex space-between info-row">
          <div class="info-label">{{ $t(3) }}</div>
          <b class="number">{{ (developer || {}).total }}{{ $t(4) }}</b>
        </div>
      </div>
    </div>
    <!-- review ctn -->
    <div class="review-ctn">
      <span class="load-more">{{ $t('16') }}</span>
      <div class="mt-20 date">{{ $t(24, { date: formatTime(review.completedAt, 7) }) }}</div>
      <div class="review-title">{{ review.title }}</div>
      <div class="review-rate">
        <div>
          <p>{{ $t(7) }}</p>
          <div class="rate-star ml-10 flex">
            <rate class="fs-28" :options="{ readOnly: false }" :alway-show="true" v-model="review.rvQuality" />
          </div>
        </div>
        <div>
          <p>{{ $t(8) }}</p>
          <div class="rate-star ml-10 flex">
            <rate class="fs-28" :options="{ readOnly: false }" :alway-show="true" v-model="review.rvSpeed" />
          </div>
        </div>
        <div>
          <p>{{ $t(9) }}</p>
          <div class="rate-star ml-10 flex">
            <rate class="fs-28" :options="{ readOnly: false }" :alway-show="true" v-model="review.rvCommunication" />
          </div>
        </div>
      </div>
      <div class="pt-10">
        <textarea class="w-full p-10" v-model="review.content" :placeholder="$t(25)"></textarea>
      </div>
      <div class="submit-btn flex mid center" @click="onPostReview">
        <span>{{ $t(22) }}</span>
        <Loading v-if="posting" class="ml-10 sm" style="width: 20px; height: 20px;" />
      </div>
      <p v-show="postDone" class="text-center co-red mb-40">{{ $t('18') }}</p>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/mobile/crowdsourcing-job-review.json'
import title from '@@/../common/pages'
import { filterInt } from '@/utils/client/common'
import Pencil02 from '@@/../components/icons/Pencil02.vue'
import Rate from '@@/../components/product/Rate.vue'
import Loading from '@@/../components/icons/Loading.vue'

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
    async asyncData({ app, params, error }) {
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
.page-title {
  background: #9c3;
  padding: 0 10px;
  color: #fff;
  height: 40px;
  font-size: 16px;
  .icon-cls {
    height: 20px;
    width: 20px;
  }
}
.user-info {
  background: #f3f0ef;
  box-shadow: 0 4px 7px 0 rgba(4, 0, 0, 0.15);
  margin-bottom: 10px;
  .dev-ava {
    display: block;
    height: 80px;
    width: 80px;
    flex: 0 0 80px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .info-row {
    height: 40px;
    border-bottom: 2px dotted #e3e0de;
    line-height: 40px;
    color: #707070;
    font-size: 18px;
  }
  .info-label {
    font-size: 15px;
    color: #b2b2b2;
  }
  .number {
    color: #25a600;
  }
}
.review-ctn {
  background: #fff;
  padding: 10px;
  .icon-cls {
    margin-right: 5px;
  }
  .review-title {
    margin-top: 5px;
    border-bottom: 1px solid #d9d9d9;
    color: #707070;
    font-size: 17px;
    padding-bottom: 5px;
  }
  .date {
    color: #b2b2b2;
    font-size: 15px;
  }
  .load-more {
    border-radius: 18px;
    padding: 3px 10px;
    background: #9c3;
    color: white;
  }
  .review-rate {
    margin-bottom: 5px;
    color: #707070;
    font-size: 16px;
    padding-top: 5px;
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
  }
  .submit-btn {
    height: 40px;
    width: 30%;
    min-width: 200px;
    background: #9c3;
    border: none;
    border-radius: 5px;
    color: #fff;
    margin: 10px auto 10px auto;
    line-height: 40px;
    font-size: 16px;
  }
}
</style>

