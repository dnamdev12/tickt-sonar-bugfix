(this["webpackJsonptickt-web"]=this["webpackJsonptickt-web"]||[]).push([[53],{281:function(e,i,t){"use strict";var a=t(84),s=t(85),d=t(114),n=t(113),l=t(0),o=t(76),c=t(31),r=t(1),v=function(e){Object(d.a)(t,e);var i=Object(n.a)(t);function t(e){var s;return Object(a.a)(this,t),(s=i.call(this,e)).toggleMoreSpec=function(e){var i=s.state.isItemSpec;void 0===i[e]?i[e]=!0:i[e]=!i[e],s.setState({isItemSpec:i})},s.redirectPath=function(e){var i=s.props,t=i.jobId,a=(i.specializationId,i.history),d=i.hideInvite,n=i.location;console.log({item:e},"--\x3e");var l=null===e||void 0===e?void 0:e.tradieId;t&&l?a.push({pathname:"/tradie-info",search:"?jobId=".concat(t,"&tradeId=").concat(l,"&hideInvite=").concat(!!d),state:{url:null===n||void 0===n?void 0:n.pathname}}):a.push({pathname:"/tradie-info",search:"?tradeId=".concat(l,"&hideInvite=").concat(!!d),state:{url:null===n||void 0===n?void 0:n.pathname}})},s.state={isItemSpec:{}},s}return Object(s.a)(t,[{key:"render",value:function(){var e,i,t,a,s,d,n,l,c,v,u,j,b,m=this,h=this.props,p=h.item,O=(h.index,h.hideAos),x=h.showStatus;this.state.isItemSpec;return Object(r.jsx)("div",{className:"flex_col_sm_4",children:Object(r.jsxs)("div",{className:"tradie_card","data-aos":O?"":"fade-in","data-aos-delay":O?"":"250","data-aos-duration":O?"":"1000",children:[Object(r.jsxs)("div",{className:"f_spacebw tag_review",children:[Object(r.jsx)("span",{className:"form_label",children:(null===p||void 0===p||null===(e=p.tradeData)||void 0===e||null===(i=e[0])||void 0===i?void 0:i.tradeName)||(null===p||void 0===p||null===(t=p.tradie_details)||void 0===t||null===(a=t.trade)||void 0===a||null===(s=a[0])||void 0===s?void 0:s.trade_name)||(null===p||void 0===p||null===(d=p.trade)||void 0===d||null===(n=d[0])||void 0===n?void 0:n.trade_name)}),Object(r.jsxs)("span",{className:"rating",children:[(null===p||void 0===p?void 0:p.ratings)||(null===p||void 0===p||null===(l=p.rating)||void 0===l?void 0:l.toFixed(1))||(null===p||void 0===p||null===(c=p.tradie_details)||void 0===c||null===(v=c.rating)||void 0===v?void 0:v.toFixed(1))||"0"," | ",(null===p||void 0===p?void 0:p.reviews)||(null===p||void 0===p?void 0:p.review)||(null===p||void 0===p||null===(u=p.tradie_details)||void 0===u?void 0:u.review)||"0"," reviews "]})]}),Object(r.jsx)("span",{onClick:function(){m.redirectPath(p)},className:"more_detail new_top circle"}),Object(r.jsxs)("div",{className:"user_wrap",children:[Object(r.jsx)("figure",{className:"u_img",children:Object(r.jsx)("img",{src:(null===p||void 0===p?void 0:p.tradieImage)||(null===p||void 0===p||null===(j=p.tradie_details)||void 0===j?void 0:j.user_image)||(null===p||void 0===p?void 0:p.user_image)||o.a,alt:"traide-img"})}),Object(r.jsxs)("div",{className:"details",children:[Object(r.jsx)("span",{className:"name",children:(null===p||void 0===p?void 0:p.tradieName)||(null===p||void 0===p||null===(b=p.tradie_details)||void 0===b?void 0:b.firstName)||(null===p||void 0===p?void 0:p.firstName)}),Object(r.jsx)("span",{className:"job",children:null===p||void 0===p?void 0:p.businessName})]})]}),x&&(null===p||void 0===p?void 0:p.status)&&Object(r.jsx)("div",{className:"form_field",children:Object(r.jsx)("div",{className:"job_status",children:null===p||void 0===p?void 0:p.status})})]})})}}]),t}(l.Component);i.a=Object(c.i)(v)},567:function(e,i,t){"use strict";t.r(i);var a=t(84),s=t(85),d=t(114),n=t(113),l=t(0),o=t(31),c=t(37),r=t(281),v=t(1),u=function(e){Object(d.a)(t,e);var i=Object(n.a)(t);function t(){return Object(a.a)(this,t),i.apply(this,arguments)}return Object(s.a)(t,[{key:"render",value:function(){var e=this.props,i=e.jobDataWithJobTypeLatLong,t=i.recomended_tradespeople;i.saved_tradespeople;return Object(v.jsx)("div",{className:"app_wrapper",children:Object(v.jsx)("div",{className:"section_wrapper bg_gray",children:Object(v.jsxs)("div",{className:"custom_container",children:[Object(v.jsxs)("div",{className:"relate",children:[Object(v.jsx)("button",{className:"back",onClick:function(){e.history.push("/")}}),Object(v.jsx)("span",{className:"title",children:"Most viewed jobs"})]}),Object(v.jsx)("div",{className:"flex_row tradies_row",children:(null===t||void 0===t?void 0:t.length)?null===t||void 0===t?void 0:t.map((function(e,i){return Object(v.jsx)(r.a,{item:e,index:i})})):Object(v.jsx)("span",{children:"No data Found"})})]})})})}}]),t}(l.Component);i.default=Object(o.i)(Object(c.b)((function(e){return{jobDataWithJobTypeLatLong:e.homeSearch.jobDataWithJobTypeLatLong}}))(u))}}]);
//# sourceMappingURL=53.15f9f374.chunk.js.map