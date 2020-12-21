<template>
  <div style="background: #f3f0ef;">
    <div class="page-title flex mid bg-white mb-10">
      <PaperPlane class="mr-5" />
      <div class="wrap-text">{{ crowdsourcing.title }}</div>
    </div>
    <!-- job info 1 -->
    <div class="flex space-between info flex-wrap bg-white pl-10 pr-10">
      <div class="info-cell flex mid">
        <div class="pr-10 info-label">{{ $t(2) }}</div>
        <div class="number">{{ formatNumber(crowdsourcing.reward, 0) }}{{ $t(17) }}</div>
      </div>
      <div class="info-cell flex mid">
        <div class="pr-10 info-label">{{ $t(3) }}</div>
        <div class="number">{{ dateLeft > 0 ? dateLeft : 0 }}{{ $t(29) }}</div>
      </div>
      <div class="info-cell flex mid">
        <div class="pr-10 info-label">{{ $t(4) }}</div>
        <div class="number">{{ (bidders.data || []).length }}{{ $t(27) }}</div>
      </div>
    </div>
    <!-- content -->
    <div class="content bg-white" v-html="crowdsourcing.content"></div>
    <!-- job info 2 -->
    <div class="flex space-between dev-info">
      <span>{{ $t(5) }}</span>
      <a class="text" :href="'/users/' + (crowdsourcing.user || {}).id" style="color: #0066c0;">{{ (crowdsourcing.user || {}).name }}</a>
    </div>
    <div class="flex space-between dev-info">
      <span>{{ $t(6) }}</span>
      <span class="text">{{ crowdsourcing.createdAt ? formatTime(crowdsourcing.createdAt, 8) : '-' }}</span>
    </div>
    <div class="flex space-between dev-info">
      <span>{{ $t(7) }}</span>
      <span class="text">{{ crowdsourcing.bidEndAt ? formatTime(crowdsourcing.bidEndAt, 8) : '-' }}</span>
    </div>
    <div class="flex space-between dev-info">
      <span>{{ $t(8) }}</span>
      <span class="text">{{ crowdsourcing.deadlineAt ? formatTime(crowdsourcing.deadlineAt, 8) : '-' }}</span>
    </div>
    <!-- CONDITIONS AND GUIS -->
    <!-- on init -->
    <div v-if="!userId" class="p-30" style="background: #f3f0ef;">
      <a :href="'/login?u=' + $route.fullPath" class="go-login">{{ $t(10) }}</a>
      <div class="mt-30" style="color: #707070;">{{ $t(9) }}</div>
    </div>
    <div v-else-if="!isCrowdsourcing" class="p-30" style="background: #f3f0ef;">
      <a href="/mypage/crowdsourcing" class="crow-register">{{ $t(11) }}</a>
      <div class="mt-30" style="color: #707070;">{{ $t(9) }}</div>
    </div>
    <!-- bid is closed, show notify for selected dev -->
    <template
      v-if="(!bidders.bidable || crowdsourcing.matched) && crowdsourcing.devId === userId"
      class="m-15 dev bg-white"
    >
      <div class="m-15 dev bg-white">
        <div class="dev-title">
          {{ $t(13) }}
        </div>
        <div class="dev-content" v-html="$t(14, { url: ` /mypage/crowdsourcing/receive/${crowdsourcing.id}` })"></div>
      </div>
      <div class="notify-crow-policy">{{ $t(9) }}</div>
    </template>
    <!-- bid in open-->
    <template v-else-if="bidders.bidable && !crowdsourcing.matched && userId != (crowdsourcing.user || {}).id">
      <!-- if dev is selected, notify -->
      <template v-if="crowdsourcing.devId === userId">
        <div class="m-15 dev bg-white">
          <div class="dev-title">
            {{ $t(13) }}
          </div>
          <div class="dev-content" v-html="$t(14, { url: `/` })"></div>
        </div>
        <div class="notify-crow-policy">{{ $t(9) }}</div>
      </template>
      <!-- else -->
      <template v-else>
        <!-- list bidder, show for dev -->
        <div class="text-center bidder-title">{{ $t(12) }}</div>
        <template v-if="(bidders.data || []).length">
          <div class="flex space-between dev-info bg-white" v-for="(item, index) in bidders.data" :key="'bid'+index">
            <a :href="`/users/${(item.user || {}).id}`" style="color: #b2b2b2;">{{ (item.user || {}).name }}</a>
            <span>{{ formatTime(item.updatedAt, 8) }}</span>
          </div>
        </template>
        <div v-else class="empty-text" style="margin: 0 0 10px 0;">{{ $t(30) }}</div>
        <!-- bid input -->
        <BidBox class="m-15" :bid-number="bidNumber" @onBid="onBid" />
      </template>
    </template>
    <!-- list bidder, only show for orderer -->
    <div class="p-10" v-if="userId === (crowdsourcing.user || {}).id">
      <div class="dev-bid-title mb-10 text-center">{{ $t(12) }}</div>
      <template v-if="(bidders.data || []).length">
        <DevBid 
          v-for="(item, index) in bidders.data"
          class="mb-5"
          :key="'bid-dev' + index"
          :item="item"
          :is-canceled="crowdsourcing.devId ? (item.user || {}).id != crowdsourcing.devId : null"
          :is-selected="crowdsourcing.devId ? (item.user || {}).id == crowdsourcing.devId : null"
        />
      </template>
      <div v-else class="empty-text">{{ $t(30) }}</div>
    </div>
    <!-- comunity -->
    <template v-if="userId && isCrowdsourcing">
      <div class="msg-header flex mid">
        <Comments />
        {{ $t(22) }}
      </div>
      <CrowdCommunity :messages-init="comments" v-if="!crowdsourcing.isFinish" />
      <div v-else class="finish-box">
        <div class="empty-text">{{ $t(31) }}</div>
        <a class="back-to-crowd-index" href="/crowdsourcing">{{ $t(32) }}</a>
      </div>
    </template>
    <!--  -->
  </div>
</template>
<script>
import i18n from '@@/lang/mobile/crowdsourcing-job-detail.json'
import { filterInt } from '@/utils/client/common'
import title from '@@/../common/pages'
import DevBid from '@/components/crowdsourcing/detail/DevBid.vue'
import BidBox from '@/components/crowdsourcing/detail/BidBox.vue'
import CrowdCommunity from '@/components/crowdsourcing/detail/CrowdCommunity.vue'
import Comments from '@@/../components/icons/Comments.vue'
import PaperPlane from '@@/../components/icons/PaperPlane.vue'

const obj = Object.assign(
  {
    components: {
      DevBid,
      Comments,
      BidBox,
      CrowdCommunity,
      PaperPlane,
    },
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    data() {
      return {
        crowdsourcing: {},
        comments: {},
        bidders: {},
        userId: parseInt(this.$store.state.user.id),
        GET_DATA_URL: '/api/v3/surface/crowdsourcing/',
        reply: {},
      }
    },
    i18n: {
      messages: i18n,
    },
    computed: {
      dateLeft() {
        let one_date = 1000*60*60*24, // one day
          now = (new Date(Date.now())),
          bEnd = (new Date(this.crowdsourcing.bidEndAt*1000)),
          different = bEnd - now
        return Math.round(different/one_date)
      },
    },
    async asyncData({ app, params, error, store }) {
      let locale = app.i18n.locale,
        titleSuf = i18n[locale][28],
        [crowdsourcing, comments, bidders, isCrowdsourcing] = await Promise.all([
          app.GoGoHTTP.get(`/api/v3/surface/crowdsourcing/${params.id}`),
          app.GoGoHTTP.get(`/api/v3/surface/crowdsourcing/comments`, {
            params: {
              cId: params.id,
            },
          }),
          app.GoGoHTTP.get(`/api/v3/surface/crowdsourcing/bidders`, {
            params: {
              cId: params.id,
            },
          }),
          app.GoGoHTTP.get('/api/v3/surface/crowdsourcing/user')
        ]),
        des,
        bidNumber = ((bidders.data || []).filter(item => (item.user || {}).id == store.state.user.id)[0] || {})['price'] || 0
      if (!crowdsourcing || !Object.keys(crowdsourcing).length) {
        return error({ statusCode: 404 })
      }
      des = (crowdsourcing.content || '').substr(0, 300)
      return {
        id: params.id,
        crowdsourcing,
        bidNumber,
        comments,
        bidders,
        isCrowdsourcing,
        titleChunk: `${crowdsourcing.title} - ${titleSuf}`,
        descriptionTemplate() {
          return des
        },
        linkMeta: [
          {
            rel: 'canonical',
            href: `${process.env.GOGO_URL}/crowdsourcing/${params.id}`,
          },
        ],
      }
    },
    methods: {
      onBid(price) {
        this.loading = true
        this.$nuxt.$emit('updateBidPrice', true)
        this.GoGoHTTP.post(this.GET_DATA_URL + 'bidders?isGetId=1', {
          cId: this.id,
          price,
        })
          .then(() => {
            this.onGetDataBidders()
          })
          .finally(() => {
            this.loading = false
            this.$nuxt.$emit('updateBidPrice', false)
          })
      },
      onGetDataBidders() {
        this.GoGoHTTP.get(this.GET_DATA_URL + 'bidders', {
          params: {
            cId: this.id,
          },
        }).then(data => {
          if (data) {
            this.bidders = data
            this.bidNumber = (data.data.filter(item => (item.user || {}).id == this.userId)[0] || {})['price'] || 0
          }
        })
      },
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
.finish-box {
  .empty-text {
    height: 30px;
    color: red;
    line-height: 30px;
    text-align: center;
  }
  .back-to-crowd-index {
    height: 40px;
    width: 50%;
    background: #9c3;
    margin: 10px auto;
    text-align: center;
    line-height: 41px;
    color: #fff;
    border-radius: 5px;
    display: block;
    text-decoration: none;
    &:focus {
      transform: translateY(5px);
    }
  }
}
.notify-crow-policy {
  color: #707070;
  padding: 0 15px 25px 15px;
  text-align: justify;
  font-size: 15px;
}
.empty-text {
  margin: 0 -10px 10px -10px;
  background: #fff;
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  font-size: 16px;
}
.page-title {
  min-height: 50px;
  background: #9c3;
  line-height: 50px;
  padding-left: 10px;
  color: #fff;
  font-size: 16px;
  .icon-cls {
    height: 26px;
  }
}
.bidder-title {
  line-height: 45px;
  font-weight: bold;
  color: rgb(112, 112, 112);
  background: #f3f0ef;
  font-size: 15px;
}
.content {
  white-space: pre-wrap;
  word-break: break-all;
  padding: 20px;
  color: #707070;
}
.info {
  box-shadow: 0 0 0 10px #f3f0ef;
  background: #f3f0ef;
  .info-cell {
    font-size: 12px;
    min-height: 30px;
    line-height: 39px;
    margin-bottom: 5px;
    &:nth-child(1) {
      border-right: 1px dotted #e3e0de;
    }
    &:nth-child(2) {
      flex: 0 0 90px;
      border-right: 1px dotted #e3e0de;
    }
    &:nth-child(3) {
      flex: 0 0 90px;
      border-right: none;
    }
    .info-label {
      color: #b2b2b2;
      min-width: 40px;
      white-space: nowrap;
    }
    .number {
      color: #25a600;
      font-size: 1.9em;
      line-height: 35px;
      white-space: nowrap;
      padding-right: 5px;
    }
  }
}
.dev-info {
  height: 40px;
  line-height: 40px;
  -webkit-box-shadow: 0 0 0 0.7px #e0dedc;
  box-shadow: 0 0 0 0.7px #e0dedc;
  font-size: 15px;
  padding: 0 10px;
  color: #b2b2b2;
  background: #fff;
  .text {
    color: #707070;
    font-size: 16px;
  }
}
.dev-bid-title {
  font-size: 15px;
  color: #707070;
  font-weight: 700;
}
.go-login {
  height: 40px;
  width: 80%;
  background: #ff7d00;
  line-height: 40px;
  text-align: center;
  color: #fff;
  margin: auto;
  border-radius: 6px;
  display: block;
}
.crow-register {
  height: 40px;
  width: 80%;
  background: #9c3;
  line-height: 40px;
  text-align: center;
  color: #fff;
  margin: auto;
  border-radius: 6px;
  display: block;
}
.dev {
  border: 1px solid #000;
  border-radius: 5px;
  .dev-title {
    background: #000;
    color: #fff;
    text-align: center;
    padding: 10px 5px;
    font-size: 16px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .dev-content {
    padding: 15px 10px;
  }
  .dev-input {
    padding: 10px 20px;
    .bid-input {
      height: 45px;
      line-height: 45px;
      padding: 0 10px;
      border-radius: 5px;
      border: 1px solid grey;
    }
    .bid-checkbox {
      margin: 4px 6px 0 0;
    }
    .unit {
      font-size: 27px;
      padding-top: 13px;
      color: #707070;
      font-weight: bold;
    }
    .submit-btn {
      height: 40px;
      text-align: center;
      background: #9c3;
      line-height: 40px;
      border-radius: 5px;
      color: #fff;
      font-size: 16px;
    }
    .more {
      margin: 0 -20px -10px -20px;
      background: #e0dedc;
      height: 50px;
      line-height: 50px;
      text-align: center;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      color: #707070;
    }
  }
}
.msg-header {
  height: 50px;
  background: #9c3;
  color: #fff;
  line-height: 50px;
  padding: 0 10px;
}
.comment-box {
  padding: 10px;
  textarea {
    width: 100%;
    margin-top: 5px;
    resize: none;
    height: 90px;
    border: 1px solid #e6e4e2;
    padding: 10px;
  }
  .submid-btn {
    width: 200px;
    height: 40px;
    background: #9c3;
    color: #fff;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    margin: 15px auto;
  }
}
</style>