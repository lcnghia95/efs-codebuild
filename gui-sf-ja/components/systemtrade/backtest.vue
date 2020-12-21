<template>
  <div class="w-full pb-50 backtest-detail">
    <div class="tool-detail-menu w-full" v-if="!langSupported().includes($i18n.locale)">
      <div class="w-1000 flex mid h-full">
        <a class="detail-menu no-underlying flex mid" @click="scrollTop">{{ $t('8') }}</a>
        <a class="detail-menu no-underlying flex mid" @click="gotoSection('st-strategy')">{{ $t('10') }}</a>
        <a class="detail-menu no-underlying flex mid" @click="gotoSection('lz-forward')">{{ $t('11') }}</a>
        <a class="detail-menu no-underlying flex mid" @click="gotoSection('st-product-comment')">{{ $t('12') }}</a>
        <a class="detail-menu no-underlying flex mid" :href="`/review/detail/${id}`">{{ $t('9') }}</a>
        <a class="detail-menu no-underlying flex mid" @click="gotoSection('st-trending-product')">{{ $t('14') }}</a>
        <!-- <a class="detail-menu no-underlying flex mid" @click="gotoSection('st-related-article')">{{ $t('13') }}</a> -->
      </div>
    </div>
    <ul>
      <li v-for="item in tabs" :key="'backtest-tab-' + item.id"
          :class="{'ranking-tab-active' : tab == item.id}"
          @click="clickTab(item.id)"
          class="ranking pos-rel">
        {{ item.text }}
        <span class="pos-abs new-icon" v-if="item.id == 3">NEW</span>
      </li>
    </ul>
    <template v-if="tab == 1">
      <div class="head-content mb-10">
        <h4 class="mb-10 mt-10">◆&nbsp;{{tabs[tab].text}}</h4>
        <div class="mb-10">{{tabs[tab].sub}}</div>
        <a @click="onShowModal" class="btn download-backtest" v-if="!userId">
          {{ $t('6') }}
        </a>
        <a :href="'/file/products/' + (detail.displayProductId || id) + '/backtest'" class="btn download-backtest" v-else>
          {{ $t('6') }}
        </a>
      </div>
      <iframe id="back_test_contents" width="1000px" height="600px" frameborder="0" scroll="no"
              :src="'/backtest/render/' + (detail.displayProductId || id) + '/1'"
      ></iframe>
    </template>
    <template v-if="tab == 2">
      <div class="head-content mb-10">
        <h4 class="mb-10 mt-10">◆&nbsp;{{tabs[tab].text}}</h4>
        <div class="mb-10">{{tabs[tab].sub}}</div>
      </div>
      <div v-for="ggjbk in detail.dataGGJ" :key="`GGJBacktest-${ggjbk.userId}-${ggjbk.fileNumber}`" class="mb-80">
        <a @click="onShowModal" class="btn download-backtest" v-if="!userId">
          {{ $t('6') }}
        </a>
        <a :href="`/file/products/${detail.displayProductId || id}/user/${ggjbk.userId}/backtest/${ggjbk.fileNumber}`" class="btn download-backtest" v-else>
          {{ $t('6') }}
        </a>
        <iframe id="back_test_contents" width="1000px" height="600px" frameborder="0" scroll="no"
            :src="`/backtest/render/${detail.displayProductId || id}/user/${ggjbk.userId}/${ggjbk.fileNumber}/1`"
        ></iframe>
      </div>
      <div v-if="!detail.dataGGJ.length" class="w-full text-center" style="color: #828282; font-size: 16px; margin: 40px 0 80px 0;">
        {{$t('36')}}
      </div>
    </template>
    <template v-if="tab == 3">
      <div class="head-content mb-10">
        <h4 class="mb-10 mt-10">◆&nbsp;{{tabs[tab].text}}</h4>
        <div class="mb-10">{{tabs[tab].sub}}</div>
        <div class="flex mid center">
          <div class="flex mid center upload-button-area">
            <a @click="onShowModal" class="btn upload-backtest" v-if="!userId">
              {{ $t('20') }}
            </a>
            <a @click="onShowUploadModal" class="btn upload-backtest" v-else>
              {{ $t('20') }}
            </a>
          </div>
        </div>
      </div>
      <div class="user-backtest">
        <div class="flex mid space-between" v-if="(detail.currentPage || 0) < (detail.lastPage || 0)">
          <Checkbox :label="$t('18')" :attrs="{value: 1}" v-model="filterCheck" @input="onFilter" class="mt-10 my-check" />
          <SelectBox :data-source="sortList" name="sortType" :display="'text'" :id-val="'id'" v-model="sortType" @input="onFilter" class="sort-select" />
        </div>
        <div class="flex flex-wrap mt-20">
          <div class="item-backtest" v-for="item in detail.data">
            <img src="/img/assets/pc/systemtrade/backtest_default2x.png" class="backtest-img"  />
            <div class="flex mid">
              <a class="flex mid mt-10" :href="'/users/' + item.userId" :title="item.nickName || $t('24')">
                <img :src="'/img/users/' + item.userId" class="user-img shadow" />
              </a>
              <div class="ml-10 memo" v-wrap-lines="2">{{item.memo || '-'}}</div>
            </div>
            <div class="mt-10" style="color: #a5a5a5;">
              {{formatTime(item.updatedAt, 9)}}
            </div>
            <div class="flex mid space-between mt-10">
              <a @click="onShowModal" class="btn upload-backtest" v-if="!userId">
                {{ $t('6') }}
              </a>
              <a :href="`/file/products/${id}/user/${item.userId}/backtest/${item.fileNumber}`" download v-else>
                <button class="btn download-backtest">{{ $t('6') }}</button>
              </a>
              <template v-if="item.userId == userId">
                <Loading class="ml-10 sm" style="width: 24px; height: 24px;" v-if="onDelList.includes(item.fileNumber)" />
                <TrashAlt class="del-icon"  @click.native="onClickDelBacktest(item.fileNumber)" v-else />
              </template>
            </div>
          </div>
          <div v-if="!detail.data.length" class="w-full text-center" style="color: #828282; font-size: 16px; margin: 40px 0 80px 0;">
            {{$t('32')}}
          </div>
        </div>
        <div class="text-center mt-25">
          <paging :cur-page="detail.currentPage"
                  :total="detail.lastPage"
                  :from="detail.pagingFrom"
                  :to="detail.pagingTo"
                  theme-class="theme4"
                  @pagingclick="onClickPage" />
        </div>
      </div>
    </template>
    <template v-if="(tab == 1 || tab == 2) && (detail.ranking || []).length">
      <div class="head-content mt-40">
        <h4 style="color: #21abaf;">{{$t('34')}}</h4>
      </div>
      <div class="flex space-between user-backtest">
        <div class="item-backtest" v-for="item in detail.ranking">
          <img src="/img/assets/pc/systemtrade/backtest_default2x.png" class="backtest-img"  />
          <div class="flex">
            <a class="flex mid mt-10" :href="'/users/' + item.userId" :title="item.nickName || $t('24')">
              <img :src="'/img/users/' + item.userId" class="user-img shadow" />
            </a>
            <div class="ml-10 memo" v-wrap-lines="2">{{item.memo || '-'}}</div>
          </div>
          <div class="mt-10" style="color: #a5a5a5;">
            {{formatTime(item.updatedAt, 9)}}
          </div>
          <div class="flex mid space-between mt-10">
            <a @click="onShowModal" class="btn upload-backtest" v-if="!userId">
              {{ $t('6') }}
            </a>
            <a :href="`/file/products/${id}/user/${item.userId}/backtest/${item.fileNumber}`" download v-else>
              <button class="btn download-backtest">{{ $t('6') }}</button>
            </a>
            <template v-if="item.userId == userId">
              <Loading class="ml-10 sm" style="width: 24px; height: 24px;" v-if="onDelList.includes(item.fileNumber)" />
              <!-- <TrashAlt class="del-icon"  @click.native="onClickDelBacktest(item.fileNumber)" v-else /> -->
            </template>
          </div>
        </div>
      </div>
      <div class="flex content-end">
        <a @click="clickTab(3)" style="color: #5e5e5e; font-size: 16px; cursor: pointer;">{{$t('35')}}</a>
      </div>
    </template>
    <GogoModal :show="isShowModal" :cancel-text="$t('5')" @close="onClose" @ok="onGoToRegister" :ok-text="'OK'" :width="'400px'" :height="'auto'">
      <div slot="modal-body" class="p-30">
        {{ $t('4') }}
      </div>
    </GogoModal>
    <GogoModal :show="isShowUploadModal" class="upload-modal" :width="'860px'" :height="'520px'">
      <div slot="modal-header">
      </div>
      <div slot="modal-body" class="upload-modal-content p-30">
        <div class="text-right">
          <button type="button" class="btn-close" @click="onCloseUpload"><b>&times;</b></button>
        </div>
        <div class="upload-area">
          <div><b>{{$t('25')}}</b></div>
          <div class="mt-10"><b style="color: #828282;font-weight: 700;font-size: 13px;">{{$t('40')}}</b></div>
          <div class="upload-dragable flex layout-col mid" @dragover.prevent @drop.prevent="backTestFileDropped">
            <div v-if="onUploadFile" class="w-full h-full">
              <Loading style="height: 180px;"/>
            </div>
            <template v-else>
              <FileUpload class="icon-file"/>
              <div class="upload-hint">{{ $t('26') }}</div>
              <label class="btn btn-default flex mid p-0">
                <input ref="file" type="file" class="upload-btn h-full w-full" accept=".zip" @change="backTestFileChanged" />
                <div class="co-21 img-name wrap-text" :title="uploadFileName"><b>{{ $t('27') }}</b></div>
              </label>
              <div class="upload-hint" style="margin-top: 30px;" v-if="!uploadError">{{ uploadFileName || $t('28') }}</div>
              <div class="upload-hint" style="margin-top: 30px; color: red;" v-else>{{ $t('31') }}</div>
              <div class="dragging w-full h-full" v-show="isShow"/>
            </template>
          </div>
          <div class="mt-10"><b>{{$t('29')}}</b></div>
          <textarea class="text-area w-full p-5 resize-none" rows="2" v-model="uploadComment" :placeholder="$t('30')" maxlength="2000" />
          <div class="text-center mt-20">
            <button class="btn upload-backtest" @click="onUpload">
              {{ $t('20') }}
            </button>
           </div>
        </div>
      </div>
      <div slot="modal-footer"></div>
    </GogoModal>
    <GogoModal :show="isShowGGJUploadModal" class="upload-modal" :width="'860px'" :height="'520px'">
      <div slot="modal-header">
      </div>
      <div slot="modal-body" class="upload-modal-content p-30">
        <div class="text-right">
          <button type="button" class="btn-close" @click="onCloseUpload"><b>&times;</b></button>
        </div>
        <div class="upload-area upload-ggj">
          <div><b>{{$t('25')}}</b></div>
          <div class="upload-dragable flex layout-col mid" @dragover.prevent @drop.prevent="backTestFileDropped">
            <div v-if="onUploadFile" class="w-full h-full">
              <Loading style="height: 86px;"/>
            </div>
            <template v-else>
              <div class="upload-hint">{{ $t('38') }}</div>
              <label class="btn btn-default flex mid p-0">
                <input ref="file" type="file" class="upload-btn h-full w-full" :accept="'.html, .htm'" @change="backTestFileChanged" />
                <div class="co-21 img-name wrap-text flex mid " :title="uploadFileName">
                  <FileUpload class="icon-file-ggj"/>
                  <b>{{ uploadFileName || $t('27') }}</b>
                </div>
              </label>
              <div class="dragging w-full h-full" v-show="isShow"/>
            </template>
          </div>
          <div class="upload-dragable flex layout-col mid mt-20" @dragover.prevent @drop.prevent="backTestFileImgDropped">
            <div v-if="onUploadFile" class="w-full h-full">
              <Loading style="height: 86px;"/>
            </div>
            <template v-else>
              <div class="upload-hint">{{ $t('39') }}</div>
              <label class="btn btn-default flex mid p-0">
                <input ref="file" type="file" class="upload-btn h-full w-full" :accept="GGJ_IMG_EXTS" @change="backTestFileImgChanged" />
                <div class="co-21 img-name wrap-text flex mid " :title="uploadImgFileName">
                  <FileUpload class="icon-file-ggj"/>
                  <b>{{ uploadImgFileName || $t('27') }}</b>
                </div>
              </label>
              <div class="dragging w-full h-full" v-show="isShow"/>
            </template>
          </div>
          <div class="upload-hint" style="margin-top: 30px; color: red;" v-if="uploadError">{{ $t('31') }}</div>
          <div class="mt-10"><b>{{$t('29')}}</b></div>
          <textarea class="text-area w-full p-5 resize-none" rows="2" v-model="uploadComment" :placeholder="$t('30')" maxlength="2000" />
          <div class="text-center mt-20">
            <button class="btn upload-backtest" @click="onUpload">
              {{ $t('20') }}
            </button>
           </div>
        </div>
      </div>
      <div slot="modal-footer"></div>
    </GogoModal>
    <GogoModal :show="isShowDelModal" :cancel-text="$t('5')" @close="onCloseDel" @ok="onDelBacktest" :ok-text="'OK'" :width="'400px'" :height="'auto'">
      <div slot="modal-body" class="p-30">
        {{ $t('37') }}
      </div>
    </GogoModal>
  </div>
</template>
<script>
import i18n from '@@/lang/desktop/systemtrade-id-backtest.json'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import ChevronRight from '@@/../components/icons/ChevronRight.vue'
import Loading from '@@/../components/icons/Loading.vue'
import FileUpload from '@@/../components/icons/FileUpload.vue'
import Checkbox from '@@/../components/form/Checkbox.vue'
import SelectBox from '@@/../components/form/SelectBox.vue'
import TrashAlt from '@@/../components/icons/TrashAlt.vue'
import Paging from '@@/../components/paging/Paging.vue'
import { setCookie, gotoLogin, checkExtension, checkImgSize, } from '@/utils/client/common'

const ACCEPT_TAB_VALUES = [1,2,3]
const GGJ_USER_ID = 110001
const EXTS = ['.zip']
const GGJ_EXTS = ['.html', '.htm']
const GGJ_IMG_EXTS = ['.gif', '.png', '.jpg', '.jpeg']

export default {
    components: {
      GogoModal,
      LazyComp01,
      ChevronRight,
      Loading,
      FileUpload,
      Checkbox,
      SelectBox,
      TrashAlt,
      Paging,
    },
    props: {
      id: [Number,String],
      detail: {
        type: Object,
        default: () => {}
      },
      mineFilter: {
        type: [Number,String],
        default: 0
      },
      sort: {
        type: [Number,String],
        default: 1
      },
    },
    scrollToTop: true,
    i18n: {
      messages: i18n,
    },
    mounted() {
      if (process.browser) {
        const menu = $('.menu2').length ? $('.menu2') : $('.head-wrapp')
        this.menu2Pos = menu.position().top + menu.height()
        window.addEventListener('scroll', this.onScroll)
      }
      $('.upload-modal').on({
        dragenter: this.handleDragEnter,
        dragleave: this.handleDragLeave,
      })
    },
    activated() {
      $('.upload-modal').on({
        dragenter: this.handleDragEnter,
        dragleave: this.handleDragLeave,
      })
    },
    destroyed() {
      let body = $('.upload-modal')
      body.off('dragenter', this.handleDragEnter)
      body.off('dragleave', this.handleDragLeave)
    },
    deactivated() {
      let body = $('.upload-modal')
      // incase component uses keep-alive
      body.off('dragenter', this.handleDragEnter)
      body.off('dragleave', this.handleDragLeave)
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.onScroll)
    },
    computed: {
      userId() {
        return this.$store.state.user.id
      },
    },
    data() {
      return {
        isShowModal: false,
        menu2Pos: 0,
        reviews: [],
        relatedArticles: [],
        backtestList: this.detail.data || [],
        // GGJBacktest: (this.detail.data || []).filter(e => e.id == 110001)[0] || undefined,
        tabs: {
          1: {
            text: this.$t('1', {name: this.$t('15')}),
            id: 1,
            sub: this.$t('21', {name: this.detail.name})
          },
          2: {
            text: this.$t('1', {name: 'GGJ'}),
            id: 2,
            sub: this.$t('22', {name: this.detail.name})
          },
          3: {
            text: this.$t('16'),
            id: 3,
            sub: this.$t('17', {name: this.detail.name})
          },
        },
        tab: ACCEPT_TAB_VALUES.includes(parseInt(this.$route.query.t)) ? this.$route.query.t : 1,
        isShowUploadModal: false,
        isShowGGJUploadModal: false,
        uploadFileName: null,
        uploadFile: null,
        uploadImgFileName: null,
        uploadImgFile: null,
        uploadComment: '',
        onUploadFile: false,
        isShow: false,
        sortList: [
          {
            id: 1,
            text: this.$t('19') + ': ' + this.$t('23'),
          },
          {
            id: 2,
            text: this.$t('19') + ': ' + this.$t('33'),
          }
        ],
        sortType: this.sort,
        backtestFileToDel: null,
        isShowDelModal: false,
        onDelList: [],
        filterCheck: this.mineFilter,
        uploadError: false,
        GGJ_IMG_EXTS,
        acceptExts: EXTS,
      }
    },
    methods: {
      onShowModal() {
        this.isShowModal = true
      },
      onShowUploadModal() {
        if (this.userId == GGJ_USER_ID) {
          this.isShowGGJUploadModal = true
          this.acceptExts = GGJ_EXTS
        } else {
          this.isShowUploadModal = true
          this.acceptExts = EXTS
        }
      },
      onGoToRegister() {
        location.href = `/register?u=/systemtrade/fx/${this.id}`
      },
      onClose() {
        this.isShowModal = false
      },
      onCloseUpload() {
        this.isShowUploadModal = false
        this.isShowGGJUploadModal = false
      },
      scrollTop() {
        $('html, body').animate({ scrollTop: 0 })
      },
      onScroll() {
        if (window.scrollY > this.menu2Pos) {
          $('.tool-detail-menu').slideDown(300)
        } else {
          $('.tool-detail-menu').slideUp(300)
        }
      },
      gotoSection(text) {
        setCookie('sf-sys-gosec', text, 1 / 2, '/systemtrade')
        location.href = `/systemtrade/fx/${this.id}`
      },
      clickTab(_tab) {
        this.tab = _tab

        if (history.replaceState) {
          var params = new URLSearchParams(location.search);
          if (ACCEPT_TAB_VALUES.includes(_tab)) {
            params.set('t', _tab)
          }
          var newUrl = location.protocol + "//" + location.host + location.pathname + '?' + params.toString();
          history.replaceState({path: newUrl}, '', newUrl);
        }
      },
      onUpload() {
        if (this.onUploadFile) {
          return
        }
        this.onUploadFile = true
        this.uploadError = false
        const requests = []
        if (this.uploadFile) {
          const fileUploadUrl = `/upload/v3/products/${this.id}/backtest/user`
          const formData = new FormData()
          formData.append('file', this.uploadFile)
          formData.append('comment', this.uploadComment)
          requests.push(this.GoGoHTTP.post(fileUploadUrl, formData))
        }
        if (this.uploadImgFile) {
          const imgUploadUrl = `/upload/v2/img/products/${this.id}/backtest/user/${this.userId}`
          const formData = new FormData()
          formData.append('file', this.uploadImgFile)
          requests.push(this.GoGoHTTP.post(imgUploadUrl, formData))
        }
        Promise.all(requests).then(data => {
          location.reload()
        })
        .catch(() => {
          this.uploadError = true
        })
        .finally(() => {
          this.onUploadImgFile = false
          this.uploadImgFile = null
          this.onUploadFile = false
          this.uploadFile = null
        })
      },
      backTestFileDropped(evt) {
        this.dragging = 0
        this.isShow = false
        this.backTestFileChanged(evt.dataTransfer.files)
      },
      backTestFileChanged(files) {
        files instanceof Event && (files = files.target.files)

        if (files.length) {
          if (checkExtension(files[0], this.acceptExts) && checkImgSize(files[0], 1024)) {
            this.uploadFile = files[0]
            this.uploadFileName = files[0].name
            this.uploadError = false
          }
        }
      },
      backTestFileImgDropped(evt) {
        this.dragging = 0
        this.isShow = false
        this.backTestFileChanged(evt.dataTransfer.files)
      },
      backTestFileImgChanged(files) {
        files instanceof Event && (files = files.target.files)

        if (files.length) {
          if (checkExtension(files[0], GGJ_IMG_EXTS) && checkImgSize(files[0], 1024)) {
            this.uploadImgFile = files[0]
            this.uploadImgFileName = files[0].name
          }
        }
      },
      handleDragEnter(evt) {
        evt.preventDefault()
        this.dragging++
        this.isShow = true
      },
      handleDragLeave(evt) {
        evt.preventDefault()
        this.dragging--
        !this.dragging && (this.isShow = false)
      },
      onClickDelBacktest(item) {
        this.backtestFileToDel = item
        this.isShowDelModal = true
      },
      onCloseDel() {
        this.isShowDelModal = false
      },
      onDelBacktest() {
        this.isShowDelModal = false
        if (!this.backtestFileToDel) {
          return
        }
        this.onDelList.push(this.backtestFileToDel)
        const fileDelUrl = `/upload/v3/products/${this.id}/backtest/user/${this.backtestFileToDel}`
        this.GoGoHTTP.delete(fileDelUrl).then(data => {
          if (parseInt(data.num) == this.backtestFileToDel) {
            this.detail.data = this.detail.data.filter(e => e.userId != this.userId || e.fileNumber != this.backtestFileToDel)
            this.backtestList = this.detail.data
          }
        })
        .finally(() => {
          this.onDelList = this.onDelList.filter(e => e != this.backtestFileToDel)
          this.backtestFileToDel = null
        })
      },
      onClickPage(page) {
        location.href = `/systemtrade/fx/${this.id}/backtest/p/${page}?t=3`
      },
      // onSelectSort() {
      //   location.href = `/systemtrade/fx/${this.id}/backtest/p/1?t=3&mine=${this.filterCheck ? 1 : 0}&sort=${this.sortType}`
      // },
      onFilter() {
        location.href = `/systemtrade/fx/${this.id}/backtest/p/1?t=3&mine=${this.filterCheck ? 1 : 0}&sort=${this.sortType}`
      },
    },
  }
</script>

<style lang="scss" scoped>
.backtest-detail {
  ul {
    width: 100%;
    padding: 15px 0;
    margin: 0;
    display: flex;
    justify-content: space-between;
    border-top: 3px solid #e6e6e6;
    border-bottom: 3px solid #e6e6e6;
    li {
      list-style-type: none;
      display: inline-block;
      color: #808080;
      cursor: pointer;
      font-size: 20px;
      font-weight: bold;
    }
    .ranking {
      width: 33%;
    }
    .ranking-tab-active {
      border-bottom: none;
      color: #21abaf;
    }
  }
  .new-icon {
    top: 2px;
    right: 50px;
    background: #e24747;
    color: white;
    font-size: 13px;
    padding: 1px 5px;
    border-radius: 6px;
    &::before {
      content: '◀';
      position: absolute;
      top: 4px;
      left: -8px;
      font-size: 11px;
      font-weight: normal;
      color: #e24747;
    }
  }
  .head-content {
    color: #5e5e5e;
    padding: 10px 0;
    h4 {
      font-weight: bold;
    }
    .upload-button-area {
      width: 600px; 
      height: 90px; 
      background: #f8f8f8; 
      border: 1px solid #bebebe;
    }
  }
  .mt-80 {
    margin-top: 80px;
  }
  .mb-80 {
    margin-bottom: 80px;
  }
  .tool-detail-menu {
    display: none;
    position: fixed;
    height: 60px;
    top: 0;
    left: 0;
    background: white;
    box-shadow: 0 3px 4px #ededed;
    z-index: 9;
  }
  .detail-menu {
    cursor: pointer;
    padding-left: 20px;
    padding-right: 20px;
    height: 100%;
    &:hover {
      color: #f60;
      border-bottom: 2px solid #f60;
    }
  }
  .text-area {
    border: 1px solid #d9d9d9;
    height: 100px;
    outline: none;
    resize: vertical;
    &::placeholder {
      color: #aab2bd;
    }
  }
  .resize-none {
    resize: none;
    height: 50px;
  }
  .upload-backtest {
    background: #21abaf;
    width: 150px;
    color: white;
    border-radius: 0;
  }
  .upload-modal {
    /deep/ .modal-dialog {
      top: 20%;
    }
  }
  .download-backtest {
    width: 150px;
    background: #2eaf56;
    color: white;
    border-radius: 0;
  }
  .upload-modal-content {
    height: 400px;
    .btn-close {
      font-size: 22px;
      background: #fff;
      border: none;
    }
    .upload-area {
      padding: 30px 80px;
      .upload-dragable {
        padding: 20px 40px;
        border: 2px dotted #707070;
        border-radius: 8px;
        background: #eee;
        position: relative;
        .upload-btn {
          position: absolute;
          left: -99999px;
          filter: alpha(opacity=0);
        }
        .upload-hint {
          font-size: 13px; 
          color: #828282; 
          margin: 15px 0;
        }
        .img-name {
          display: block;
          border: 1px solid #707070;
          color: #707070;
          background: #fff;
          padding: 5px 15px;
        }
        .dragging {
          position: absolute;
          top: 0;
          left: 0;
          background-color: rgba(153, 153, 153, 0.8);
        }
        .icon-file {
          width: 34px;
          height: 34px;
        }
        .icon-file-ggj {
          width: 26px;
          height: 18px; 
        }
      }
      &.upload-ggj {
        padding: 20px 80px;
        .upload-dragable {
          padding: 10px 30px;
        }
      }
    }
  }
  .user-backtest {
    padding: 0 20px;
    .my-check {
      /deep/ .checkmark {
        top: 2px;
        left: 2px;
      }
    }
    .sort-select {
      height: 25px;
      /deep/ .sl-area {
        padding: 1px 20px;
        height: auto;
        border-radius: 4px;
        border: 1px solid #828282;
        font-size: 12px;
      }
      /deep/ .dd-item {
        margin: 0 5px;
        padding: 2px 2px;
        border-radius: 4px;
        font-size: 12px;
      }
    }
    .item-backtest {
      width: 200px;
      margin-right: 53px;
      margin-bottom: 50px;
      &:nth-child(4n) {
        margin-right: 0;
      }
      .backtest-img {
        width: 200px;
        height: 140px;
      }
      .user-img {
        width: 30px;
        height: 30px;
      }
      .del-icon {
        width: 24px;
        height: 24px;
        color: #e6445d;
      }
      .memo {
        width: 80%;  
        max-width: 80%; 
        max-height: 40px; 
        padding: 7px 0; 
        overflow: hidden;
      }
    }
    .showmore-backtest {
      border-top: 3px solid #828282;
      padding-top: 15px;
      a {
        font-size: 20px;
        font-weight: bold;
        color: #393738;
        cursor: pointer;
      }
    }
  }
}
</style>