webpackJsonp([94],{"+MLA":function(t,e,n){var i=n("EqjI"),o=n("06OY").onFreeze;n("uqUo")("freeze",function(t){return function(e){return t&&i(e)?t(o(e)):e}})},"8DWv":function(t,e,n){"use strict";var i=n("Xxa5"),o=n.n(i),s=n("fZjL"),r=n.n(s),a=n("exGp"),c=n.n(a),u=n("woOf"),l=n.n(u),h=n("pTVa"),p=n("HMp1"),g=n.n(p),d=["service","display","affiliate","crowdsourcing","operation","privacy"],f=l()({validate:function(t){var e=t.params;return d.includes(e.type)},i18n:{messages:g.a},data:function(){return{}},asyncData:function(){var t=c()(o.a.mark(function t(e){var n,i,s=e.app,a=e.params,c=e.error;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=a.type,t.next=3,s.GoGoHTTP.get("/api/v3/terms/"+n);case 3:if((i=t.sent)&&r()(i).length){t.next=6;break}return t.abrupt("return",c({statusCode:404}));case 6:return t.abrupt("return",{data:i,type:n,titleChunk:g.a[s.i18n.locale||"ja"][n],linkMeta:[{rel:"canonical",href:"https://www.gogojungle.co.jp/terms/"+n}]});case 7:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),methods:{descriptionTemplate:function(){return this.$t("2",{type:this.$t(this.type)})}}},h.a);e.a=f},G6kn:function(t,e,n){(t.exports=n("FZ+f")(!1)).push([t.i,".term-content[data-v-380168a7]{font-size:15px}",""])},H3TE:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n("8DWv"),o=n("uoCn"),s=!1;var r=function(t){s||n("lqJp")},a=n("VU/8")(i.a,o.a,!1,r,"data-v-380168a7",null);a.options.__file="mobile/pages/terms/_type.vue",e.default=a.exports},HMp1:function(t,e){t.exports={ja:{1:"最終更新日",2:"GogoJungleサービスにおける{type}です。",service:"利用規約",display:"出品利用規約",affiliate:"アフィリエイト利用規約",crowdsourcing:"投資クラウドソーシング利用規約",operation:"お客様本位の業務運営に関する方針",privacy:"プライバシーポリシー"},en:{1:"Last updated",2:"The {type} for the GogoJungle service",service:"Terms and conditions",display:"Selling Terms and conditions",affiliate:"Affiliate Terms and conditions",crowdsourcing:"Investment Crowdsourcing Terms and conditions",operation:"Customer-oriented business management policy",privacy:"Privacy policy"},th:{1:"อัพเดทล่าสุด",2:"{type}  สำหรับบริการ GogoJungle",service:"ข้อกำหนดการใช้งาน",display:"ข้อกำหนดการขายสินค้า",affiliate:"ข้อกำหนดการใช้งานของ Affiliate",crowdsourcing:"ข้อกำหนดการใช้งานการลงทุน Crowdsourcing",operation:"นโยบายการจัดการธุรกิจที่มุ่งเน้นลูกค้า",privacy:"นโยบายความเป็นส่วนตัว"},ch:{1:"最近更新时间",2:"GogoJungle服务下的{type}。",service:"服务条款",display:"销售条款",affiliate:"联营会员使用条款",crowdsourcing:"投资众包条款",operation:"客户至上的业务管理政策",privacy:"隐私政策"},tw:{1:"最近更新時間",2:"GogoJungle服務下的{type}。",service:"服務條款",display:"銷售條款",affiliate:"聯營會員使用條款",crowdsourcing:"投資眾包條款",operation:"客戶至上的業務管理政策",privacy:"隱私政策"},vi:{1:"Ngày cập nhập mới nhất",2:"{type} cho dịch vj của GogoJungle.",service:"Điều khoản và Điều kiện",display:"Điều khoản bán hàng",affiliate:"Điều khoản làm affiliate",crowdsourcing:"Điều khoản sử dụng Crowdsourcing",operation:"Chính sách vận hành doanh nghiệp theo định hướng khách hàng",privacy:"Chính sách bảo mật"}}},Mc3q:function(t,e){t.exports={ja:{title:"自動売買・相場分析・投資戦略の販売プラットフォーム - GogoJungle",description:"fx-on.comはGogojungleにリニューアル致しました。「投資家の英知をすべて人に」を目標に、これから投資を始めようとする方からベテランの方まで自動売買やシステムトレード、fx学習など様々な視点から投資の情報を交換できるソーシャルネットECサービスです。",keywords:"インジケーター・ツール・電子書籍,システムトレード,自動売買,fx,トレード,シグナル,投資情報,fx学習,外国為替,投資",suffixDes:"の販売ページです。",shortTitle:"| GogoJungle"},en:{title:"GogoJungle | Auto Trading - Market Analysis - Investment Strategy",description:"Previously known as fx-on.com, GogoJungle is an E-Commerce and C2C market that allows users to exchange knowledge and products, such as Trade Systems, Expert Advisors (EAs), FX E-books, etc. between beginner and expert traders. Our purpose is to bring everyone together and help them achieve common goals.",keywords:"Indicators・Tools・E-books, System Traders, Automated Trading Systems, Fx, Trade, Signals, Market News, Fx Learning, Foreign Exchange, Investment",suffixDes:"s Sales Page",shortTitle:"| GogoJungle"},th:{title:"GogoJungle  | แพลตฟอร์มระบบซื้อขายอัตโนมัติ・การวิเคราะห์ตลาด・กลยุทธ์การลงทุน",description:'fx-on.com ได้เปลี่ยนชื่อใหม่เป็น Gogojungle มีเป้าหมาย "เป็นแหล่งความรู้สำหรับนักลงทุนทุกๆคน" โดยให้บริการเครือข่ายทางสังคม และ EC ที่ช่วยให้คุณสามารถแลกเปลี่ยนข้อมูลการลงทุนจากมุมมองต่างๆ เช่นการซื้อขายอัตโนมัติ ความรู้เกี่ยวกับ FX ฯลฯ เหมาะสำหรับนักลงทุนที่เพิ่งเริ่มต้น ไปจนถึงนักลงทุนที่มีประสบการณ์สูง',keywords:"อินดิเคเตอร์・เครื่องมือ・E-books,Trading systems,ระบบซื้อขายอัตโนมัติ,ฟอเร็กซ์,การเทรด,Signals,ข้อมูลการลงทุน,เรียนรู้ฟอเร็กซ์,แลกเปลี่ยนเงินตราต่างประเทศ,การลงทุน",suffixDes:"ของหน้าการขาย",shortTitle:"| GogoJungle"},ch:{title:"自动交易，市场分析和投资策略销售平台-GogoJungle",description:"fx-on.com 将改版为Gogojungle。以「投资者智慧为所有人享有」为目标，这是一个从今而后，从投资的初学者到达人都能够共享如自动买卖或交易系统、外汇学习等等各种视点的社交EC服务。",keywords:"指标·工具·电子书，系统交易，自动交易，外汇，交易，信號，投资信息，外汇学习，外汇，投资",suffixDes:"的销售页面。",shortTitle:"| GogoJungle"},tw:{title:"自動交易、市場分析和投資策略銷售平台-GogoJungle",description:"fx-on.com 將改版為Gogojungle。以「投資者智慧為所有人享有」為目標，這是一個從今而後，從投資的初學者到達人都能夠共享如自動買賣或交易系統、外匯學習等等各種視點的社交EC服務。",keywords:"指標·工具·電子書，系統交易，自動交易，外匯，交易，信號，投資情報，外匯學習，外匯，投資",suffixDes:"的銷售頁面。",shortTitle:"| GogoJungle"},vi:{title:"GogoJungle | Tự động giao dịch - Phân tích thị trường - Chiến lược đầu tư",description:'fx-on.com đã được đổi mới thành Gogojungle. Dịch vụ kết nối xã hội EC cho phép bạn trao đổi thông tin đầu tư thông qua nhiều phương thức đa dạng  như giao dịch tự động, hệ thống giao dịch, kiến thức fx, v.v. từ những người là nhà đầu tư mới bắt đầu đến những nhà đầu tư chuyên nghiệp với mục tiêu "Mang đến kiến thức đầu tư".',keywords:"Indicators・Công cụ・E-books,Hệ thống giao dịch,Hệ thống giao dịch tự động,fx,Trade,Tín hiệu,Thông tin đầu tư,Kiến thức Fx,Ngoại hối,Đầu tư",suffixDes:"- Trang bán hàng",shortTitle:"| GogoJungle"}}},O4R0:function(t,e,n){n("+MLA"),t.exports=n("FeBl").Object.freeze},lqJp:function(t,e,n){var i=n("G6kn");"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);n("rjj0")("a4520a18",i,!1,{sourceMap:!1})},pTVa:function(t,e,n){"use strict";var i=n("mvHQ"),o=n.n(i),s=n("Gu7T"),r=n.n(s),a=n("u2KI"),c=n.n(a),u=n("Mc3q"),l=n.n(u),h={vi:"vi",ja:"ja",en:"en",th:"th",ch:"ja",tw:"ja"};e.a=c()({head:function(){var t=this,e=this.$i18n.locale,n=l.a[e]||l.a.ja,i=n.title,s=n.description,a=n.keywords,c=this.descriptionTemplate,u=this.keywordsTemplate,p=(this.meta||[]).concat([{name:"description",content:c?c.call(this):this.descriptionChunk?"『"+this.descriptionChunk+"』 "+s:s,hid:"description"},{name:"keywords",content:u?u.call(this):this.keywordsChunk?this.keywordsChunk+"："+a:a,hid:"keywords"}]),g=this.linkMeta||[],d=this.titleTemplate,f={lang:h[e]||"ja"},v=this.jsonLDTemplate;return{titleTemplate:function(e){return d?d.call(t,n):e?e+" - "+i:""+i},titleChunk:this.titleChunk||null,meta:p,link:g,htmlAttrs:f,script:[].concat(r()(this.script||[]),[v?{type:"application/ld+json",innerHTML:o()(v),charset:"utf-8"}:{}]),__dangerouslyDisableSanitizers:v?["script"]:void 0}}})},u2KI:function(t,e,n){t.exports={default:n("O4R0"),__esModule:!0}},uoCn:function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"p-20 mb-30"},t._l(t.data,function(e){return n("div",{key:"term-FcvTy"+e.id},["privacy"==t.type?[n("div",[n("b",[t._v(" "+t._s(e.title)+" ")])]),n("br"),e.published_at?n("div",{staticClass:"mt-10"},[t._v("\n        "+t._s(t.$t(1))+": "+t._s(t.formatTime(e.published_at,8))+"\n      ")]):t._e()]:t._e(),n("div",{staticClass:"mt-10 term-content",domProps:{innerHTML:t._s(e.content)}})],2)}),0)};i._withStripped=!0;var o={render:i,staticRenderFns:[]};e.a=o}});
//# sourceMappingURL=_type.95ede0edb65eb93ae81d.js.map