webpackJsonp([75],{"0XbJ":function(t,e,a){"use strict";var n=function(){var t=this.$createElement,e=this._self._c||t;return e("i",{staticClass:"icon-cls"},[e("svg",{attrs:{viewBox:"0 0 96 96",xmlns:"http://www.w3.org/2000/svg"}},[e("path",{attrs:{fill:"currentColor",d:"M48 48c9.7 0 17.5-7.8 17.5-17.5S57.7 13 48 13s-17.5 7.8-17.5 17.5S38.3 48 48 48zm12.2 4.4H58c-3 1.4-6.4 2.2-10 2.2s-6.9-.8-10-2.2h-2.3c-10.1 0-18.4 8.2-18.4 18.4v5.7c0 3.6 2.9 6.6 6.6 6.6H72c3.6 0 6.6-2.9 6.6-6.6v-5.7c0-10.2-8.2-18.4-18.4-18.4z"}})])])};n._withStripped=!0;var i={render:n,staticRenderFns:[]};e.a=i},"3kZB":function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"w-1000 flex space-between"},[a("div",{staticClass:"left-content"},[a("div",{staticClass:"flex mid"},[a("User2",{staticClass:"icon-other no-circle mr-5"}),a("span",{staticClass:"title-icon"},[a("b",[t._v(t._s(t.$t("1")))])])],1),a("div",{staticClass:"search-content flex mid center mt-15 mb-5"},[a("div",{staticClass:"flex mid w-full"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.name,expression:"name"}],staticClass:"pl-15 pr-15 w-full",attrs:{type:"text",placeholder:t.$t("2"),maxlength:"80"},domProps:{value:t.name},on:{input:function(e){e.target.composing||(t.name=e.target.value)}}}),a("button",{staticClass:"flex mid center",attrs:{type:"button"},on:{click:t.Search}},[a("span",{staticClass:"glyphicon glyphicon-search"})])])]),a("div",{staticClass:"flex flex-wrap mt-10"},t._l(t.dataDevsShow.data,function(e,n){return a("UserVertical",{key:n,attrs:{user:e,alt:e.name+" "+t.$t("5")}})}),1),a("paging",{staticClass:"w-full mt-10 text-center",attrs:{"cur-page":t.dataDevsShow.currentPage,total:t.dataDevsShow.lastPage,from:t.dataDevsShow.pagingFrom,to:t.dataDevsShow.pagingTo,"has-scroll":!0,"is-add-url-param":!0,"origin-url":"/systemtrade/developers","theme-class":"theme4"},on:{pagingclick:t.onPagingClick}})],1),a("div",{staticClass:"right-content"},[a("div",{staticClass:"title-right flex mid pl-10 mb-15"},[a("b",[t._v(t._s(t.$t("3")))])]),a("div",{staticClass:"banner",domProps:{innerHTML:t._s(t.campaigns.content)}})])])};n._withStripped=!0;var i={render:n,staticRenderFns:[]};e.a=i},"4POc":function(t,e,a){"use strict";var n=a("r71N"),i=a("VU/8")(null,n.a,!1,null,null,null);i.options.__file="components/icons/AngleRight.vue",e.a=i.exports},"8GWk":function(t,e,a){"use strict";var n=a("Dd19"),i=a("ByS+"),r=!1;var s=function(t){r||a("nDub")},o=a("VU/8")(n.a,i.a,!1,s,"data-v-633d16e4",null);o.options.__file="components/paging/Paging.vue",e.a=o.exports},AJzC:function(t,e,a){"use strict";var n=a("//Fk"),i=a.n(n),r=a("d7EF"),s=a.n(r),o=a("Xxa5"),l=a.n(o),c=a("exGp"),d=a.n(c),u=a("woOf"),h=a.n(u),p=a("wf+D"),g=a.n(p),f=a("8GWk"),v=a("jUZr"),m=a("h4En"),b=a("pTVa"),x=a("f1nF"),w=(a.n(x),h()({components:{User2:v.a,Paging:f.a,UserVertical:m.a},i18n:{messages:g.a},data:function(){return{dataDevsShow:{currentPage:1,lastPage:1,pagingFrom:1,pagingTo:1,data:[]},name:null}},methods:{onPagingClick:function(t){this.dataDevsShow=Object(x.calPaging)(this.dataDevs,t,72,4)},Search:function(){var t=d()(l.a.mark(function t(){var e;return l.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.GoGoHTTP.get("/api/v3/surface/systemtrade/developers?name="+this.name);case 2:e=t.sent,this.dataDevs=e,this.dataDevsShow=Object(x.calPaging)(this.dataDevs,1,72,4);case 5:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),descriptionTemplate:function(){return this.$t("4")}},asyncData:function(){var t=d()(l.a.mark(function t(e){var a,n,r,o,c,d=e.app,u=e.params;return l.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i.a.all([d.GoGoHTTP.get("/api/v3/surface/systemtrade/developers"),d.GoGoHTTP.get("/api/v3/surface/campaigns")]);case 2:return a=t.sent,n=s()(a,2),r=n[0],o=n[1],c=Object(x.calPaging)(r,u.p,72,4),t.abrupt("return",{dataDevs:r,campaigns:o,titleChunk:g.a[d.i18n.locale][1],dataDevsShow:c,linkMeta:[{rel:"canonical",href:"https://www.gogojungle.co.jp/systemtrade/developers"}]});case 8:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}()},b.a));e.a=w},"ByS+":function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.curPage&&t.total>1?a("div",{staticClass:"paging-wrap",class:t.themeClass},[a("ul",{staticClass:"p-0"},[t.curPage>1?a("li",{staticClass:"first-page"},[a("a",{attrs:{href:"javascript:void(0)"},on:{click:function(e){return t.pagingClick(1)}}},[a("AngleDoubleLeft")],1)]):t._e(),t.curPage>1?a("li",[a("a",{attrs:{href:"javascript:void(0)"},on:{click:function(e){t.pagingClick(t.curPage-1?t.curPage-1:1)}}},[a("AngleLeft")],1)]):t._e(),t._l(t.pageRange+1,function(e){return a("li",{key:"Yj5V7"+e},[a("a",{class:{active:e-1+t.from==t.curPage},attrs:{href:"javascript:void(0)"},on:{click:function(a){return t.pagingClick(e-1+t.from)}}},[t._v("\n        "+t._s(e-1+t.from)+"\n      ")])])}),t.curPage<t.total?a("li",[a("a",{attrs:{href:"javascript:void(0)"},on:{click:function(e){return t.pagingClick(t.curPage+1)}}},[a("AngleRight")],1)]):t._e(),t.curPage<t.total?a("li",{staticClass:"last-page"},[a("a",{attrs:{href:"javascript:void(0)"},on:{click:function(e){return t.pagingClick(t.total)}}},[a("AngleDoubleRight")],1)]):t._e()],2)]):t._e()};n._withStripped=!0;var i={render:n,staticRenderFns:[]};e.a=i},CaSH:function(t,e,a){"use strict";var n=a("dLf1");e.a={components:{GogoLink:n.a},props:{user:{type:Object,default:function(){return{}}},alt:{type:String,default:""}}}},Dd19:function(t,e,a){"use strict";(function(t){var n=a("QvAc"),i=a("u0qp"),r=a("FaRF"),s=a("4POc"),o=a("f1nF");a.n(o);e.a={components:{AngleDoubleLeft:n.a,AngleDoubleRight:i.a,AngleLeft:r.a,AngleRight:s.a},props:{curPage:[Number,String],total:Number,from:Number,to:Number,hasScroll:Boolean,scrollOffset:{type:Number,default:0},scrollOffsetEl:String,themeClass:{type:String,default:"theme1"},isAddUrlParam:Boolean,originUrl:String},computed:{pageRange:function(){return this.to-this.from}},mounted:function(){var t=this;this.isAddUrlParam&&(window.onpopstate=function(e){e.state.p&&t.$emit("pagingclick",e.state.p)})},methods:{scrollToTop:function(){var e=0;this.scrollOffsetEl&&(e=t(this.scrollOffsetEl).offset().top),this.scrollOffset&&(e+=this.scrollOffset),t("html, body").animate({scrollTop:e},"slow")},pagingClick:function(t){if(t!==this.curPage){if(this.isAddUrlParam){var e=Object(o.pushState)({p:t},null,"",this.originUrl);this.sendPageView(e)}this.isAddUrlParam01&&Object(o.pushState)({p:t},null,"",this.urlParam,"/"),this.$emit("pagingclick",t)}}},watch:{curPage:function(){this.hasScroll&&this.scrollToTop()}}}}).call(e,a("7t+N"))},FBKV:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("AJzC"),i=a("3kZB"),r=!1;var s=function(t){r||a("aWw4")},o=a("VU/8")(n.a,i.a,!1,s,"data-v-5005054f",null);o.options.__file="desktop/pages/systemtrade/index/developers/index.vue",e.default=o.exports},FaRF:function(t,e,a){"use strict";var n=a("MrpA"),i=a("VU/8")(null,n.a,!1,null,null,null);i.options.__file="components/icons/AngleLeft.vue",e.a=i.exports},Mc3q:function(t,e){t.exports={ja:{title:"自動売買・相場分析・投資戦略の販売プラットフォーム - GogoJungle",description:"fx-on.comはGogojungleにリニューアル致しました。「投資家の英知をすべて人に」を目標に、これから投資を始めようとする方からベテランの方まで自動売買やシステムトレード、fx学習など様々な視点から投資の情報を交換できるソーシャルネットECサービスです。",keywords:"インジケーター・ツール・電子書籍,システムトレード,自動売買,fx,トレード,シグナル,投資情報,fx学習,外国為替,投資",suffixDes:"の販売ページです。",shortTitle:"| GogoJungle"},en:{title:"GogoJungle | Auto Trading - Market Analysis - Investment Strategy",description:"Previously known as fx-on.com, GogoJungle is an E-Commerce and C2C market that allows users to exchange knowledge and products, such as Trade Systems, Expert Advisors (EAs), FX E-books, etc. between beginner and expert traders. Our purpose is to bring everyone together and help them achieve common goals.",keywords:"Indicators・Tools・E-books, System Traders, Automated Trading Systems, Fx, Trade, Signals, Market News, Fx Learning, Foreign Exchange, Investment",suffixDes:"s Sales Page",shortTitle:"| GogoJungle"},th:{title:"GogoJungle  | แพลตฟอร์มระบบซื้อขายอัตโนมัติ・การวิเคราะห์ตลาด・กลยุทธ์การลงทุน",description:'fx-on.com ได้เปลี่ยนชื่อใหม่เป็น Gogojungle มีเป้าหมาย "เป็นแหล่งความรู้สำหรับนักลงทุนทุกๆคน" โดยให้บริการเครือข่ายทางสังคม และ EC ที่ช่วยให้คุณสามารถแลกเปลี่ยนข้อมูลการลงทุนจากมุมมองต่างๆ เช่นการซื้อขายอัตโนมัติ ความรู้เกี่ยวกับ FX ฯลฯ เหมาะสำหรับนักลงทุนที่เพิ่งเริ่มต้น ไปจนถึงนักลงทุนที่มีประสบการณ์สูง',keywords:"อินดิเคเตอร์・เครื่องมือ・E-books,Trading systems,ระบบซื้อขายอัตโนมัติ,ฟอเร็กซ์,การเทรด,Signals,ข้อมูลการลงทุน,เรียนรู้ฟอเร็กซ์,แลกเปลี่ยนเงินตราต่างประเทศ,การลงทุน",suffixDes:"ของหน้าการขาย",shortTitle:"| GogoJungle"},ch:{title:"自动交易，市场分析和投资策略销售平台-GogoJungle",description:"fx-on.com 将改版为Gogojungle。以「投资者智慧为所有人享有」为目标，这是一个从今而后，从投资的初学者到达人都能够共享如自动买卖或交易系统、外汇学习等等各种视点的社交EC服务。",keywords:"指标·工具·电子书，系统交易，自动交易，外汇，交易，信號，投资信息，外汇学习，外汇，投资",suffixDes:"的销售页面。",shortTitle:"| GogoJungle"},tw:{title:"自動交易、市場分析和投資策略銷售平台-GogoJungle",description:"fx-on.com 將改版為Gogojungle。以「投資者智慧為所有人享有」為目標，這是一個從今而後，從投資的初學者到達人都能夠共享如自動買賣或交易系統、外匯學習等等各種視點的社交EC服務。",keywords:"指標·工具·電子書，系統交易，自動交易，外匯，交易，信號，投資情報，外匯學習，外匯，投資",suffixDes:"的銷售頁面。",shortTitle:"| GogoJungle"},vi:{title:"GogoJungle | Tự động giao dịch - Phân tích thị trường - Chiến lược đầu tư",description:'fx-on.com đã được đổi mới thành Gogojungle. Dịch vụ kết nối xã hội EC cho phép bạn trao đổi thông tin đầu tư thông qua nhiều phương thức đa dạng  như giao dịch tự động, hệ thống giao dịch, kiến thức fx, v.v. từ những người là nhà đầu tư mới bắt đầu đến những nhà đầu tư chuyên nghiệp với mục tiêu "Mang đến kiến thức đầu tư".',keywords:"Indicators・Công cụ・E-books,Hệ thống giao dịch,Hệ thống giao dịch tự động,fx,Trade,Tín hiệu,Thông tin đầu tư,Kiến thức Fx,Ngoại hối,Đầu tư",suffixDes:"- Trang bán hàng",shortTitle:"| GogoJungle"}}},MrpA:function(t,e,a){"use strict";var n=function(){var t=this.$createElement,e=this._self._c||t;return e("i",{staticClass:"icon-cls"},[e("svg",{attrs:{viewBox:"0 0 96 96",xmlns:"http://www.w3.org/2000/svg",width:"36",height:"36"}},[e("path",{attrs:{fill:"currentColor",d:"M31.3 45.2l22.1-22.1c1.5-1.5 4-1.5 5.5 0l3.7 3.7c1.5 1.5 1.5 4 0 5.5L46.9 48l15.8 15.7c1.5 1.5 1.5 4 0 5.5L59 72.9c-1.5 1.5-4 1.5-5.5 0L31.3 50.8c-1.6-1.6-1.6-4 0-5.6z"}})])])};n._withStripped=!0;var i={render:n,staticRenderFns:[]};e.a=i},NBmu:function(t,e,a){"use strict";var n=function(){var t=this.$createElement;return(this._self._c||t)("a",{staticClass:"cursor-pointer gogo-link",attrs:{href:this.href}},[this._t("default")],2)};n._withStripped=!0;var i={render:n,staticRenderFns:[]};e.a=i},QvAc:function(t,e,a){"use strict";var n=a("ZIwq"),i=a("VU/8")(null,n.a,!1,null,null,null);i.options.__file="components/icons/AngleDoubleLeft.vue",e.a=i.exports},VRKY:function(t,e,a){(t.exports=a("FZ+f")(!1)).push([t.i,".left-content[data-v-5005054f]{width:670px}.left-content .icon-other[data-v-5005054f]{width:30px;height:30px;background:#7d7d7d;border-radius:50%;color:#fff}.left-content .icon-other.no-circle[data-v-5005054f]{padding:2px}.left-content .title-icon[data-v-5005054f]{font-size:20px;color:#7d7d7d;margin-top:2px}.right-content[data-v-5005054f]{width:300px}.right-content .title-right[data-v-5005054f]{height:30px;border-left:3px solid #dbdbdb;background:#f0f0f0;font-size:16px;color:#7d7d7d}.right-content .banner[data-v-5005054f] img:hover{opacity:.85}.search-content[data-v-5005054f]{background:#dbdbdb;height:60px;padding:0 7px}.search-content input[data-v-5005054f]{border-radius:4px 0 0 4px;border:1px solid #cecdce;border-right:0;outline:none;overflow:hidden;height:46px}.search-content input[data-v-5005054f]::-webkit-input-placeholder{font-size:15px;color:#bfbfbf}.search-content input[data-v-5005054f]::-moz-placeholder{font-size:15px;color:#bfbfbf}.search-content input[data-v-5005054f]::-ms-input-placeholder{font-size:15px;color:#bfbfbf}.search-content input[data-v-5005054f]::placeholder{font-size:15px;color:#bfbfbf}.search-content button[data-v-5005054f]{background-color:#fff;width:46px;height:46px;color:#777;font-size:15px;outline:none;border-radius:0 4px 4px 0;border:1px solid #cecdce;border-left:0}.search-content button[data-v-5005054f]:hover{background-color:#eee}",""])},ZIwq:function(t,e,a){"use strict";var n=function(){var t=this.$createElement,e=this._self._c||t;return e("i",{staticClass:"icon-cls"},[e("svg",{attrs:{viewBox:"0 0 96 96",xmlns:"http://www.w3.org/2000/svg"}},[e("path",{attrs:{fill:"currentColor",d:"M47 45.2l22.2-22.1c1.5-1.5 4-1.5 5.5 0l3.7 3.7c1.5 1.5 1.5 4 0 5.5L62.6 48l15.7 15.7c1.5 1.5 1.5 4 0 5.5l-3.7 3.7c-1.5 1.5-4 1.5-5.5 0L47 50.8c-1.6-1.6-1.6-4 0-5.6zm-31.4 5.6l22.2 22.1c1.5 1.5 4 1.5 5.5 0l3.7-3.7c1.5-1.5 1.5-4 0-5.5L31.3 48 47 32.3c1.5-1.5 1.5-4 0-5.5l-3.7-3.7c-1.5-1.5-4-1.5-5.5 0L15.7 45.2c-1.6 1.6-1.6 4-.1 5.6z"}})])])};n._withStripped=!0;var i={render:n,staticRenderFns:[]};e.a=i},aWw4:function(t,e,a){var n=a("VRKY");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);a("rjj0")("1d0316f8",n,!1,{sourceMap:!1})},dLf1:function(t,e,a){"use strict";var n=a("t39g"),i=a("NBmu"),r=a("VU/8")(n.a,i.a,!1,null,null,null);r.options.__file="components/link/GogoLink.vue",e.a=r.exports},gOnu:function(t,e,a){(t.exports=a("FZ+f")(!1)).push([t.i,".paging-wrap ul[data-v-633d16e4]{list-style:none}.paging-wrap ul li[data-v-633d16e4]{display:inline-block;width:30px;height:35px;line-height:35px;text-align:center;margin:0 5px;border-radius:3px}.paging-wrap ul li a[data-v-633d16e4]{display:block;text-decoration:none}.paging-wrap ul li[data-v-633d16e4]:hover{background:transparent;-webkit-transition:all .3s;transition:all .3s}.paging-wrap ul .first-page[data-v-633d16e4],.paging-wrap ul .last-page[data-v-633d16e4]{width:80px}.theme1 ul li[data-v-633d16e4]{border:1px solid #b2b2b2;background:#fff;border-radius:3px}.theme1 ul li a[data-v-633d16e4]{color:#039cef}.theme1 ul li a.active[data-v-633d16e4]{color:#2d2d2d}.theme1 ul li[data-v-633d16e4]:hover{background:transparent;-webkit-transition:all .3s;transition:all .3s}.theme1 ul li:hover>a[data-v-633d16e4]{color:#2d2d2d}.theme2 ul li[data-v-633d16e4]{background:#ccc;border-radius:3px;border:none}.theme2 ul li a[data-v-633d16e4]{color:#707070}.theme2 ul li a.active[data-v-633d16e4]{color:#fff;background:#f6ba44;border-radius:3px}.theme2 ul li[data-v-633d16e4]:hover{background:transparent;-webkit-transition:all .3s;transition:all .3s}.theme2 ul li:hover>a[data-v-633d16e4]{color:#fff;background:#f6ba44;border-radius:3px}.theme3 ul li[data-v-633d16e4]{background:#ccc;border-radius:3px;border:none}.theme3 ul li a[data-v-633d16e4]{color:#707070}.theme3 ul li a.active[data-v-633d16e4]{color:#fff;background:#337ab7;border-radius:3px}.theme3 ul li[data-v-633d16e4]:hover{background:transparent;-webkit-transition:all .3s;transition:all .3s}.theme3 ul li:hover>a[data-v-633d16e4]{color:#fff;background:#337ab7;border-radius:3px}.theme4 ul li[data-v-633d16e4]{border:1px solid #b2b2b2;background:#fff;border-radius:3px}.theme4 ul li a[data-v-633d16e4]{color:#656565}.theme4 ul li a.active[data-v-633d16e4]{color:#039cef}.theme4 ul li[data-v-633d16e4]:hover{background:transparent;-webkit-transition:all .3s;transition:all .3s}.theme4 ul li:hover>a[data-v-633d16e4]{color:#039cef}.theme5 ul li[data-v-633d16e4]{background:#ccc;border-radius:3px;border:none}.theme5 ul li a[data-v-633d16e4]{color:#707070}.theme5 ul li a.active[data-v-633d16e4]{color:#fff;background:#ff8500;border-radius:3px}.theme5 ul li[data-v-633d16e4]:hover{background:transparent;-webkit-transition:all .3s;transition:all .3s}.theme5 ul li:hover>a[data-v-633d16e4]{color:#fff;background:#ff8500;border-radius:3px}@media only screen and (max-width:768px),only screen and (max-width:896px) and (max-height:414px){.theme5[data-v-633d16e4]{display:none}}.icon-cls[data-v-633d16e4]{width:18px;height:20px;vertical-align:middle}",""])},grca:function(t,e,a){"use strict";var n=function(){var t=this.$createElement,e=this._self._c||t;return e("i",{staticClass:"icon-cls"},[e("svg",{attrs:{viewBox:"0 0 96 96",xmlns:"http://www.w3.org/2000/svg"}},[e("path",{attrs:{fill:"currentColor",d:"M49 50.8L26.9 72.9c-1.5 1.5-4 1.5-5.5 0l-3.7-3.7c-1.5-1.5-1.5-4 0-5.5L33.4 48 17.6 32.3c-1.5-1.5-1.5-4 0-5.5l3.7-3.7c1.5-1.5 4-1.5 5.5 0L49 45.2c1.6 1.6 1.6 4 0 5.6zm31.4-5.6L58.2 23.1c-1.5-1.5-4-1.5-5.5 0L49 26.8c-1.5 1.5-1.5 4 0 5.5L64.7 48 49 63.7c-1.5 1.5-1.5 4 0 5.5l3.7 3.7c1.5 1.5 4 1.5 5.5 0l22.2-22.1c1.5-1.6 1.5-4 0-5.6z"}})])])};n._withStripped=!0;var i={render:n,staticRenderFns:[]};e.a=i},h4En:function(t,e,a){"use strict";var n=a("CaSH"),i=a("mY2X"),r=!1;var s=function(t){r||a("maKv")},o=a("VU/8")(n.a,i.a,!1,s,"data-v-3753d0a6",null);o.options.__file="desktop/components/user/UserVertical.vue",e.a=o.exports},hFZ6:function(t,e,a){(t.exports=a("FZ+f")(!1)).push([t.i,".user-vertical[data-v-3753d0a6]{width:90px;-webkit-box-sizing:content-box;box-sizing:content-box;position:relative}.user-vertical[data-v-3753d0a6]:hover{background:#f5f5f5}.user-vertical .user-img[data-v-3753d0a6]{width:100%;height:0;padding-bottom:100%;border:1px solid #bdbdbd;overflow:hidden}.user-vertical .user-img img[data-v-3753d0a6]{width:100%;height:100%}.user-vertical .user-name[data-v-3753d0a6]{min-height:38px;line-height:17px;overflow:hidden;color:#666}",""])},jUZr:function(t,e,a){"use strict";var n=a("0XbJ"),i=a("VU/8")(null,n.a,!1,null,null,null);i.options.__file="components/icons/User2.vue",e.a=i.exports},mY2X:function(t,e,a){"use strict";var n=function(){var t=this.$createElement,e=this._self._c||t;return e("GogoLink",{staticClass:"user-vertical p-10",attrs:{target:"/users/"+this.user.id}},[e("div",{staticClass:"user-img pos-rel"},[e("img",{staticClass:"pos-abs",attrs:{src:"/img/users/"+this.user.id,alt:this.alt}})]),e("div",{directives:[{name:"wrap-lines",rawName:"v-wrap-lines",value:2,expression:"2"}],staticClass:"user-name mt-5 text-center",attrs:{title:this.user.name}},[this._v(this._s(this.user.name))])])};n._withStripped=!0;var i={render:n,staticRenderFns:[]};e.a=i},maKv:function(t,e,a){var n=a("hFZ6");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);a("rjj0")("1ec3d226",n,!1,{sourceMap:!1})},nDub:function(t,e,a){var n=a("gOnu");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);a("rjj0")("ebdea6d6",n,!1,{sourceMap:!1})},pTVa:function(t,e,a){"use strict";var n=a("mvHQ"),i=a.n(n),r=a("Gu7T"),s=a.n(r),o=a("u2KI"),l=a.n(o),c=a("Mc3q"),d=a.n(c),u={vi:"vi",ja:"ja",en:"en",th:"th",ch:"ja",tw:"ja"};e.a=l()({head:function(){var t=this,e=this.$i18n.locale,a=d.a[e]||d.a.ja,n=a.title,r=a.description,o=a.keywords,l=this.descriptionTemplate,c=this.keywordsTemplate,h=(this.meta||[]).concat([{name:"description",content:l?l.call(this):this.descriptionChunk?"『"+this.descriptionChunk+"』 "+r:r,hid:"description"},{name:"keywords",content:c?c.call(this):this.keywordsChunk?this.keywordsChunk+"："+o:o,hid:"keywords"}]),p=this.linkMeta||[],g=this.titleTemplate,f={lang:u[e]||"ja"},v=this.jsonLDTemplate;return{titleTemplate:function(e){return g?g.call(t,a):e?e+" - "+n:""+n},titleChunk:this.titleChunk||null,meta:h,link:p,htmlAttrs:f,script:[].concat(s()(this.script||[]),[v?{type:"application/ld+json",innerHTML:i()(v),charset:"utf-8"}:{}]),__dangerouslyDisableSanitizers:v?["script"]:void 0}}})},r71N:function(t,e,a){"use strict";var n=function(){var t=this.$createElement,e=this._self._c||t;return e("i",{staticClass:"icon-cls"},[e("svg",{attrs:{viewBox:"0 0 96 96",xmlns:"http://www.w3.org/2000/svg",width:"36",height:"36"}},[e("path",{attrs:{fill:"currentColor",d:"M64.7 50.8L42.6 72.9c-1.5 1.5-4 1.5-5.5 0l-3.7-3.7c-1.5-1.5-1.5-4 0-5.5L49.1 48 33.3 32.3c-1.5-1.5-1.5-4 0-5.5l3.7-3.7c1.5-1.5 4-1.5 5.5 0l22.2 22.1c1.6 1.6 1.6 4 0 5.6z"}})])])};n._withStripped=!0;var i={render:n,staticRenderFns:[]};e.a=i},t39g:function(t,e,a){"use strict";e.a={props:{target:{type:[String,Object],default:"/"}},watch:{target:function(t){"string"==typeof t&&(this.href=t)}},data:function(){var t=this.target;return"string"==typeof t?{href:t}:{href:(t=this.$router.resolve(this.target)).href}}}},u0qp:function(t,e,a){"use strict";var n=a("grca"),i=a("VU/8")(null,n.a,!1,null,null,null);i.options.__file="components/icons/AngleDoubleRight.vue",e.a=i.exports},"wf+D":function(t,e){t.exports={ja:{1:"開発者検索",2:"キーワードで検索",3:"口座開設タイアップ",4:"GogoJungleで販売している自動売買ソフトウェアの開発者一覧です。",5:"開発者"},en:{1:"EA Developer Search",2:"Search by Keyword",3:"Open Real Account",4:"This is a list of developers of automated trading software sold at GogoJungle.",5:"Developers"},th:{1:"ค้นหานักพัฒนา",2:"ค้นหาคีย์เวิร์ด",3:"เปิดบัญชีใหม่",4:"รายการชื่อของผู้พัฒนาซอฟต์แวร์ซื้อขายอัตโนมัติที่วางขายใน GogoJungle",5:"นักพัฒนา"},ch:{1:"开发者搜索",2:"按关键字搜索",3:"开户合作",4:"这是在GogoJungle出售的自动交易软件的开发人员的列表。",5:"开发者"},tw:{1:"開發者搜索",2:"按關鍵字搜索",3:"開戶合作",4:"這是在GogoJungle出售的自動交易軟件的開發人員的列表。",5:"開発者"},vi:{1:"Tìm EA developer",2:"Tìm kiếm theo từ khóa",3:"Mở tài khoản thật",4:"Đây là danh sách các nhà phát triển phần mềm giao dịch tự động được bán tại GogoJungle.",5:"Nhà phát triển"}}}});
//# sourceMappingURL=index.ee0352a54a4970ed5a77.js.map