webpackJsonp([75],{"+MLA":function(t,e,r){var n=r("EqjI"),i=r("06OY").onFreeze;r("uqUo")("freeze",function(t){return function(e){return t&&n(e)?t(i(e)):e}})},"0XbJ":function(t,e,r){"use strict";var n=function(){var t=this.$createElement,e=this._self._c||t;return e("i",{staticClass:"icon-cls"},[e("svg",{attrs:{viewBox:"0 0 96 96",xmlns:"http://www.w3.org/2000/svg"}},[e("path",{attrs:{fill:"currentColor",d:"M48 48c9.7 0 17.5-7.8 17.5-17.5S57.7 13 48 13s-17.5 7.8-17.5 17.5S38.3 48 48 48zm12.2 4.4H58c-3 1.4-6.4 2.2-10 2.2s-6.9-.8-10-2.2h-2.3c-10.1 0-18.4 8.2-18.4 18.4v5.7c0 3.6 2.9 6.6 6.6 6.6H72c3.6 0 6.6-2.9 6.6-6.6v-5.7c0-10.2-8.2-18.4-18.4-18.4z"}})])])};n._withStripped=!0;var i={render:n,staticRenderFns:[]};e.a=i},"4POc":function(t,e,r){"use strict";var n=r("r71N"),i=r("VU/8")(null,n.a,!1,null,null,null);i.options.__file="components/icons/AngleRight.vue",e.a=i.exports},"6Dpt":function(t,e,r){"use strict";var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return t.curPage&&t.total>1?r("div",{staticClass:"paging-wrap",class:t.themeClass},[r("ul",{staticClass:"flex center"},[t.curPage>1?r("li",{staticClass:"first-page"},[r("a",{attrs:{href:"javascript:void(0)"},on:{click:function(e){return t.pagingClick(1)}}},[r("AngleDoubleLeft")],1)]):t._e(),t.curPage>1?r("li",[r("a",{attrs:{href:"javascript:void(0)"},on:{click:function(e){t.pagingClick(t.curPage-1?t.curPage-1:1)}}},[r("AngleLeft")],1)]):t._e(),t._l(t.pageRange+1,function(e){return r("li",{key:"Yj5V7"+e},[r("a",{class:{active:e-1+t.from==t.curPage},attrs:{href:"javascript:void(0)"},on:{click:function(r){return t.pagingClick(e-1+t.from)}}},[t._v("\n        "+t._s(e-1+t.from)+"\n      ")])])}),t.curPage<t.total?r("li",[r("a",{attrs:{href:"javascript:void(0)"},on:{click:function(e){return t.pagingClick(t.curPage+1)}}},[r("AngleRight")],1)]):t._e(),t.curPage<t.total?r("li",{staticClass:"last-page"},[r("a",{attrs:{href:"javascript:void(0)"},on:{click:function(e){return t.pagingClick(t.total)}}},[r("AngleDoubleRight")],1)]):t._e()],2)]):t._e()};n._withStripped=!0;var i={render:n,staticRenderFns:[]};e.a=i},B1pe:function(t,e){t.exports={ja:{1:"開発者検索",2:"GogoJungleで販売している自動売買ソフトウェアの開発者一覧です。",3:"開発者"},en:{1:"EA Developer Search",2:"GogoJungleで販売している自動売買ソフトウェアの開発者一覧です。",3:"開発者"},th:{1:"ค้นหานักพัฒนาซอฟต์แวร์",2:"GogoJungleで販売している自動売買ソフトウェアの開発者一覧です。",3:"開発者"},ch:{1:"开发者搜索",2:"这是在GogoJungle出售的自动交易软件的开发人员的列表。",3:"开发人员"},tw:{1:"開發者搜索",2:"這是在GogoJungle出售的自動交易軟件的開發人員的列表。",3:"開發人員"},vi:{1:"EA Developer Search",2:"GogoJungleで販売している自動売買ソフトウェアの開発者一覧です。",3:"開発者"}}},FaRF:function(t,e,r){"use strict";var n=r("MrpA"),i=r("VU/8")(null,n.a,!1,null,null,null);i.options.__file="components/icons/AngleLeft.vue",e.a=i.exports},HV4T:function(t,e,r){"use strict";var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("section",{staticClass:"pt-30"},[r("IconHeader",{attrs:{item:t.title}},[r(t.title.icon,{tag:"i"})],1),r("div",{staticClass:"flex flex-wrap developer-list"},t._l(t.dataDevsShow.data,function(e){return r("GogoLink",{key:"developer-"+e.id,staticClass:"developer",attrs:{target:"/users/"+e.id}},[r("div",{staticClass:"img-wrapp flex center pos-rel"},[r("img",{staticClass:"pos-abs",attrs:{src:"/img/users/"+e.id,alt:e.name+" "+t.$t("3")}})]),r("div",{staticClass:"wrap-text text-center name"},[t._v(t._s(e.name))])])}),1),r("paging",{staticClass:"product-paging mb-40",attrs:{"cur-page":t.dataDevsShow.currentPage,total:t.dataDevsShow.lastPage,from:t.dataDevsShow.pagingFrom,to:t.dataDevsShow.pagingTo,"has-scroll":!0,"is-add-url-param":!0,"origin-url":t.originUrl,"theme-class":"theme1"},on:{pagingclick:t.onPagingClick}})],1)};n._withStripped=!0;var i={render:n,staticRenderFns:[]};e.a=i},MZxQ:function(t,e,r){var n=r("qMnM");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);r("rjj0")("7cd7f155",n,!1,{sourceMap:!1})},Mc3q:function(t,e){t.exports={ja:{title:"自動売買・相場分析・投資戦略の販売プラットフォーム - GogoJungle",description:"fx-on.comはGogojungleにリニューアル致しました。「投資家の英知をすべて人に」を目標に、これから投資を始めようとする方からベテランの方まで自動売買やシステムトレード、fx学習など様々な視点から投資の情報を交換できるソーシャルネットECサービスです。",keywords:"インジケーター・ツール・電子書籍,システムトレード,自動売買,fx,トレード,シグナル,投資情報,fx学習,外国為替,投資",suffixDes:"の販売ページです。",shortTitle:"| GogoJungle"},en:{title:"GogoJungle | Auto Trading - Market Analysis - Investment Strategy",description:"Previously known as fx-on.com, GogoJungle is an E-Commerce and C2C market that allows users to exchange knowledge and products, such as Trade Systems, Expert Advisors (EAs), FX E-books, etc. between beginner and expert traders. Our purpose is to bring everyone together and help them achieve common goals.",keywords:"Indicators・Tools・E-books, System Traders, Automated Trading Systems, Fx, Trade, Signals, Market News, Fx Learning, Foreign Exchange, Investment",suffixDes:"s Sales Page",shortTitle:"| GogoJungle"},th:{title:"GogoJungle  | แพลตฟอร์มระบบซื้อขายอัตโนมัติ・การวิเคราะห์ตลาด・กลยุทธ์การลงทุน",description:'fx-on.com ได้เปลี่ยนชื่อใหม่เป็น Gogojungle มีเป้าหมาย "เป็นแหล่งความรู้สำหรับนักลงทุนทุกๆคน" โดยให้บริการเครือข่ายทางสังคม และ EC ที่ช่วยให้คุณสามารถแลกเปลี่ยนข้อมูลการลงทุนจากมุมมองต่างๆ เช่นการซื้อขายอัตโนมัติ ความรู้เกี่ยวกับ FX ฯลฯ เหมาะสำหรับนักลงทุนที่เพิ่งเริ่มต้น ไปจนถึงนักลงทุนที่มีประสบการณ์สูง',keywords:"อินดิเคเตอร์・เครื่องมือ・E-books,Trading systems,ระบบซื้อขายอัตโนมัติ,ฟอเร็กซ์,การเทรด,Signals,ข้อมูลการลงทุน,เรียนรู้ฟอเร็กซ์,แลกเปลี่ยนเงินตราต่างประเทศ,การลงทุน",suffixDes:"ของหน้าการขาย",shortTitle:"| GogoJungle"},ch:{title:"自动交易，市场分析和投资策略销售平台-GogoJungle",description:"fx-on.com 将改版为Gogojungle。以「投资者智慧为所有人享有」为目标，这是一个从今而后，从投资的初学者到达人都能够共享如自动买卖或交易系统、外汇学习等等各种视点的社交EC服务。",keywords:"指标·工具·电子书，系统交易，自动交易，外汇，交易，信號，投资信息，外汇学习，外汇，投资",suffixDes:"的销售页面。",shortTitle:"| GogoJungle"},tw:{title:"自動交易、市場分析和投資策略銷售平台-GogoJungle",description:"fx-on.com 將改版為Gogojungle。以「投資者智慧為所有人享有」為目標，這是一個從今而後，從投資的初學者到達人都能夠共享如自動買賣或交易系統、外匯學習等等各種視點的社交EC服務。",keywords:"指標·工具·電子書，系統交易，自動交易，外匯，交易，信號，投資情報，外匯學習，外匯，投資",suffixDes:"的銷售頁面。",shortTitle:"| GogoJungle"},vi:{title:"GogoJungle | Tự động giao dịch - Phân tích thị trường - Chiến lược đầu tư",description:'fx-on.com đã được đổi mới thành Gogojungle. Dịch vụ kết nối xã hội EC cho phép bạn trao đổi thông tin đầu tư thông qua nhiều phương thức đa dạng  như giao dịch tự động, hệ thống giao dịch, kiến thức fx, v.v. từ những người là nhà đầu tư mới bắt đầu đến những nhà đầu tư chuyên nghiệp với mục tiêu "Mang đến kiến thức đầu tư".',keywords:"Indicators・Công cụ・E-books,Hệ thống giao dịch,Hệ thống giao dịch tự động,fx,Trade,Tín hiệu,Thông tin đầu tư,Kiến thức Fx,Ngoại hối,Đầu tư",suffixDes:"- Trang bán hàng",shortTitle:"| GogoJungle"}}},MrpA:function(t,e,r){"use strict";var n=function(){var t=this.$createElement,e=this._self._c||t;return e("i",{staticClass:"icon-cls"},[e("svg",{attrs:{viewBox:"0 0 96 96",xmlns:"http://www.w3.org/2000/svg",width:"36",height:"36"}},[e("path",{attrs:{fill:"currentColor",d:"M31.3 45.2l22.1-22.1c1.5-1.5 4-1.5 5.5 0l3.7 3.7c1.5 1.5 1.5 4 0 5.5L46.9 48l15.8 15.7c1.5 1.5 1.5 4 0 5.5L59 72.9c-1.5 1.5-4 1.5-5.5 0L31.3 50.8c-1.6-1.6-1.6-4 0-5.6z"}})])])};n._withStripped=!0;var i={render:n,staticRenderFns:[]};e.a=i},NBmu:function(t,e,r){"use strict";var n=function(){var t=this.$createElement;return(this._self._c||t)("a",{staticClass:"cursor-pointer gogo-link",attrs:{href:this.href}},[this._t("default")],2)};n._withStripped=!0;var i={render:n,staticRenderFns:[]};e.a=i},O4R0:function(t,e,r){r("+MLA"),t.exports=r("FeBl").Object.freeze},QvAc:function(t,e,r){"use strict";var n=r("ZIwq"),i=r("VU/8")(null,n.a,!1,null,null,null);i.options.__file="components/icons/AngleDoubleLeft.vue",e.a=i.exports},Sybr:function(t,e,r){"use strict";(function(t){var n=r("QvAc"),i=r("u0qp"),a=r("FaRF"),o=r("4POc"),s=r("VJF0");r.n(s);e.a={components:{AngleDoubleLeft:n.a,AngleDoubleRight:i.a,AngleLeft:a.a,AngleRight:o.a},props:{curPage:[Number,String],total:Number,from:Number,to:Number,hasScroll:Boolean,scrollOffset:{type:Number,default:0},scrollOffsetEl:String,themeClass:{type:String,default:"theme1"},isAddUrlParam:Boolean,originUrl:String},computed:{pageRange:function(){return this.to-this.from}},mounted:function(){var t=this;this.isAddUrlParam&&(window.onpopstate=function(e){e.state.p&&t.$emit("pagingclick",e.state.p)})},methods:{scrollToTop:function(){var e=0;this.scrollOffsetEl&&(e=t(this.scrollOffsetEl).offset().top),this.scrollOffset&&(e+=this.scrollOffset),t("html, body").animate({scrollTop:e},"slow")},pagingClick:function(t){t!==this.curPage&&(this.isAddUrlParam&&Object(s.pushState)({p:t},null,"",this.originUrl),this.$emit("pagingclick",t))}},watch:{curPage:function(){this.hasScroll&&this.scrollToTop()}}}}).call(e,r("7t+N"))},XUI7:function(t,e,r){(t.exports=r("FZ+f")(!1)).push([t.i,".item[data-v-1f3196ba]{border-radius:50%;color:#fff;font-size:5vw}.item i.icon-cls[data-v-1f3196ba]{width:13vw;height:13vw}.title[data-v-1f3196ba]{font-size:5vw;font-weight:700;color:#707070;line-height:6vw}@media only screen and (min-width:600px){.title[data-v-1f3196ba]{font-size:3.5vw}.item[data-v-1f3196ba]{width:11vw;height:11vw}.item i.icon-cls[data-v-1f3196ba]{width:8vw;height:8vw}}",""])},Xs8I:function(t,e,r){var n=r("brYK");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);r("rjj0")("ce455acc",n,!1,{sourceMap:!1})},ZIwq:function(t,e,r){"use strict";var n=function(){var t=this.$createElement,e=this._self._c||t;return e("i",{staticClass:"icon-cls"},[e("svg",{attrs:{viewBox:"0 0 96 96",xmlns:"http://www.w3.org/2000/svg"}},[e("path",{attrs:{fill:"currentColor",d:"M47 45.2l22.2-22.1c1.5-1.5 4-1.5 5.5 0l3.7 3.7c1.5 1.5 1.5 4 0 5.5L62.6 48l15.7 15.7c1.5 1.5 1.5 4 0 5.5l-3.7 3.7c-1.5 1.5-4 1.5-5.5 0L47 50.8c-1.6-1.6-1.6-4 0-5.6zm-31.4 5.6l22.2 22.1c1.5 1.5 4 1.5 5.5 0l3.7-3.7c1.5-1.5 1.5-4 0-5.5L31.3 48 47 32.3c1.5-1.5 1.5-4 0-5.5l-3.7-3.7c-1.5-1.5-4-1.5-5.5 0L15.7 45.2c-1.6 1.6-1.6 4-.1 5.6z"}})])])};n._withStripped=!0;var i={render:n,staticRenderFns:[]};e.a=i},brYK:function(t,e,r){(t.exports=r("FZ+f")(!1)).push([t.i,".developer-list[data-v-2c2075dd]{padding:4vw 4vw 0}.developer-list .developer[data-v-2c2075dd]{border:1px solid #d2d2d2;width:30.66667%;padding:2%;margin:0 4% 4% 0}.developer-list .developer[data-v-2c2075dd]:nth-child(3n){margin-right:0}.developer-list .developer .img-wrapp[data-v-2c2075dd]{width:100%;height:0;padding-top:100%;background:#eceef1}.developer-list .developer .img-wrapp img[data-v-2c2075dd]{max-width:100%;max-height:100%;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.developer-list .developer .name[data-v-2c2075dd]{color:#666;margin-top:2vw}@media only screen and (min-width:600px){.developer-list[data-v-2c2075dd]{padding:4vw 6vw 0}.developer-list .developer[data-v-2c2075dd]{width:22%}.developer-list .developer[data-v-2c2075dd]:nth-child(3n){margin-right:4%}.developer-list .developer[data-v-2c2075dd]:nth-child(4n){margin-right:0}}",""])},bzF5:function(t,e,r){var n=r("XUI7");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);r("rjj0")("32575d05",n,!1,{sourceMap:!1})},dLf1:function(t,e,r){"use strict";var n=r("t39g"),i=r("NBmu"),a=r("VU/8")(n.a,i.a,!1,null,null,null);a.options.__file="components/link/GogoLink.vue",e.a=a.exports},gkc0:function(t,e,r){"use strict";var n=r("Xxa5"),i=r.n(n),a=r("exGp"),o=r.n(a),s=r("woOf"),l=r.n(s),c=r("pTVa"),f=r("iKWF"),u=r("VJF0"),p=(r.n(u),r("B1pe")),h=r.n(p),g=r("dLf1"),d=r("uzeX"),v=r("jUZr"),k=l()({components:{IconHeader:f.a,GogoLink:g.a,Paging:d.a,User2:v.a},i18n:{messages:h.a},data:function(){return{title:{type:"developer",icon:"User2",bgColor:"#bbb9b9",url:"/systemtrade/developers"},dataDevsShow:{data:[]}}},asyncData:function(){var t=o()(i.a.mark(function t(e){var r,n,a,o=e.app,s=e.query,l=e.params;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,o.GoGoHTTP.get("/api/v3/surface/systemtrade/developers");case 2:return r=t.sent,n=void 0,a="/systemtrade/developers",s.q&&function(){for(var t=s.q.split(" "),e=function(e){if(!t[e])return"continue";r=r.filter(function(r){return-1!==r.name.indexOf(t[e])})},n=t.length-1;n>=0;n--)e(n)}(),n=Object(u.calPaging)(r,l.p,30),t.abrupt("return",{dataDevs:r,dataDevsShow:n,titleChunk:h.a[o.i18n.locale][1],originUrl:a,linkMeta:[{rel:"canonical",href:"https://www.gogojungle.co.jp"+a}]});case 8:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),methods:{onPagingClick:function(t){this.dataDevsShow=Object(u.calPaging)(this.dataDevs,t,30)},descriptionTemplate:function(){return this.$t("2")}}},c.a);e.a=k},grca:function(t,e,r){"use strict";var n=function(){var t=this.$createElement,e=this._self._c||t;return e("i",{staticClass:"icon-cls"},[e("svg",{attrs:{viewBox:"0 0 96 96",xmlns:"http://www.w3.org/2000/svg"}},[e("path",{attrs:{fill:"currentColor",d:"M49 50.8L26.9 72.9c-1.5 1.5-4 1.5-5.5 0l-3.7-3.7c-1.5-1.5-1.5-4 0-5.5L33.4 48 17.6 32.3c-1.5-1.5-1.5-4 0-5.5l3.7-3.7c1.5-1.5 4-1.5 5.5 0L49 45.2c1.6 1.6 1.6 4 0 5.6zm31.4-5.6L58.2 23.1c-1.5-1.5-4-1.5-5.5 0L49 26.8c-1.5 1.5-1.5 4 0 5.5L64.7 48 49 63.7c-1.5 1.5-1.5 4 0 5.5l3.7 3.7c1.5 1.5 4 1.5 5.5 0l22.2-22.1c1.5-1.6 1.5-4 0-5.6z"}})])])};n._withStripped=!0;var i={render:n,staticRenderFns:[]};e.a=i},gy1e:function(t,e,r){"use strict";var n=r("hzJv"),i=r.n(n);e.a={props:{width:{type:Number,default:16},height:{type:Number,default:16},item:{type:Object}},i18n:{messages:i.a}}},hzJv:function(t,e){t.exports={ja:{fx:"FX",stocks:"株",bitcoin:"ビットコイン",profitrate:"収益率",profit:"収益額",newproduct:"新着",profitfactor:"プロフィット<br>ファクター",riskreturn:"リスク<br>リターン率",sell:"売れ筋",fx1:"システムトレードの <br> 売れ筋ランキング - FX",stock1:"システムトレードの株 売れ筋ランキング",profitrate_all:"システムトレードの収益率ランキング（3ケ月）",profit_all:"システムトレードの収益額ランキング（3ケ月）",profitfactor_all:"プロフィットファクター（3ケ月）",riskreturn_all:"システムトレードのリスクリターン率ランキング（3ケ月）",newproduct_all:"システムトレード総合新着商品",sell_all:"システムトレードの <br> 売れ筋ランキング - 総合",profitrate_fx:"システムトレードの収益率ランキング（3ヶ月）- FX",profitrate_stock:"システムトレードの収益率ランキング（3ヶ月）- 株",profit_fx:"システムトレードの収益額ランキング（3ヶ月）- FX",profit_stock:"システムトレードの収益額ランキング（3ヶ月）- 株",profitfactor_fx:"プロフィットファクター（3ヶ月）- FX",profitfactor_stock:"プロフィットファクター（3ヶ月）- 株",riskreturn_fx:"システムトレードの <br> リスクリターン率ランキング（3ケ月）- FX",riskreturn_stock:"システムトレードのリスクリターン率<br>ランキング（3ケ月）- 株",newproduct_fx:"システムトレードFX新着商品",newproduct_stock:"システムトレード株新着商品",sell_fx:"システムトレードの <br> 売れ筋ランキング - FX",sell_stock:"システムトレードの <br> 売れ筋ランキング - 株",unemploy_fx:"失業率発表時の収益額ランキング",financial_fx:"日銀金融政策発表時の収益額ランキング",developer:"開発者検索",pips:"リアル運用ランキング",realasset:"リアル運用ランキング（3ヵ月） - 総合"},en:{fx:"FX",stocks:"Stock",bitcoin:"Bitcoins",profitrate:"Rate of return",profit:"Revenue",newproduct:"New arrivals",profitfactor:"Profit <br> factor",riskreturn:"Risk return<br> ratio",sell:"Bestsellers",fx1:"FX bestsellers ranking",stock1:"Stock bestsellers ranking",profitrate_all:"Rate of return ranking (Last 3 months)",profit_all:"Revenue ranking (Last 3 months)",profitfactor_all:"Profit factor (last 3 months)",riskreturn_all:"Risk return ranking (Last 3 months)",newproduct_all:"EA new arrivals (All)",sell_all:"Bestseller ranking (All)",profitrate_fx:"Rate of return ranking (Last 3 months) - FX",profitrate_stock:"Rate of return ranking (Last 3 months) - Stock",profit_fx:"Revenue ranking (Last 3 months) - FX",profit_stock:"Revenue ranking (Last 3 months) - Stock",profitfactor_fx:"Profit factor (Last 3 months) - FX",profitfactor_stock:"Profit factor (Last 3 months) - Stock",riskreturn_fx:"Risk return ranking (Last 3 months) - FX",riskreturn_stock:"Risk return ranking (Last 3 months) - Stock",newproduct_fx:"FX EA new arrivals",newproduct_stock:"Stock EA new arrivals",sell_fx:"Bestsellers ranking  - FX",sell_stock:"Bestsellers ranking - Stock",unemploy_fx:"Revenue ranking of unemployment rate release",financial_fx:"Revenue ranking of BOJ monetary policy release",developer:"Search EA Developer",pips:"Real Trade Ranking",realasset:"Real Trade Ranking (3 months) - All"},th:{fx:"FX",stocks:"หุ้น",bitcoin:"บิทคอยน์",profitrate:"Rate of return",profit:"รายได้",newproduct:"สินค้ามาใหม่",profitfactor:"Profit <br> Factor",riskreturn:"Risk - Return",sell:"สินค้าขายดี",fx1:"อันดับระบบเทรด FX ขายดี",stock1:"อันดับระบบเทรดหุ้น ขายดี",profitrate_all:"อันดับ Rate of return (3 เดือน)",profit_all:"อันดับรายได้ (3 เดือน)",profitfactor_all:"Profit Factor (3 เดือน)",riskreturn_all:"อันดับ Risk return (3 เดือน)",newproduct_all:"ระบบเทรดอัตโนมัติที่มาใหม่ทั้งหมด",sell_all:"อันดับสินค้าขายดี - ทั้งหมด",profitrate_fx:"อันดับ Rate of return (3 เดือน) - FX",profitrate_stock:"อันดับ Rate of return (3 เดือน) - หุ้น",profit_fx:"อันดับรายได้ (3 เดือน) - FX",profit_stock:"อันดับรายได้ (3 เดือน) - หุ้น",profitfactor_fx:"Profit factor (3 เดือน) - FX",profitfactor_stock:"Profit Factor (3 เดือน) - หุ้น",riskreturn_fx:"อันดับ Risk Return (3 เดือน) - FX",riskreturn_stock:"อันดับ Risk Return (3 เดือน) - หุ้น",newproduct_fx:"ระบบเทรดFXอัตโนมัติ มาใหม่",newproduct_stock:"ระบบเทรดหุ้นอัตโนมัติ มาใหม่",sell_fx:"อันดับสินค้าขายดี - ฟอเร็กซ์",sell_stock:"อันดับสินค้าขายดี - หุ้น",unemploy_fx:"การจัดอันดับรายได้ในช่วงเวลาแห่งการประกาศการว่างงาน",financial_fx:"การจัดอันดับรายได้ในขณะที่มีการประกาศนโยบายการเงินของ BOJ",developer:"ค้นหานักพัฒนา",pips:"untranslated",realasset:"Real Trade Ranking (3 เดือน) - ทั้งหมด"},ch:{fx:"FX",stocks:"股票",bitcoin:"比特币",profitrate:"回报率",profit:"收益额",newproduct:"新到",profitfactor:"Profit <br>factor",riskreturn:"风险<br>回报率",sell:"销售",fx1:"FX热卖排行",stock1:"股票 热卖排行",profitrate_all:"回报率排行（3个月）",profit_all:"收益额排行（3个月）",profitfactor_all:"Profit factor（3个月）",riskreturn_all:"风险回报率排行（3个月）",newproduct_all:"系统交易综合新到产品",sell_all:"热卖排名-总合",profitrate_fx:"回报率排行（3个月） - FX",profitrate_stock:"回报率排行（3个月） - 股票",profit_fx:"收益额排行（3个月）- FX",profit_stock:"收益额排行（3个月）- 股票",profitfactor_fx:"Profit factor 排行（3个月）- FX",profitfactor_stock:"Profit factor 排行（3个月）- 股票",riskreturn_fx:"风险回报率排行（3个月）- FX",riskreturn_stock:"风险回报率排行（3个月）- 股票",newproduct_fx:"系统交易FX",newproduct_stock:"システムトレード株新到产品",sell_fx:"热卖排行 - FX",sell_stock:"热卖排行 - 股票",unemploy_fx:"失业公告时的收入金额排行",financial_fx:"日本央行货币政策公告时的收入金额排行",developer:"开发者搜索",pips:"untranslated",realasset:"untranslated"},tw:{fx:"FX",stocks:"股票",bitcoin:"比特幣",profitrate:"回報率",profit:"收益額",newproduct:"新到",profitfactor:"Profit <br>factor",riskreturn:"風險<br>回報率",sell:"銷售",fx1:"FX熱賣排行",stock1:"股票 熱賣排行",profitrate_all:"回報率排行（3個月）",profit_all:"收益額排行（3個月）",profitfactor_all:"Profit factor （3個月）",riskreturn_all:"風險回報率排行（3個月）",newproduct_all:"系統交易綜合新到商品",sell_all:"熱賣排名-總合",profitrate_fx:"回報率排行（3個月） - FX",profitrate_stock:"回報率排行（3個月） - 股票",profit_fx:"收益額排行（3個月）- FX",profit_stock:"收益額排行（3個月）- 股票",profitfactor_fx:"Profit factor 排行（3個月）- FX",profitfactor_stock:"Profit factor 排行（3個月）- 股票",riskreturn_fx:"風險回報率排行（3個月）- FX",riskreturn_stock:"風險回報率排行（3個月）- 股票",newproduct_fx:"系統交易FX",newproduct_stock:"システムトレード株新着商品",sell_fx:"熱賣排行 - FX",sell_stock:"熱賣排行 - 股票",unemploy_fx:"失業公告時的收入金額排行",financial_fx:"日本央行貨幣政策公告時的收入金額排行",developer:"開發者搜索",pips:"untranslated",realasset:"untranslated"},vi:{fx:"FX",stocks:"Stock",bitcoin:"Bitcoins",profitrate:"Tỉ suất lợi nhuận",profit:"Doanh thu",newproduct:"Sản phẩm mới",profitfactor:"Profit <br> factor",riskreturn:"Risk return<br> ratio",sell:"Bestsellers",fx1:"FX bestsellers ranking",stock1:"Stock bestsellers ranking",profitrate_all:"Xếp hạng tỉ suất lợi nhuận (3 tháng qua)",profit_all:"Xếp hạng doanh thu (3 tháng qua)",profitfactor_all:"Profit factor (last 3 months)",riskreturn_all:"Xếp hạng rủi ro lợi nhuận (3 tháng qua)",newproduct_all:"Sản phẩm EA mới (Tất cả)",sell_all:"Xếp hạng bán chạy (Tất cả)",profitrate_fx:"Xếp hạng tỉ suất lợi nhuận (3 tháng qua) - FX",profitrate_stock:"Xếp hạng tỉ suất lợi nhuận (3 tháng qua)- Stock",profit_fx:"Xếp hạng doanh thu (3 tháng qua) - FX",profit_stock:"Xếp hạng doanh thu (3 tháng qua) - Stock",profitfactor_fx:"Profit factor (Last 3 months) - FX",profitfactor_stock:"Profit factor (Last 3 months) - Stock",riskreturn_fx:"Xếp hạng rủi ro lợi nhuận (3 tháng qua) - FX",riskreturn_stock:"Xếp hạng rủi ro lợi nhuận (3 tháng qua) - Stock",newproduct_fx:"Sản phẩm FX EA mới",newproduct_stock:"Stock EA new arrivals",sell_fx:"Xếp hạng bán chạy  - FX",sell_stock:"Xếp hạng bán chạy - Stock",unemploy_fx:"Xếp hạng thu nhập tại thời điểm thông báo thất nghiệp",financial_fx:"Xếp hạng thu nhập khi chính sách tiền tệ của BOJ được công bố",developer:"Tìm kiếm nhà phát triển EA",pips:"Real Trade Ranking",realasset:"Real Trade Ranking (3 tháng) - Tất cả"}}},iKWF:function(t,e,r){"use strict";var n=r("gy1e"),i=r("lnnX"),a=!1;var o=function(t){a||r("bzF5")},s=r("VU/8")(n.a,i.a,!1,o,"data-v-1f3196ba",null);s.options.__file="mobile/components/systemtrade/IconHeader.vue",e.a=s.exports},jUZr:function(t,e,r){"use strict";var n=r("0XbJ"),i=r("VU/8")(null,n.a,!1,null,null,null);i.options.__file="components/icons/User2.vue",e.a=i.exports},lnnX:function(t,e,r){"use strict";var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("a",{attrs:{href:t.item.url}},[r("div",{staticClass:"flex center"},[r("div",{staticClass:"item flex mid center",style:{width:t.width+"vw",height:t.height+"vw","background-color":t.item.bgColor||"#f19149"}},[t._t("default")],2)]),r("h2",{staticClass:"flex center title fs-12 text-center mt-5 mb-0",domProps:{innerHTML:t._s(t.$t(t.item.type)||t.item.type)}})])};n._withStripped=!0;var i={render:n,staticRenderFns:[]};e.a=i},pTVa:function(t,e,r){"use strict";var n=r("mvHQ"),i=r.n(n),a=r("Gu7T"),o=r.n(a),s=r("u2KI"),l=r.n(s),c=r("Mc3q"),f=r.n(c),u={vi:"vi",ja:"ja",en:"en",th:"th",ch:"ja",tw:"ja"};e.a=l()({head:function(){var t=this,e=this.$i18n.locale,r=f.a[e]||f.a.ja,n=r.title,a=r.description,s=r.keywords,l=this.descriptionTemplate,c=this.keywordsTemplate,p=(this.meta||[]).concat([{name:"description",content:l?l.call(this):this.descriptionChunk?"『"+this.descriptionChunk+"』 "+a:a,hid:"description"},{name:"keywords",content:c?c.call(this):this.keywordsChunk?this.keywordsChunk+"："+s:s,hid:"keywords"}]),h=this.linkMeta||[],g=this.titleTemplate,d={lang:u[e]||"ja"},v=this.jsonLDTemplate;return{titleTemplate:function(e){return g?g.call(t,r):e?e+" - "+n:""+n},titleChunk:this.titleChunk||null,meta:p,link:h,htmlAttrs:d,script:[].concat(o()(this.script||[]),[v?{type:"application/ld+json",innerHTML:i()(v),charset:"utf-8"}:{}]),__dangerouslyDisableSanitizers:v?["script"]:void 0}}})},ppnI:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=r("gkc0"),i=r("HV4T"),a=!1;var o=function(t){a||r("Xs8I")},s=r("VU/8")(n.a,i.a,!1,o,"data-v-2c2075dd",null);s.options.__file="mobile/pages/systemtrade/index/developers/index.vue",e.default=s.exports},qMnM:function(t,e,r){(t.exports=r("FZ+f")(!1)).push([t.i,".paging-wrap ul[data-v-39b792f6]{padding:0 3%;list-style:none}.paging-wrap ul li[data-v-39b792f6]{display:inline-block;width:9.5vw;height:12vw;line-height:12vw;text-align:center;margin:0 1vw}.paging-wrap ul li a[data-v-39b792f6]{font-size:3.5vw;display:block;color:#434343;text-decoration:none}.paging-wrap ul li[data-v-39b792f6]:hover{background:transparent;-webkit-transition:all .3s;transition:all .3s}.theme1 ul li[data-v-39b792f6]{border:1px solid #434343;background:#fff}.theme1 ul li a[data-v-39b792f6]{color:#434343}.theme1 ul li a.active[data-v-39b792f6]{background:#434343;color:#fff}.icon-cls[data-v-39b792f6]{width:4vw;height:4vw;vertical-align:middle}",""])},r71N:function(t,e,r){"use strict";var n=function(){var t=this.$createElement,e=this._self._c||t;return e("i",{staticClass:"icon-cls"},[e("svg",{attrs:{viewBox:"0 0 96 96",xmlns:"http://www.w3.org/2000/svg",width:"36",height:"36"}},[e("path",{attrs:{fill:"currentColor",d:"M64.7 50.8L42.6 72.9c-1.5 1.5-4 1.5-5.5 0l-3.7-3.7c-1.5-1.5-1.5-4 0-5.5L49.1 48 33.3 32.3c-1.5-1.5-1.5-4 0-5.5l3.7-3.7c1.5-1.5 4-1.5 5.5 0l22.2 22.1c1.6 1.6 1.6 4 0 5.6z"}})])])};n._withStripped=!0;var i={render:n,staticRenderFns:[]};e.a=i},t39g:function(t,e,r){"use strict";e.a={props:{target:{type:[String,Object],default:"/"}},watch:{target:function(t){"string"==typeof t&&(this.href=t)}},data:function(){var t=this.target;return"string"==typeof t?{href:t}:{href:(t=this.$router.resolve(this.target)).href}}}},u0qp:function(t,e,r){"use strict";var n=r("grca"),i=r("VU/8")(null,n.a,!1,null,null,null);i.options.__file="components/icons/AngleDoubleRight.vue",e.a=i.exports},u2KI:function(t,e,r){t.exports={default:r("O4R0"),__esModule:!0}},uzeX:function(t,e,r){"use strict";var n=r("Sybr"),i=r("6Dpt"),a=!1;var o=function(t){a||r("MZxQ")},s=r("VU/8")(n.a,i.a,!1,o,"data-v-39b792f6",null);s.options.__file="mobile/components/paging/Paging.vue",e.a=s.exports}});
//# sourceMappingURL=index.22c56456bc054faaf515.js.map