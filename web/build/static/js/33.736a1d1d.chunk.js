(this["webpackJsonptickt-web"]=this["webpackJsonptickt-web"]||[]).push([[33],{227:function(e,t,o){"use strict";var n=o(0),r=o.n(n),s=function(e,t){return s=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)t.hasOwnProperty(o)&&(e[o]=t[o])},s(e,t)};var i=function(){return i=Object.assign||function(e){for(var t,o=1,n=arguments.length;o<n;o++)for(var r in t=arguments[o])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e},i.apply(this,arguments)};var l="Pixel",a="Percent",c={unit:a,value:.8};function u(e){return"number"===typeof e?{unit:a,value:100*e}:"string"===typeof e?e.match(/^(\d*(\.\d+)?)px$/)?{unit:l,value:parseFloat(e)}:e.match(/^(\d*(\.\d+)?)%$/)?{unit:a,value:parseFloat(e)}:(console.warn('scrollThreshold format is invalid. Valid formats: "120px", "50%"...'),c):(console.warn("scrollThreshold should be string or number"),c)}var d=function(e){function t(t){var o=e.call(this,t)||this;return o.lastScrollTop=0,o.actionTriggered=!1,o.startY=0,o.currentY=0,o.dragging=!1,o.maxPullDownDistance=0,o.getScrollableTarget=function(){return o.props.scrollableTarget instanceof HTMLElement?o.props.scrollableTarget:"string"===typeof o.props.scrollableTarget?document.getElementById(o.props.scrollableTarget):(null===o.props.scrollableTarget&&console.warn("You are trying to pass scrollableTarget but it is null. This might\n        happen because the element may not have been added to DOM yet.\n        See https://github.com/ankeetmaini/react-infinite-scroll-component/issues/59 for more info.\n      "),null)},o.onStart=function(e){o.lastScrollTop||(o.dragging=!0,e instanceof MouseEvent?o.startY=e.pageY:e instanceof TouchEvent&&(o.startY=e.touches[0].pageY),o.currentY=o.startY,o._infScroll&&(o._infScroll.style.willChange="transform",o._infScroll.style.transition="transform 0.2s cubic-bezier(0,0,0.31,1)"))},o.onMove=function(e){o.dragging&&(e instanceof MouseEvent?o.currentY=e.pageY:e instanceof TouchEvent&&(o.currentY=e.touches[0].pageY),o.currentY<o.startY||(o.currentY-o.startY>=Number(o.props.pullDownToRefreshThreshold)&&o.setState({pullToRefreshThresholdBreached:!0}),o.currentY-o.startY>1.5*o.maxPullDownDistance||o._infScroll&&(o._infScroll.style.overflow="visible",o._infScroll.style.transform="translate3d(0px, "+(o.currentY-o.startY)+"px, 0px)")))},o.onEnd=function(){o.startY=0,o.currentY=0,o.dragging=!1,o.state.pullToRefreshThresholdBreached&&(o.props.refreshFunction&&o.props.refreshFunction(),o.setState({pullToRefreshThresholdBreached:!1})),requestAnimationFrame((function(){o._infScroll&&(o._infScroll.style.overflow="auto",o._infScroll.style.transform="none",o._infScroll.style.willChange="unset")}))},o.onScrollListener=function(e){"function"===typeof o.props.onScroll&&setTimeout((function(){return o.props.onScroll&&o.props.onScroll(e)}),0);var t=o.props.height||o._scrollableNode?e.target:document.documentElement.scrollTop?document.documentElement:document.body;o.actionTriggered||((o.props.inverse?o.isElementAtTop(t,o.props.scrollThreshold):o.isElementAtBottom(t,o.props.scrollThreshold))&&o.props.hasMore&&(o.actionTriggered=!0,o.setState({showLoader:!0}),o.props.next&&o.props.next()),o.lastScrollTop=t.scrollTop)},o.state={showLoader:!1,pullToRefreshThresholdBreached:!1,prevDataLength:t.dataLength},o.throttledOnScrollListener=function(e,t,o,n){var r,s=!1,i=0;function l(){r&&clearTimeout(r)}function a(){var a=this,c=Date.now()-i,u=arguments;function d(){i=Date.now(),o.apply(a,u)}function h(){r=void 0}s||(n&&!r&&d(),l(),void 0===n&&c>e?d():!0!==t&&(r=setTimeout(n?h:d,void 0===n?e-c:e)))}return"boolean"!==typeof t&&(n=o,o=t,t=void 0),a.cancel=function(){l(),s=!0},a}(150,o.onScrollListener).bind(o),o.onStart=o.onStart.bind(o),o.onMove=o.onMove.bind(o),o.onEnd=o.onEnd.bind(o),o}return function(e,t){function o(){this.constructor=e}s(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)}(t,e),t.prototype.componentDidMount=function(){if("undefined"===typeof this.props.dataLength)throw new Error('mandatory prop "dataLength" is missing. The prop is needed when loading more content. Check README.md for usage');if(this._scrollableNode=this.getScrollableTarget(),this.el=this.props.height?this._infScroll:this._scrollableNode||window,this.el&&this.el.addEventListener("scroll",this.throttledOnScrollListener),"number"===typeof this.props.initialScrollY&&this.el&&this.el instanceof HTMLElement&&this.el.scrollHeight>this.props.initialScrollY&&this.el.scrollTo(0,this.props.initialScrollY),this.props.pullDownToRefresh&&this.el&&(this.el.addEventListener("touchstart",this.onStart),this.el.addEventListener("touchmove",this.onMove),this.el.addEventListener("touchend",this.onEnd),this.el.addEventListener("mousedown",this.onStart),this.el.addEventListener("mousemove",this.onMove),this.el.addEventListener("mouseup",this.onEnd),this.maxPullDownDistance=this._pullDown&&this._pullDown.firstChild&&this._pullDown.firstChild.getBoundingClientRect().height||0,this.forceUpdate(),"function"!==typeof this.props.refreshFunction))throw new Error('Mandatory prop "refreshFunction" missing.\n          Pull Down To Refresh functionality will not work\n          as expected. Check README.md for usage\'')},t.prototype.componentWillUnmount=function(){this.el&&(this.el.removeEventListener("scroll",this.throttledOnScrollListener),this.props.pullDownToRefresh&&(this.el.removeEventListener("touchstart",this.onStart),this.el.removeEventListener("touchmove",this.onMove),this.el.removeEventListener("touchend",this.onEnd),this.el.removeEventListener("mousedown",this.onStart),this.el.removeEventListener("mousemove",this.onMove),this.el.removeEventListener("mouseup",this.onEnd)))},t.prototype.componentDidUpdate=function(e){this.props.dataLength!==e.dataLength&&(this.actionTriggered=!1,this.setState({showLoader:!1}))},t.getDerivedStateFromProps=function(e,t){return e.dataLength!==t.prevDataLength?i(i({},t),{prevDataLength:e.dataLength}):null},t.prototype.isElementAtTop=function(e,t){void 0===t&&(t=.8);var o=e===document.body||e===document.documentElement?window.screen.availHeight:e.clientHeight,n=u(t);return n.unit===l?e.scrollTop<=n.value+o-e.scrollHeight+1:e.scrollTop<=n.value/100+o-e.scrollHeight+1},t.prototype.isElementAtBottom=function(e,t){void 0===t&&(t=.8);var o=e===document.body||e===document.documentElement?window.screen.availHeight:e.clientHeight,n=u(t);return n.unit===l?e.scrollTop+o>=e.scrollHeight-n.value:e.scrollTop+o>=n.value/100*e.scrollHeight},t.prototype.render=function(){var e=this,t=i({height:this.props.height||"auto",overflow:"auto",WebkitOverflowScrolling:"touch"},this.props.style),o=this.props.hasChildren||!!(this.props.children&&this.props.children instanceof Array&&this.props.children.length),n=this.props.pullDownToRefresh&&this.props.height?{overflow:"auto"}:{};return r.a.createElement("div",{style:n,className:"infinite-scroll-component__outerdiv"},r.a.createElement("div",{className:"infinite-scroll-component "+(this.props.className||""),ref:function(t){return e._infScroll=t},style:t},this.props.pullDownToRefresh&&r.a.createElement("div",{style:{position:"relative"},ref:function(t){return e._pullDown=t}},r.a.createElement("div",{style:{position:"absolute",left:0,right:0,top:-1*this.maxPullDownDistance}},this.state.pullToRefreshThresholdBreached?this.props.releaseToRefreshContent:this.props.pullDownToRefreshContent)),this.props.children,!this.state.showLoader&&!o&&this.props.hasMore&&this.props.loader,this.state.showLoader&&this.props.hasMore&&this.props.loader,!this.props.hasMore&&this.props.endMessage))},t}(n.Component);t.a=d},238:function(e,t,o){"use strict";var n=o(76),r=o(20),s=o(1);t.a=function(e){var t=e.item;return Object(s.jsx)("div",{className:"flex_col_sm_6",children:Object(s.jsxs)("div",{className:"tradie_card","data-aos":"fade-in","data-aos-delay":"250","data-aos-duration":"1000",children:[Object(s.jsx)("a",{href:"javascript:void(0)",className:"more_detail circle",onClick:function(){return function(t){if(1===r.a.getItem("userType")){var o="/job-details-page?jobId=".concat(t.jobId);(null===t||void 0===t?void 0:t.tradeId)&&(o+="&tradeId=".concat(t.tradeId)),(null===t||void 0===t?void 0:t.specializationId)&&(o+="&specializationId=".concat(t.specializationId)),(null===t||void 0===t?void 0:t.jobStatus)&&(o+="&jobStatus=".concat(t.jobStatus)),console.log({item:t,string_redirect:o}),e.history.push(o)}else{var n="";(null===t||void 0===t?void 0:t.jobStatus)&&(n=(null===t||void 0===t?void 0:t.jobStatus).toLowerCase());var s="?jobId=".concat(null===t||void 0===t?void 0:t.jobId,"&status=").concat(n,"&edit=true");["expired","completed"].includes(n)&&(s+="&job=past"),console.log({string_item:s,status:n,jobStatus:null===t||void 0===t?void 0:t.jobStatus});var i=s;e.history.push("/job-detail?".concat(i))}}(t)}}),Object(s.jsxs)("div",{className:"user_wrap",children:[Object(s.jsx)("figure",{className:"u_img ".concat(2===e.userType?"icon":""),children:Object(s.jsx)("img",{src:2===e.userType?t.tradeSelectedUrl:t.builderImage||n.a,alt:"",onError:function(e){var t,o;(null===e||void 0===e||null===(t=e.target)||void 0===t?void 0:t.onerror)&&(e.target.onerror=null),(null===e||void 0===e||null===(o=e.target)||void 0===o?void 0:o.src)&&(e.target.src=n.a)}})}),Object(s.jsxs)("div",{className:"details",children:[Object(s.jsx)("span",{className:"name",children:2===e.userType?t.tradeName:t.jobName}),Object(s.jsx)("span",{className:"prof",children:2===e.userType?t.jobName:t.builderName})]})]}),Object(s.jsx)("div",{className:"job_info",children:Object(s.jsxs)("ul",{children:[Object(s.jsx)("li",{className:"icon clock",children:t.time}),Object(s.jsx)("li",{className:"icon dollar",children:t.amount}),Object(s.jsx)("li",{className:"icon location line-1",children:t.locationName}),Object(s.jsx)("li",{className:"icon calendar",children:t.durations})]})}),Object(s.jsx)("p",{className:"commn_para line-3",children:t.jobDescription}),Object(s.jsxs)("ul",{className:"count_wrap",children:[Object(s.jsx)("li",{className:"icon view",children:t.viewersCount}),Object(s.jsx)("li",{className:"icon comment",children:t.questionsCount})]})]})})}},603:function(e,t,o){"use strict";o.r(t);var n=o(37),r=o(6),s=o(2),i=o.n(s),l=o(41),a=o(12),c=o(17),u=o(0),d=o(227),h=o(238),p=o(83),m=o(66),v=o(1),f=Object(n.b)((function(e){return{isLoading:e.common.isLoading}}),null)((function(e){var t=Object(u.useState)([]),o=Object(c.a)(t,2),n=o[0],s=o[1],f=Object(u.useState)(1),b=Object(c.a)(f,2),g=b[0],j=b[1],w=Object(u.useState)(1),T=Object(c.a)(w,2),O=T[0],y=T[1],S=Object(u.useState)(!0),x=Object(c.a)(S,2),E=x[0],_=x[1];Object(u.useEffect)((function(){L()}),[]);var L=function(){var e=Object(a.a)(i.a.mark((function e(){var t,o,r,a,c,u,d;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(n.length>=g)){e.next=3;break}return _(!1),e.abrupt("return");case 3:return t={page:O,perPage:10},e.next=6,Object(p.i)(t);case 6:(o=e.sent).success&&(u=[].concat(Object(l.a)(n),Object(l.a)(null===(r=o.result)||void 0===r?void 0:r.data)),(null===(a=o.result)||void 0===a?void 0:a.length)<10&&_(!1),s(u),y(O+1),(null===(c=o.result)||void 0===c?void 0:c.totalCount)!==g&&j(null===(d=o.result)||void 0===d?void 0:d.totalCount));case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(v.jsx)(d.a,{dataLength:n.length,next:L,style:{overflowX:"hidden"},hasMore:E,loader:Object(v.jsx)(v.Fragment,{}),children:Object(v.jsx)("div",{className:"app_wrapper",children:Object(v.jsx)("div",{className:"section_wrapper",children:Object(v.jsxs)("div",{className:"custom_container",children:[Object(v.jsxs)("div",{className:"relate",children:[Object(v.jsx)("button",{className:"back",onClick:function(){var t;null===(t=e.history)||void 0===t||t.goBack()}}),Object(v.jsx)("span",{className:"title",children:"Most viewed jobs"})]}),Object(v.jsx)("div",{className:"flex_row tradies_row",children:(null===n||void 0===n?void 0:n.length)>0||e.isLoading?null===n||void 0===n?void 0:n.map((function(t){return Object(u.createElement)(h.a,Object(r.a)(Object(r.a)({item:t},e),{},{key:t.jobId}))})):Object(v.jsxs)("div",{className:"no_record",children:[Object(v.jsx)("figure",{className:"no_img",children:Object(v.jsx)("img",{src:m.a,alt:"data not found"})}),Object(v.jsx)("span",{children:"No Data Found"})]})})]})})})})})),b=Object(n.b)((function(e){return{jobDataWithJobTypeLatLong:e.homeSearch.jobDataWithJobTypeLatLong}}),null)(f);t.default=b}}]);
//# sourceMappingURL=33.736a1d1d.chunk.js.map