webpackJsonp([65],{"+MLA":function(t,e,i){var n=i("EqjI"),o=i("06OY").onFreeze;i("uqUo")("freeze",function(t){return function(e){return t&&n(e)?t(o(e)):e}})},"/X/1":function(t,e,i){(t.exports=i("FZ+f")(!1)).push([t.i,".btn-loadmore[data-v-07441c95]{color:#333;padding:3vw 0}.btn-loadmore .icon-cls[data-v-07441c95]{width:15px;height:15px}.icn-load[data-v-07441c95]{padding:3vw 0}.btn-loadmore.border-bottom[data-v-07441c95],.icn-load.border-bottom[data-v-07441c95]{border-bottom:1px solid #dfdedc}",""])},"117d":function(t,e,i){"use strict";var n=function(){var t=this.$createElement;return(this._self._c||t)("div",{staticClass:"loader pos-rel"})};n._withStripped=!0;var o={render:n,staticRenderFns:[]};e.a=o},"4YjV":function(t,e,i){"use strict";var n=i("Geow"),o=i.n(n),a=i("ejvr"),r=i("IqrJ");e.a={i18n:{messages:o.a},components:{ClockO:a.a,Lzimg:r.a},props:{item:{type:Object,default:function(){return{}}}},methods:{handleFocus:function(){location.href="/crowdsourcing/"+this.item.id}}}},"4w/4":function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("Header"),i("div",{staticClass:"mb-10"},[i("a",{staticClass:"link wrap-text",attrs:{href:"/crowdsourcing/guide1"}},[t._v(t._s(t.$t(2)))]),i("a",{staticClass:"link wrap-text",attrs:{href:"/crowdsourcing/developers"}},[t._v(t._s(t.$t(3)))])]),i("div",{staticClass:"list-header mt-25 wrap-text"},[t._v(t._s(t.$t(4)))]),(t.crowdsourcings.data||[]).length?i("div",{staticClass:"list-ctn flex flex-wrap"},t._l(t.crowdsourcings.data,function(t){return i("CrowdItem",{key:"sKLuW"+t.id,attrs:{item:t}})}),1):i("div",{staticClass:"empty-box"},[t._v("\n    "+t._s(t.$t(6))+"\n  ")]),i("div",{staticClass:"list-header mt-25 wrap-text"},[t._v(t._s(t.$t(5)))]),(t.finishedCrowdsourcings.data||[]).length?i("div",{staticClass:"list-ctn flex flex-wrap"},t._l(t.finishedCrowdsourcings.data,function(t){return i("CrowdItem",{key:"sKLuW"+t.id,attrs:{item:t}})}),1):i("div",{staticClass:"empty-box"},[t._v("\n    "+t._s(t.$t(6))+"\n  ")]),t.isLoading?i("Loading"):i("div",{on:{click:t.loadMoreFinishJob}},[i("LoadMore",{staticClass:"mb-50"})],1)],1)};n._withStripped=!0;var o={render:n,staticRenderFns:[]};e.a=o},6427:function(t,e,i){(t.exports=i("FZ+f")(!1)).push([t.i,'@media (max-width:350px){.top-header[data-v-abe0209e]{background-size:auto 100%!important}.top-header .text-1[data-v-abe0209e]{white-space:pre-wrap}.top-header .txt-2[data-v-abe0209e]{font-size:21px!important;line-height:39px;margin-bottom:5px}}.top-header[data-v-abe0209e]{min-height:160px;background-image:url(/img/assets/mobile/crowdsourcing/UI_01.jpg);background-repeat:no-repeat;background-size:100% auto;background-position:center 0;padding-top:25px}.top-header .green-btn[data-v-abe0209e]{width:80%;margin:12px auto 0;text-align:center;height:40px;background:#00a300;color:#fff;line-height:40px;border-radius:5px;position:relative;display:block}.top-header .green-btn[data-v-abe0209e]:active{opacity:.8}.top-header .green-btn[data-v-abe0209e]:after{content:">";position:absolute;right:12px}.top-header .txt-ctn[data-v-abe0209e]{min-width:300px;color:#fff;text-align:center}.top-header .txt-1[data-v-abe0209e]{font-size:9px}.top-header .txt-2[data-v-abe0209e]{font-size:25px;font-weight:700}.top-header .txt-3[data-v-abe0209e]{font-size:13px;margin-top:-8px;font-weight:700}',""])},"9dgx":function(t,e,i){"use strict";var n=i("A9lU"),o=i("Dj3/"),a=!1;var r=function(t){a||i("dMD/")},s=i("VU/8")(n.a,o.a,!1,r,"data-v-abe0209e",null);s.options.__file="mobile/components/crowdsourcing/Header.vue",e.a=s.exports},A9lU:function(t,e,i){"use strict";var n=i("QUL9"),o=i.n(n);e.a={i18n:{messages:o.a}}},"DB+Z":function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"crowd-item pb-10",on:{click:t.handleFocus}},[i("div",{staticClass:"crowd-item-header wrap-text",class:["title-"+(t.item.templateId||0),{"grey-title":!Object.keys(t.item.user).length}]},[t._v("\n    "+t._s(t.$t("crowd-templates."+(t.item.templateId||0)))+"\n  ")]),i("div",{staticClass:"crowd-item-img text-center pl-10 pr-10 mt-5"},[i("Lzimg",{attrs:{"data-src":"/img/users/"+((t.item.user||{}).id||0)+"/small",alt:""}}),i("div",{staticClass:"wrap-text pt-5 fs-12",attrs:{title:(t.item.user||{}).name||t.$t("4")}},[t._v(t._s((t.item.user||{}).name||t.$t("4")))])],1),Object.keys(t.item.user).length?i("div",{staticClass:"pl-5 pr-5"},[i("div",{directives:[{name:"wrap-lines",rawName:"v-wrap-lines",value:2,expression:"2"}],staticClass:"crowd-item-title mb-5"},[Object.keys(t.item.user).length?i("b",[t._v(t._s(t.item.title))]):t._e()]),i("div",{staticClass:"flex info-row"},[i("div",{staticClass:"mr-5 row-icon"},[i("ClockO")],1),i("div",{staticClass:"row-content flex flex-wrap"},[i("div",[t._v(t._s(t.$t("1"))+":")]),i("div",[t._v(t._s(t.formatTime(t.item.createdAt,1)))])])]),i("div",{staticClass:"flex info-row"},[i("div",{staticClass:"mr-5 row-icon"},[i("ClockO")],1),i("div",{staticClass:"row-content flex flex-wrap"},[i("div",[t._v(t._s(t.$t("2"))+":")]),i("div",[t._v(t._s(t.formatTime(t.item.bidEndAt,1)))])])]),i("div",{staticClass:"flex info-row co-pink",staticStyle:{"font-weight":"bold"}},[t._m(0),i("div",{staticClass:"row-content flex flex-wrap"},[i("div",[t._v(t._s(t.$t("3"))+":")]),i("div",[t._v(t._s(t.formatNumber(t.item.reward,0)))])])])]):t._e()])};n._withStripped=!0;var o={render:n,staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"row-icon mr-5"},[e("div",{staticClass:"yen-icon"},[this._v("￥")])])}]};e.a=o},"Dj3/":function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("div",{staticClass:"top-header"},[i("div",{staticClass:"txt-ctn"},[i("div",{staticClass:"txt-1 wrap-text"},[t._v(t._s(t.$t(1)))]),i("div",{staticClass:"txt-2 wrap-text"},[t._v(t._s(t.$t(2)))]),i("div",{staticClass:"txt-3 wrap-text"},[t._v(t._s(t.$t(3)))])]),i("a",{staticClass:"green-btn",attrs:{href:t.$store.state.user.id?"/mypage/crowdsourcing/input":"/login?u=/mypage/crowdsourcing/input"}},[t._v(t._s(t.$t(4)))])])])};n._withStripped=!0;var o={render:n,staticRenderFns:[]};e.a=o},DmLl:function(t,e){t.exports={ja:{1:"製作依頼を出す（無料）",2:"投資クラウドソーシングサービスご利用ガイド",3:"開発者を見る",4:"現在募集中のお仕事",5:"完了したお仕事",6:"データがございません。",7:"EA・インジケーター・ツールなど「頼みたい」と「作ります」をつなげる、投資のクラウドソーシングサービスです。",8:"投資クラウドソーシング"},en:{1:"Submit a production request (free)",2:"Investment Crowdsourcing Service User Guide",3:"See developers",4:"Jobs currently being recruited",5:"Completed work",6:"There is no data.",7:"This is an investment crowdsourcing service that connects EA, Indicators, Tools, etc. “I want to ask” and “Make”.",8:"Investment crowdsourcing"},th:{1:"ส่งคำขอผลิต (ฟรี）",2:"คู่มือผู้ใช้บริการการลงทุน Crowdsourcing",3:"ดูนักพัฒนา",4:"กำลังรับสมัครงาน",5:"งานที่แล้วเสร็จ",6:"ไม่มีข้อมูล",7:"บริการการลงทุน crowdsourcing ที่เชื่อมต่อ「การร้องขอ」และ「การสร้าง」EA / Indicator / เครื่องมือ ฯลฯ",8:"ลงทุน crowdsourcing"},ch:{1:"提交制作请求（免费）",2:"投资众包服务用户指南",3:"查看开发人员",4:"目前正在招聘的职位",5:"完成的工作",6:"无数据",7:"这是一个投资众包服务，它涉及“我想问”和“我想做”，例如EA、指标和工具。",8:"投资众包"},tw:{1:"提交製作請求",2:"投資眾包服務用戶指南",3:"查看開發人員",4:"目前正在招聘的職位",5:"完成的工作",6:"無數據",7:"這是一個投資眾包服務，它涉及“我想問”和“我想做”，例如EA、指標和工具。",8:"投資眾包"},vi:{1:"Gửi yêu cầu công việc (miễn phí)",2:"Hướng dẫn sử dụng dịch vụ Crowdsourcing",3:"Xem danh sách nhà phát triển",4:"Công việc hiện đang tuyển dụng",5:"Công việc đã hoàn thành",6:"Không có dữ liệu.",7:"Đây là một dịch vụ cung cấp dịch vụ cộng đồng đầu tư kết nối EA, Indicator, Tool v.v..",8:"Crowdsourcing"}}},"G75/":function(t,e,i){(t.exports=i("FZ+f")(!1)).push([t.i,'.link[data-v-d58624c4]{padding:5px 40px 5px 10px;position:relative;border-bottom:1px solid #eaeaea;height:50px;line-height:40px;display:block;color:#707070}.link[data-v-d58624c4]:after{content:"\\203A";position:absolute;right:10px;top:5px}.list-ctn[data-v-d58624c4]{-webkit-box-shadow:0 0 0 1px #e0dedc;box-shadow:0 0 0 1px #e0dedc}.list-header[data-v-d58624c4]{height:40px;line-height:30px;padding:5px 10px;font-size:16px;font-weight:700;color:#434343;background-color:#f3f0ef;border:1px solid #e0dedc}.empty-box[data-v-d58624c4]{text-align:center;line-height:60px;border-bottom:1px solid #e0dedc;width:100%;color:red}',""])},Geow:function(t,e){t.exports={ja:{1:"公開日時",2:"応募期限",3:"予算","crowd-templates":{0:"未定",1:"エキスパートアドバイザー",2:"インジケーター製作",3:"ライティング",4:"デザイン製作",5:"web開発",6:"システム開発",7:"その他",8:"エキスパートアドバイザー(EA)製作"}},en:{1:"Published Date",2:"Application deadline",3:"Budget","crowd-templates":{0:"Not Specified",1:"Expert Advisor",2:"Indicator Production",3:"Lighting",4:"Design",5:"Web Development",6:"System Development",7:"Others",8:"Expert Advisor (EA) Creation"}},th:{1:"วันเปิดรับสมัคร",2:"วันปิดรับสมัคร",3:"งบประมาณ","crowd-templates":{0:"ไม่ระบุ",1:"Expert Advisor",2:"สร้าง Indicator",3:"Lighting",4:"ดีไซน์",5:"พัฒนาเว็บ",6:"พัฒนาระบบ",7:"อื่น ๆ",8:"สร้าง Expert Advisor (EA)"}},ch:{1:"公开日期",2:"申请截止日期",3:"预算","crowd-templates":{0:"未定",1:"专家顾问",2:"指标生成",3:"写入",4:"设计",5:"网页开发",6:"系统开发",7:"其他",8:"Expert Advisor(EA)生成"}},tw:{1:"公開日期",2:"申請截止日期",3:"預算","crowd-templates":{0:"未定",1:"專家顧問",2:"指標生成",3:"寫入",4:"設計",5:"網頁開發",6:"系統開發",7:"其他",8:"Expert Advisor(EA)生成"}},vi:{1:"Ngày công khai",2:"Thời hạn ứng tuyển",3:"Dự kiến ngân sách","crowd-templates":{0:"Không xác định",1:"Phát triển EA",2:"Phát triển indicator",3:"Viết nội dung",4:"Thiết kế",5:"Phát triển website",6:"Phát triển hệ thống",7:"Khác",8:"Chế tác Expert Advisor (EA)"}}}},Ilkp:function(t,e,i){"use strict";var n=i("t2L6"),o=i("nsVH"),a=!1;var r=function(t){a||i("kk85")},s=i("VU/8")(n.a,o.a,!1,r,"data-v-07441c95",null);s.options.__file="mobile/components/common/LoadMore.vue",e.a=s.exports},IqrJ:function(t,e,i){"use strict";var n=i("XiwO"),o=i("u3LT"),a=!1;var r=function(t){a||i("ph+F")},s=i("VU/8")(n.a,o.a,!1,r,"data-v-f4a03eac",null);s.options.__file="components/Lzimg.vue",e.a=s.exports},Mc3q:function(t,e){t.exports={ja:{title:"自動売買・相場分析・投資戦略の販売プラットフォーム - GogoJungle",description:"fx-on.comはGogojungleにリニューアル致しました。「投資家の英知をすべて人に」を目標に、これから投資を始めようとする方からベテランの方まで自動売買やシステムトレード、fx学習など様々な視点から投資の情報を交換できるソーシャルネットECサービスです。",keywords:"インジケーター・ツール・電子書籍,システムトレード,自動売買,fx,トレード,シグナル,投資情報,fx学習,外国為替,投資",suffixDes:"の販売ページです。",shortTitle:"| GogoJungle"},en:{title:"GogoJungle | Auto Trading - Market Analysis - Investment Strategy",description:"Previously known as fx-on.com, GogoJungle is an E-Commerce and C2C market that allows users to exchange knowledge and products, such as Trade Systems, Expert Advisors (EAs), FX E-books, etc. between beginner and expert traders. Our purpose is to bring everyone together and help them achieve common goals.",keywords:"Indicators・Tools・E-books, System Traders, Automated Trading Systems, Fx, Trade, Signals, Market News, Fx Learning, Foreign Exchange, Investment",suffixDes:"s Sales Page",shortTitle:"| GogoJungle"},th:{title:"GogoJungle  | แพลตฟอร์มระบบซื้อขายอัตโนมัติ・การวิเคราะห์ตลาด・กลยุทธ์การลงทุน",description:'fx-on.com ได้เปลี่ยนชื่อใหม่เป็น Gogojungle มีเป้าหมาย "เป็นแหล่งความรู้สำหรับนักลงทุนทุกๆคน" โดยให้บริการเครือข่ายทางสังคม และ EC ที่ช่วยให้คุณสามารถแลกเปลี่ยนข้อมูลการลงทุนจากมุมมองต่างๆ เช่นการซื้อขายอัตโนมัติ ความรู้เกี่ยวกับ FX ฯลฯ เหมาะสำหรับนักลงทุนที่เพิ่งเริ่มต้น ไปจนถึงนักลงทุนที่มีประสบการณ์สูง',keywords:"อินดิเคเตอร์・เครื่องมือ・E-books,Trading systems,ระบบซื้อขายอัตโนมัติ,ฟอเร็กซ์,การเทรด,Signals,ข้อมูลการลงทุน,เรียนรู้ฟอเร็กซ์,แลกเปลี่ยนเงินตราต่างประเทศ,การลงทุน",suffixDes:"ของหน้าการขาย",shortTitle:"| GogoJungle"},ch:{title:"自动交易，市场分析和投资策略销售平台-GogoJungle",description:"fx-on.com 将改版为Gogojungle。以「投资者智慧为所有人享有」为目标，这是一个从今而后，从投资的初学者到达人都能够共享如自动买卖或交易系统、外汇学习等等各种视点的社交EC服务。",keywords:"指标·工具·电子书，系统交易，自动交易，外汇，交易，信號，投资信息，外汇学习，外汇，投资",suffixDes:"的销售页面。",shortTitle:"| GogoJungle"},tw:{title:"自動交易、市場分析和投資策略銷售平台-GogoJungle",description:"fx-on.com 將改版為Gogojungle。以「投資者智慧為所有人享有」為目標，這是一個從今而後，從投資的初學者到達人都能夠共享如自動買賣或交易系統、外匯學習等等各種視點的社交EC服務。",keywords:"指標·工具·電子書，系統交易，自動交易，外匯，交易，信號，投資情報，外匯學習，外匯，投資",suffixDes:"的銷售頁面。",shortTitle:"| GogoJungle"},vi:{title:"GogoJungle | Tự động giao dịch - Phân tích thị trường - Chiến lược đầu tư",description:'fx-on.com đã được đổi mới thành Gogojungle. Dịch vụ kết nối xã hội EC cho phép bạn trao đổi thông tin đầu tư thông qua nhiều phương thức đa dạng  như giao dịch tự động, hệ thống giao dịch, kiến thức fx, v.v. từ những người là nhà đầu tư mới bắt đầu đến những nhà đầu tư chuyên nghiệp với mục tiêu "Mang đến kiến thức đầu tư".',keywords:"Indicators・Công cụ・E-books,Hệ thống giao dịch,Hệ thống giao dịch tự động,fx,Trade,Tín hiệu,Thông tin đầu tư,Kiến thức Fx,Ngoại hối,Đầu tư",suffixDes:"- Trang bán hàng",shortTitle:"| GogoJungle"}}},NwWA:function(t,e,i){"use strict";var n=i("Xxa5"),o=i.n(n),a=i("//Fk"),r=i.n(a),s=i("d7EF"),c=i.n(s),d=i("exGp"),l=i.n(d),u=i("woOf"),p=i.n(u),h=i("DmLl"),g=i.n(h),v=i("pTVa"),m=i("S90z"),f=i("9dgx"),w=i("XCtU"),x=i("Ilkp"),b=p()({i18n:{messages:g.a},components:{CrowdItem:m.a,Header:f.a,Loading:w.a,LoadMore:x.a},data:function(){return{titleChunk:this.$t(8),keywordsChunk:this.$t(8),descriptionChunk:this.$t(8),isLoading:!1}},asyncData:function(){var t=l()(o.a.mark(function t(e){var i,n,a,s,d,l=e.app;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,r.a.all([l.GoGoHTTP.get("/api/v3/surface/crowdsourcing",{params:{page:1}}),l.GoGoHTTP.get("/api/v3/surface/crowdsourcing",{params:{page:1,isFinish:1,limit:12}}),l.GoGoHTTP.get("/api/v3/surface/crowdsourcing/user")]);case 2:return i=t.sent,n=c()(i,3),a=n[0],s=n[1],d=n[2],t.abrupt("return",{crowdsourcings:a,finishedCrowdsourcings:s,isCrowdsourcing:d,page:1,linkMeta:[{rel:"canonical",href:"https://www.gogo.gogojungle.net/crowdsourcing"}]});case 8:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),methods:{descriptionTemplate:function(){return this.$t(7)},loadMoreFinishJob:function(){var t=this;this.isLoading=!0,this.GoGoHTTP.get("/api/v3/surface/crowdsourcing",{params:{page:++this.page,isFinish:1,limit:12}}).then(function(e){t.finishedCrowdsourcings.data=(t.finishedCrowdsourcings.data||[]).concat(e.data||[]),t.isLoading=!1})}}},v.a);e.a=b},O4R0:function(t,e,i){i("+MLA"),t.exports=i("FeBl").Object.freeze},Q1hy:function(t,e,i){"use strict";var n=function(){var t=this.$createElement,e=this._self._c||t;return e("i",{staticClass:"icon-cls"},[e("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512"}},[e("path",{attrs:{fill:"currentColor",d:"M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"}})])])};n._withStripped=!0;var o={render:n,staticRenderFns:[]};e.a=o},QUL9:function(t,e){t.exports={ja:{1:"EA・インジケーター・ツールなど「頼みたい」と「作ります」をつなげる",2:"投資のクラウドソーシング",3:"Investment of Crowdsourcing",4:"製作依頼を出す（無料）"},en:{1:"Connect「Requesting」 and 「Production」of  EA, Indicators, Tools etc.",2:"Crowdsourcing Investment",3:"Investment of Crowdsourcing",4:"Submit a request (free)"},th:{1:"เชื่อมต่อ 「คำร้องขอ」และ「การผลิต」ของ EA , Indicators , Tools",2:"Crowdsourcing การลงทุน",3:"Investment of Crowdsourcing",4:"ส่งคำขอผลิต (ฟรี)"},ch:{1:"将“我要委托”EA·指标·工具等和“我要制作”相连",2:"投资众包",3:"Investment of Crowdsourcing",4:"提交制作请求（免费）"},tw:{1:"將“我要委託”EA·指標·工具等和“我要製作”相連",2:"投資眾包",3:"Investment of Crowdsourcing",4:"提交製作請求（免費）"},vi:{1:"Kết nối cộng đồng làm EA, Indicator, Tool...",2:"Crowdsourcing Investment",3:"Investment of Crowdsourcing",4:"Đăng việc mới (Miễn phí)"}}},S90z:function(t,e,i){"use strict";var n=i("4YjV"),o=i("DB+Z"),a=!1;var r=function(t){a||i("jDh0")},s=i("VU/8")(n.a,o.a,!1,r,"data-v-7806d76c",null);s.options.__file="mobile/components/crowdsourcing/CrowdItem.vue",e.a=s.exports},XCtU:function(t,e,i){"use strict";var n=i("117d"),o=!1;var a=function(t){o||i("yuSi")},r=i("VU/8")(null,n.a,!1,a,"data-v-5ec8627c",null);r.options.__file="components/icons/Loading.vue",e.a=r.exports},Xcpd:function(t,e,i){(t.exports=i("FZ+f")(!1)).push([t.i,'.loader[data-v-5ec8627c]{height:200px}.loader.sm[data-v-5ec8627c]:before{border-radius:50%;width:20px;height:20px;position:absolute;left:calc(50% - 10px);top:calc(50% - 10px)}.loader[data-v-5ec8627c]:before{content:"";-webkit-animation:spin-data-v-5ec8627c 1s linear infinite;animation:spin-data-v-5ec8627c 1s linear infinite;border-radius:50%;border:3px solid #f3f3f3;border-top:3px solid #555;width:50px;height:50px;position:absolute;left:calc(50% - 25px);top:calc(50% - 25px)}@-webkit-keyframes spin-data-v-5ec8627c{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes spin-data-v-5ec8627c{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}',""])},XiwO:function(t,e,i){"use strict";e.a={props:{alt:{type:String,default:""}},mounted:function(){var t=this;if(void 0!=this.$el.dataset.src)if("IntersectionObserver"in window){var e=new IntersectionObserver(function(i){var n=i[0];n.isIntersecting&&(n.target.src=n.target.dataset.src,n.target.classList.remove("lazy"),e.unobserve(t.$el))},{root:null,rootMargin:"50px",threshold:0});e.observe(this.$el)}else this.$el.src=this.$el.dataset.src,this.$el.classList.remove("lazy")}}},"dMD/":function(t,e,i){var n=i("6427");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);i("rjj0")("73245464",n,!1,{sourceMap:!1})},ejvr:function(t,e,i){"use strict";var n=i("Q1hy"),o=i("VU/8")(null,n.a,!1,null,null,null);o.options.__file="components/icons/ClockO.vue",e.a=o.exports},gDx9:function(t,e){t.exports={ja:{1:"もっと見る"},en:{1:"View more"},th:{1:"ดูเพิ่มเติม"},ch:{1:"知道更多"},tw:{1:"知道更多"},vi:{1:"Xem thêm"}}},iPH9:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i("NwWA"),o=i("4w/4"),a=!1;var r=function(t){a||i("ufig")},s=i("VU/8")(n.a,o.a,!1,r,"data-v-d58624c4",null);s.options.__file="mobile/pages/crowdsourcing/index.vue",e.default=s.exports},jDh0:function(t,e,i){var n=i("nyjv");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);i("rjj0")("501148bd",n,!1,{sourceMap:!1})},kk85:function(t,e,i){var n=i("/X/1");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);i("rjj0")("3c3332f6",n,!1,{sourceMap:!1})},nsVH:function(t,e,i){"use strict";var n=function(){var t=this.$createElement,e=this._self._c||t;return this.isLoading?e("div",{staticClass:"icn-load flex mid center w-full"},[e("loading",{staticStyle:{width:"8vw",height:"8vw"}})],1):e("div",{staticClass:"btn-loadmore flex mid center w-full"},[this._v("\n  "+this._s(this.text||this.$t("1"))+"\n  "),e("AngleDown",{staticClass:"ml-5"})],1)};n._withStripped=!0;var o={render:n,staticRenderFns:[]};e.a=o},nyjv:function(t,e,i){(t.exports=i("FZ+f")(!1)).push([t.i,".crowd-item[data-v-7806d76c]{background:#fff;margin-bottom:1px;-webkit-box-shadow:0 0 0 .5px #e0dedc;box-shadow:0 0 0 .5px #e0dedc;margin-top:1px;margin-right:1px}.crowd-item .crowd-item-header[data-v-7806d76c]{color:#fff;font-size:19.2px;font-size:1.2rem;height:30px;line-height:30px;text-align:center;padding:0 5px}.crowd-item[data-v-7806d76c]:active{opacity:.8}.crowd-item .title-0[data-v-7806d76c]{background-color:#7dcbf0}.crowd-item .title-1[data-v-7806d76c]{background-color:#9c3}.crowd-item .title-2[data-v-7806d76c]{background-color:#f8b650}.crowd-item .title-3[data-v-7806d76c]{background-color:#f19149}.crowd-item .title-4[data-v-7806d76c]{background-color:#ccbd39}.crowd-item .title-5[data-v-7806d76c]{background-color:#996c33}.crowd-item .title-6[data-v-7806d76c]{background-color:#f29c9f}.crowd-item .title-7[data-v-7806d76c]{background-color:#748fc7}.crowd-item .grey-title[data-v-7806d76c]{background-color:grey}.crowd-item .crowd-item-img[data-v-7806d76c]{height:80px}.crowd-item .crowd-item-img img[data-v-7806d76c]{margin:auto;height:57px}.crowd-item .crowd-item-title[data-v-7806d76c]{height:38px;overflow:hidden;color:#2d2d2d;text-align:center}.crowd-item .row-icon[data-v-7806d76c]{padding-top:2px}.crowd-item .row-content[data-v-7806d76c]{word-break:break-word}.crowd-item .yen-icon[data-v-7806d76c]{border-radius:50%;background:#dc1c39;color:#fff;font-size:10px;text-align:center;margin-top:1px;line-height:16px}.crowd-item .icon-cls[data-v-7806d76c],.crowd-item .yen-icon[data-v-7806d76c]{-webkit-box-flex:0;-ms-flex:0 0 14px;flex:0 0 14px;width:14px;height:14px}.crowd-item .co-pink[data-v-7806d76c]{color:#e5455d}.crowd-item .info-row[data-v-7806d76c]{min-height:20px}@media only screen and (max-width:321px){.crowd-item[data-v-7806d76c]{width:calc(50% - 1px)}.crowd-item .info-row[data-v-7806d76c]{min-height:20px;font-size:15px}.crowd-item[data-v-7806d76c]:nth-child(odd){width:50%;margin-right:0}}@media only screen and (min-width:321px) and (max-width:700px){.crowd-item[data-v-7806d76c]{width:calc(33.33333% - 1px)}.crowd-item[data-v-7806d76c]:nth-child(3n){width:33.33333%;margin-right:0}}@media only screen and (min-width:701px){.crowd-item[data-v-7806d76c]{width:calc(25% - 1px)}.crowd-item[data-v-7806d76c]:nth-child(4n){width:25%;margin-right:0}}",""])},oMAO:function(t,e,i){"use strict";var n=i("sVX0"),o=i("VU/8")(null,n.a,!1,null,null,null);o.options.__file="components/icons/AngleDown.vue",e.a=o.exports},pTVa:function(t,e,i){"use strict";var n=i("mvHQ"),o=i.n(n),a=i("Gu7T"),r=i.n(a),s=i("u2KI"),c=i.n(s),d=i("Mc3q"),l=i.n(d),u={vi:"vi",ja:"ja",en:"en",th:"th",ch:"ja",tw:"ja"};e.a=c()({head:function(){var t=this,e=this.$i18n.locale,i=l.a[e]||l.a.ja,n=i.title,a=i.description,s=i.keywords,c=this.descriptionTemplate,d=this.keywordsTemplate,p=(this.meta||[]).concat([{name:"description",content:c?c.call(this):this.descriptionChunk?"『"+this.descriptionChunk+"』 "+a:a,hid:"description"},{name:"keywords",content:d?d.call(this):this.keywordsChunk?this.keywordsChunk+"："+s:s,hid:"keywords"}]),h=this.linkMeta||[],g=this.titleTemplate,v={lang:u[e]||"ja"},m=this.jsonLDTemplate;return{titleTemplate:function(e){return g?g.call(t,i):e?e+" - "+n:""+n},titleChunk:this.titleChunk||null,meta:p,link:h,htmlAttrs:v,script:[].concat(r()(this.script||[]),[m?{type:"application/ld+json",innerHTML:o()(m),charset:"utf-8"}:{}]),__dangerouslyDisableSanitizers:m?["script"]:void 0}}})},"ph+F":function(t,e,i){var n=i("yKbQ");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);i("rjj0")("4fd059a9",n,!1,{sourceMap:!1})},sVX0:function(t,e,i){"use strict";var n=function(){var t=this.$createElement,e=this._self._c||t;return e("i",{staticClass:"icon-cls"},[e("svg",{attrs:{viewBox:"0 0 96 96",xmlns:"http://www.w3.org/2000/svg"}},[e("path",{attrs:{fill:"currentColor",d:"M44.2 69L13.6 39.4c-2.1-2-2.1-5.4 0-7.4l5.1-4.9c2.1-2 5.5-2 7.6 0L48 48l21.7-21c2.1-2 5.5-2 7.6 0l5.1 5c2.1 2 2.1 5.4 0 7.4L51.8 69c-2.1 2-5.5 2-7.6 0z"}})])])};n._withStripped=!0;var o={render:n,staticRenderFns:[]};e.a=o},t2L6:function(t,e,i){"use strict";var n=i("oMAO"),o=i("gDx9"),a=i.n(o),r=i("XCtU");e.a={i18n:{messages:a.a},components:{AngleDown:n.a,Loading:r.a},props:{text:{type:String,default:""},isLoading:{type:Boolean,default:!1}}}},u2KI:function(t,e,i){t.exports={default:i("O4R0"),__esModule:!0}},u3LT:function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement;return(t._self._c||e)("img",{staticClass:"lazy",staticStyle:{display:"inline-block"},attrs:{alt:t.alt},on:{click:function(e){return t.$emit("click")}}})};n._withStripped=!0;var o={render:n,staticRenderFns:[]};e.a=o},ufig:function(t,e,i){var n=i("G75/");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);i("rjj0")("87ce9394",n,!1,{sourceMap:!1})},yKbQ:function(t,e,i){(t.exports=i("FZ+f")(!1)).push([t.i,"img[data-v-f4a03eac]{border:none}.lazy[data-v-f4a03eac]{visibility:hidden}",""])},yuSi:function(t,e,i){var n=i("Xcpd");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);i("rjj0")("f078453c",n,!1,{sourceMap:!1})}});
//# sourceMappingURL=index.98eb75eee7fba419c664.js.map