(this["webpackJsonptickt-web"]=this["webpackJsonptickt-web"]||[]).push([[28],{238:function(e,i,t){"use strict";var l=t(76),a=t(20),s=t(1);i.a=function(e){var i=e.item;return Object(s.jsx)("div",{className:"flex_col_sm_6",children:Object(s.jsxs)("div",{className:"tradie_card","data-aos":"fade-in","data-aos-delay":"250","data-aos-duration":"1000",children:[Object(s.jsx)("a",{href:"javascript:void(0)",className:"more_detail circle",onClick:function(){return function(i){if(1===a.a.getItem("userType")){var t="/job-details-page?jobId=".concat(i.jobId);(null===i||void 0===i?void 0:i.tradeId)&&(t+="&tradeId=".concat(i.tradeId)),(null===i||void 0===i?void 0:i.specializationId)&&(t+="&specializationId=".concat(i.specializationId)),(null===i||void 0===i?void 0:i.jobStatus)&&(t+="&jobStatus=".concat(i.jobStatus)),console.log({item:i,string_redirect:t}),e.history.push(t)}else{var l="";(null===i||void 0===i?void 0:i.jobStatus)&&(l=(null===i||void 0===i?void 0:i.jobStatus).toLowerCase());var s="?jobId=".concat(null===i||void 0===i?void 0:i.jobId,"&status=").concat(l,"&edit=true");["expired","completed"].includes(l)&&(s+="&job=past"),console.log({string_item:s,status:l,jobStatus:null===i||void 0===i?void 0:i.jobStatus});var n=s;e.history.push("/job-detail?".concat(n))}}(i)}}),Object(s.jsxs)("div",{className:"user_wrap",children:[Object(s.jsx)("figure",{className:"u_img ".concat(2===e.userType?"icon":""),children:Object(s.jsx)("img",{src:2===e.userType?i.tradeSelectedUrl:i.builderImage||l.a,alt:"",onError:function(e){var i,t;(null===e||void 0===e||null===(i=e.target)||void 0===i?void 0:i.onerror)&&(e.target.onerror=null),(null===e||void 0===e||null===(t=e.target)||void 0===t?void 0:t.src)&&(e.target.src=l.a)}})}),Object(s.jsxs)("div",{className:"details",children:[Object(s.jsx)("span",{className:"name",children:2===e.userType?i.tradeName:i.jobName}),Object(s.jsx)("span",{className:"prof",children:2===e.userType?i.jobName:i.builderName})]})]}),Object(s.jsx)("div",{className:"job_info",children:Object(s.jsxs)("ul",{children:[Object(s.jsx)("li",{className:"icon clock",children:i.time}),Object(s.jsx)("li",{className:"icon dollar",children:i.amount}),Object(s.jsx)("li",{className:"icon location line-1",children:i.locationName}),Object(s.jsx)("li",{className:"icon calendar",children:i.durations})]})}),Object(s.jsx)("p",{className:"commn_para line-3",children:i.jobDescription}),Object(s.jsxs)("ul",{className:"count_wrap",children:[Object(s.jsx)("li",{className:"icon view",children:i.viewersCount}),Object(s.jsx)("li",{className:"icon comment",children:i.questionsCount})]})]})})}},254:function(e,i,t){"use strict";i.a="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArgAAAGQAQMAAAB/GYGqAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAGUExURfPz89ra2jDp5wUAAAGDSURBVHja7dfBbYNAEEZhrD0g5UIJlEI6g3SSc1rIhXRCCRwshQNissYxMpKP869Y+30FvIM9M14XBQAAAAAAAAAAAAAAAAAAAAAAAPCiwqzp1tZJuo31kq7ZqMiezKacusFMMhCl2ZJTtzIzunTV3dz2QtVV3Z3c7m/R2pDV72YlWYv4AZ95m+EBzdrFw6Z6B2v2TnUneFf+f20m+QPTiLpt7A6ScZD8MQqX7iTqCgbt8vxzH7Twvo6Ze7ca1zFzH7RmXsfMvRtf1mvWeYDjE+1D0Y0z9nPt+i5GPGW/1+7kP7vmvxi1qNtsXd/FaLeuOY/vpvMdX0k33HV73/HdDKLuKFkL3259150ka+G7cG2C7qJZN89FPiXpdpI19uyWu24v6g6SNc6hW++6o+Q8eB4eVbfddefDdy1Jdzl6d3/O/A6lqhsSdb0OcEn3Ydfrh6ii+xTd4UU/hzLNPVP9Dvm9d2oT/W95+775+iwAAAAAAAAAAAAAAAAAAAAAAACAw/sD95hm4s0LB7kAAAAASUVORK5CYII="},280:function(e,i,t){"use strict";i.a="data:image/jpeg;base64,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"},305:function(e,i,t){"use strict";var l=t(324),a=t(76),s=t(1),n=Object(s.jsx)("span",{className:"","data-index":"4","data-forhalf":"\u2605",style:{position:"relative",overflow:"hidden",cursor:"pointer",display:"block",float:"left",color:"rgb(223, 229, 239)",fontSize:"20px"},children:"\u2605"}),c=Object(s.jsx)("span",{className:"","data-index":"0","data-forhalf":"\u2605",style:{position:"relative",overflow:"hidden",cursor:"pointer",display:"block",float:"left",color:"rgb(255, 215, 0)",fontSize:"20px"},children:"\u2605"});i.a=function(e){var i,t=e.item;return Object(s.jsx)("div",{className:"flex_col_sm_3",children:Object(s.jsxs)("div",{className:"review_card",children:[Object(s.jsx)("div",{className:"rating_star",children:Object(s.jsx)(l.a,{fractions:2,emptySymbol:n,fullSymbol:c,initialRating:t.rating?t.rating:t.ratings,readonly:!0})}),Object(s.jsxs)("div",{className:"pic_shot_dtl",children:[Object(s.jsx)("figure",{className:"u_img",children:Object(s.jsx)("img",{src:t.userImage?t.userImage:t.reviewSenderImage?t.reviewSenderImage:a.a,onError:function(e){var i,t;(null===e||void 0===e||null===(i=e.target)||void 0===i?void 0:i.onerror)&&(e.target.onerror=null),(null===e||void 0===e||null===(t=e.target)||void 0===t?void 0:t.src)&&(e.target.src=a.a)},alt:"user-img"})}),Object(s.jsxs)("div",{className:"name_wrap",children:[Object(s.jsx)("span",{className:"user_name",title:"Cheryl",children:t.name?t.name:t.reviewSenderName}),Object(s.jsx)("span",{className:"date",children:t.date})]})]}),Object(s.jsx)("p",{className:"commn_para ---",title:"",children:(null===(i=t.review)||void 0===i?void 0:i.length)?t.review:Object(s.jsx)("i",{style:{color:"#929292"},children:"No Comments"})})]})},t.reviewId)}},314:function(e,i,t){"use strict";t.d(i,"b",(function(){return I})),t.d(i,"c",(function(){return B}));var l=t(41),a=t(57),s=t(6),n=t(2),c=t.n(n),o=t(12),r=t(17),d=t(0),A=t(19),u=t(221),v=t(238),j=t(214),b=t(305),m=t(283),p=t.n(m),O=t(254),f=t(76),h=t(280),x=t(66),w=t(86),g=t(115),C=t.n(g),N=(t(142),t(20)),y=t(309),k=t.n(y),_=t(48),R=t(1),I={desktop:{breakpoint:{max:3e3,min:1024},items:6,slidesToSlide:1,paritialVisibilityGutter:30},tablet:{breakpoint:{max:1200,min:768},items:2,paritialVisibilityGutter:50},mobile:{breakpoint:{max:650,min:0},items:1,paritialVisibilityGutter:45}},B={desktop:{breakpoint:{max:3e3,min:1024},items:1,slidesToSlide:1},tablet:{breakpoint:{max:1200,min:768},items:1},mobile:{breakpoint:{max:650,min:0},items:1}};i.a=function(e){var i=Object(d.useState)({}),t=Object(r.a)(i,2),n=t[0],m=t[1],g=Object(d.useState)(!0),y=Object(r.a)(g,2),Q=y[0],E=y[1],F=Object(d.useState)(""),D=Object(r.a)(F,2),S=D[0],U=D[1],K=Object(d.useState)([]),P=Object(r.a)(K,2),T=P[0],V=P[1],q=Object(d.useState)(""),L=Object(r.a)(q,2),H=(L[0],L[1],Object(d.useState)(1)),M=Object(r.a)(H,2),z=M[0],Z=M[1],J=Object(d.useState)({portfolioImageClicked:!1,portfolioDetails:""}),G=Object(r.a)(J,2),X=G[0],Y=G[1],W=Object(d.useState)({reviewReplyClicked:!1,showAllReviewsClicked:!1,submitReviewsClicked:!1,rating:null,deleteParentReviews:!1,updateParentReviews:!1,deleteReviewsClicked:!1,updateReviewsClicked:!1,reviewsClickedType:"",confirmationClicked:!1,showReviewReplyButton:!0,reviewId:"",reviewData:"",showReviewReply:!1,replyShownHideList:[]}),$=Object(r.a)(W,2),ee=$[0],ie=$[1],te=Object(d.useState)(!1),le=Object(r.a)(te,2),ae=le[0],se=le[1],ne=Object(d.useState)(!1),ce=Object(r.a)(ne,2);ce[0],ce[1];Object(d.useEffect)((function(){re()}),[]),Object(d.useEffect)((function(){if(e.builderProfileViewData&&U(e.builderProfileViewData),S&&("1"==ye||1==e.userType)){var i,t={name:null===S||void 0===S?void 0:S.builderName,category:null===S||void 0===S||null===(i=S.jobPostedData[0])||void 0===i?void 0:i.tradeName};_.b.moE_SendEvent(A.a.VIEWED_BUILDER_PROFILE,t),_.a.mixP_SendEvent(A.a.VIEWED_BUILDER_PROFILE,t)}}),[e.builderProfileViewData,S]);var oe=function(){return{builderId:new URLSearchParams(e.location.search).get("builderId"),user_type:N.a.getItem("userType")}},re=function(){var i=Object(o.a)(c.a.mark((function i(){var t,l,a,s,n,o,r;return c.a.wrap((function(i){for(;;)switch(i.prev=i.next){case 0:if(t=oe(),l=t.builderId,"2"!=t.user_type&&2!=e.userType){i.next=5;break}e.getBuilderProfileView(),i.next=10;break;case 5:return i.next=7,Object(u.B)(l);case 7:a=i.sent,console.log({res1:a}),(null===a||void 0===a?void 0:a.success)?(U(a.data),se(!1)):404===(null===a||void 0===a?void 0:a.status)&&se(!0);case 10:return s={builderId:l,page:1},i.next=13,Object(u.Y)(s);case 13:(n=i.sent).success&&(r=(null===n||void 0===n||null===(o=n.data)||void 0===o?void 0:o.list)||(null===n||void 0===n?void 0:n.data),console.log({data_:r}),V(r));case 15:case"end":return i.stop()}}),i)})));return function(){return i.apply(this,arguments)}}(),de=function(e){ie((function(i){var t;return Object(s.a)(Object(s.a)({},i),{},(t={},Object(a.a)(t,e,!1),Object(a.a)(t,"deleteReviewsClicked",!1),Object(a.a)(t,"reviewData",""),t))})),m({})},Ae=function(){var e=Object(o.a)(c.a.mark((function e(){var i,t,a,s;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return i={builderId:null===S||void 0===S?void 0:S.builderId,page:z+1},e.next=3,Object(u.Y)(i);case 3:(t=e.sent).success&&(s=null===t||void 0===t||null===(a=t.data)||void 0===a?void 0:a.list,V((function(e){return[].concat(Object(l.a)(e),Object(l.a)(s))})),Z(i.page));case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),ue=function(e){var i;if("removeReviewReply"===e||"removeReviewBuilder"===e)return!0;var t={};return(null===(i=ee.reviewData.trim())||void 0===i?void 0:i.length)||(t.reviewData="updateReviewBuilder"===e?A.b.errorStrings.askReview:A.b.errorStrings.askReply),m(t),!Object.keys(t).length},ve=function(){var e=Object(o.a)(c.a.mark((function e(i){var t,l,a,n,o,r,d,A,v;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!["reviewReply","updateReviewReply","removeReviewReply","removeReviewBuilder","updateReviewBuilder"].includes(i)){e.next=38;break}if(ue(i)){e.next=3;break}return e.abrupt("return");case 3:if(n=ee.replyShownHideList,"reviewReply"!=i){e.next=9;break}return a={reviewId:ee.reviewId,reply:ee.reviewData.trim()},e.next=8,Object(u.Bb)(a);case 8:l=e.sent;case 9:if("updateReviewReply"!=i){e.next=14;break}return a={reviewId:ee.reviewId,replyId:ee.replyId,reply:ee.reviewData.trim()},e.next=13,Object(u.Cb)(a);case 13:l=e.sent;case 14:if("removeReviewReply"!=i){e.next=19;break}return a={reviewId:ee.reviewId,replyId:ee.replyId},e.next=18,Object(u.Ab)(a);case 18:l=e.sent;case 19:if("updateReviewBuilder"!=i){e.next=24;break}return a={reviewId:ee.reviewId,rating:ee.rating,review:ee.reviewData.trim()},e.next=23,Object(u.Kb)(a);case 23:l=e.sent;case 24:if("removeReviewBuilder"!=i){e.next=29;break}return o=ee.reviewId,e.next=28,Object(u.t)(o);case 28:l=e.sent;case 29:if(!(null===(t=l)||void 0===t?void 0:t.success)){e.next=37;break}return d={builderId:null===S||void 0===S?void 0:S.builderId,page:1},e.next=33,Object(u.Y)(d);case 33:A=e.sent,v=null===A||void 0===A||null===(r=A.data)||void 0===r?void 0:r.list,V(v),Z(1);case 37:ie((function(e){return Object(s.a)(Object(s.a)({},e),{},{submitReviewsClicked:!1,reviewReplyClicked:!1,showAllReviewsClicked:!0,confirmationClicked:!1,reviewsClickedType:"",rating:null,deleteParentReviews:!1,updateParentReviews:!1,deleteReviewsClicked:!1,updateReviewsClicked:!1,reviewId:"",reviewData:"",replyShownHideList:n})}));case 38:case"end":return e.stop()}}),e)})));return function(i){return e.apply(this,arguments)}}(),je=function(e,i,t,a,n){if("reviewReplyClicked"==e)ie((function(e){return Object(s.a)(Object(s.a)({},e),{},{reviewReplyClicked:!0,showAllReviewsClicked:!1,reviewsClickedType:"reviewReply",reviewId:i})}));else if("reviewReply"==e&&ue(e))ie((function(i){return Object(s.a)(Object(s.a)({},i),{},{submitReviewsClicked:!0,reviewsClickedType:e,confirmationClicked:!0})}));else if("removeReviewReply"==e)ie((function(l){return Object(s.a)(Object(s.a)({},l),{},{confirmationClicked:!0,deleteReviewsClicked:!0,reviewId:i,replyId:t,reviewsClickedType:e})}));else if("updateReviewReply"==e)ie((function(l){return Object(s.a)(Object(s.a)({},l),{},{reviewReplyClicked:!0,reviewId:i,replyId:t,reviewsClickedType:e,showAllReviewsClicked:!1,updateReviewsClicked:!0,reviewData:a})}));else if("replyCancelBtnClicked"==e)ie((function(e){return Object(s.a)(Object(s.a)({},e),{},{reviewReplyClicked:!1,updateReviewsClicked:!1,deleteReviewsClicked:!1,showAllReviewsClicked:!0,reviewData:"",reviewsClickedType:"",reviewId:""})})),m({});else if("hideReviewClicked"==e){var c=Object(l.a)(ee.replyShownHideList).filter((function(e){return e!==t}));ie((function(e){return Object(s.a)(Object(s.a)({},e),{},{replyShownHideList:c})}))}else if("showReviewClicked"==e){var o=Object(l.a)(ee.replyShownHideList);o.push(t),ie((function(e){return Object(s.a)(Object(s.a)({},e),{},{replyShownHideList:o})}))}else"removeReviewBuilder"==e?ie((function(t){return Object(s.a)(Object(s.a)({},t),{},{confirmationClicked:!0,deleteParentReviews:!0,reviewId:i,reviewsClickedType:e})})):"updateReviewBuilder"==e&&ie((function(t){return Object(s.a)(Object(s.a)({},t),{},{reviewReplyClicked:!0,updateParentReviews:!0,reviewsClickedType:e,showAllReviewsClicked:!1,rating:n,reviewId:i,reviewData:a})}))};var be,me,pe,Oe,fe,he,xe,we,ge,Ce,Ne,ye=oe().user_type,ke=Number(ye);return ae?Object(R.jsx)("div",{className:"app_wrapper",children:Object(R.jsx)("div",{className:"custom_container",children:Object(R.jsxs)("div",{className:"section_wrapper",children:[Object(R.jsx)("div",{className:"vid_img_wrapper pt-20",children:Object(R.jsx)("div",{className:"flex_row",children:Object(R.jsx)("div",{className:"flex_col_sm_3 relative",children:Object(R.jsx)("button",{className:"back",onClick:function(){e.history.goBack()}})})})}),Object(R.jsxs)("div",{className:"no_record  m-t-vh",children:[Object(R.jsx)("figure",{className:"no_img",children:Object(R.jsx)("img",{src:x.a,alt:"data not found"})}),Object(R.jsx)("span",{children:"This builder is no longer available"})]})]})})}):Object(R.jsx)("div",{className:"app_wrapper",children:Object(R.jsxs)("div",{className:"custom_container",children:[Object(R.jsx)("div",{className:"section_wrapper",children:Object(R.jsxs)("div",{className:"vid_img_wrapper pt-20",children:[Object(R.jsx)("div",{className:"flex_row",children:Object(R.jsx)("div",{className:"flex_col_sm_3 relative",children:Object(R.jsx)("button",{className:"back",onClick:function(){var i;return null===(i=e.history)||void 0===i?void 0:i.goBack()}})})}),Object(R.jsxs)("div",{className:"flex_row",children:[Object(R.jsx)("div",{className:"flex_col_sm_3",children:Object(R.jsx)("div",{className:"upload_profile_pic",children:Object(R.jsxs)("figure",{className:"user_img",children:[Q&&Object(R.jsx)(k.a,{style:{lineHeight:2,height:240}}),!e.isSkeletonLoading&&Object(R.jsx)("img",{src:(null===S||void 0===S?void 0:S.builderImage)||O.a,alt:"profile-pic",onLoad:function(){return E(!1)},onError:function(e){e.target.src=f.a},hidden:Q})]})})}),Object(R.jsx)("div",{className:"flex_col_sm_3 relative",children:Object(R.jsx)("div",{className:"detail_card",children:e.isSkeletonLoading?Object(R.jsx)(k.a,{count:5,height:25}):Object(R.jsxs)(R.Fragment,{children:[Object(R.jsx)("span",{className:"title line-1",title:null===S||void 0===S?void 0:S.builderName,children:(null===S||void 0===S?void 0:S.builderName)||""}),Object(R.jsx)("span",{className:"xs_sub_title",children:function(e){if(console.log(e,"inputttts"),e){var i=null===e||void 0===e?void 0:e.split(" "),t=[];return i.forEach((function(e){t.push(e[0].toUpperCase()+e.slice(1,e.length))})),t.join(" ")}}((null===S||void 0===S?void 0:S.companyName)||"")}),Object(R.jsx)("span",{className:"tagg",children:(null===S||void 0===S?void 0:S.position)||""}),Object(R.jsxs)("ul",{className:"review_job",children:[Object(R.jsxs)("li",{children:[Object(R.jsx)("span",{className:"icon reviews",children:(null===S||void 0===S?void 0:S.ratings)||"0"}),Object(R.jsx)("span",{className:"review_count",children:"".concat((null===S||void 0===S?void 0:S.reviewsCount)||"0"," reviews")})]}),console.log({jobCompletedCount:null===S||void 0===S?void 0:S.jobCompletedCount}),Object(R.jsxs)("li",{children:[Object(R.jsx)("span",{className:"icon job",children:(null===S||void 0===S?void 0:S.jobCompletedCount)||"0"}),Object(R.jsxs)("span",{className:"review_count",children:[" ","Jobs Completed"," "]})]})]}),2===ke?Object(R.jsx)("button",{className:"fill_btn full_btn btn-effect",onClick:function(){return e.history.push("/update-user-info")},children:"Edit"}):Object(R.jsx)("button",{className:"fill_btn full_btn btn-effect",onClick:function(){var i,t,l=new URLSearchParams(null===(i=e.history)||void 0===i||null===(t=i.location)||void 0===t?void 0:t.search).get("builderId");e.history.push({pathname:"/choose-job-to-start-chat",state:{builderId:l||""}})},children:"Write a message"})]})})})]}),Object(R.jsx)("div",{className:"flex_row",children:Object(R.jsx)("div",{className:"flex_col_sm_8",children:e.isSkeletonLoading?Object(R.jsx)(k.a,{count:2}):Object(R.jsxs)("div",{className:"description",children:[Object(R.jsx)("span",{className:"sub_title",children:"About us"}),Object(R.jsx)("p",{className:"commn_para",children:(null===S||void 0===S?void 0:S.aboutCompany)||""})]})})})]})}),(null===S||void 0===S||null===(be=S.portfolio)||void 0===be?void 0:be.length)>0&&Object(R.jsxs)("div",{className:"section_wrapper",children:[Object(R.jsx)("span",{className:"sub_title",children:e.isSkeletonLoading?Object(R.jsx)(k.a,{}):"Portfolio"}),Object(R.jsx)(C.a,{responsive:I,showDots:!1,arrows:!0,infinite:!0,className:"portfolio_wrappr",partialVisbile:!0,children:e.isSkeletonLoading?Object(R.jsx)(k.a,{height:256}):(null===S||void 0===S||null===(me=S.portfolio)||void 0===me?void 0:me.length)?null===S||void 0===S||null===(pe=S.portfolio)||void 0===pe?void 0:pe.map((function(e){var i;return Object(R.jsx)("div",{className:"media",onClick:function(){return i=e,void Y((function(e){return Object(s.a)(Object(s.a)({},e),{},{portfolioImageClicked:!0,portfolioDetails:i})}));var i},children:Object(R.jsxs)("figure",{className:"portfolio_img",children:[Object(R.jsx)("img",{src:(null===(i=e.portfolioImage)||void 0===i?void 0:i.length)?e.portfolioImage[0]:h.a,alt:"portfolio-images"}),Object(R.jsx)("span",{className:"xs_sub_title",children:Object(R.jsx)("p",{className:"line-3",title:e.jobName||"",children:e.jobName||""})})]})},e.portfolioId)})):null})]}),Object(R.jsx)(j.a,{className:"custom_modal",open:X.portfolioImageClicked,onClose:function(){return Y((function(e){return Object(s.a)(Object(s.a)({},e),{},{portfolioImageClicked:!1})}))},"aria-labelledby":"simple-modal-title","aria-describedby":"simple-modal-description",children:Object(R.jsxs)("div",{className:"custom_wh portfolio_preview","data-aos":"zoom-in","data-aos-delay":"30","data-aos-duration":"1000",children:[Object(R.jsx)("div",{className:"heading",children:Object(R.jsx)("button",{className:"close_btn",onClick:function(){return Y((function(e){return Object(s.a)(Object(s.a)({},e),{},{portfolioImageClicked:!1})}))},children:Object(R.jsx)("img",{src:w.a,alt:"cancel"})})}),Object(R.jsxs)("div",{className:"flex_row",children:[Object(R.jsx)("div",{className:"flex_col_sm_6",children:Object(R.jsx)(C.a,{responsive:B,showDots:!0,infinite:!0,autoPlay:!0,arrows:!1,className:"portfolio_wrappr",children:(null===X||void 0===X?void 0:X.portfolioDetails)?null===X||void 0===X||null===(Oe=X.portfolioDetails)||void 0===Oe||null===(fe=Oe.portfolioImage)||void 0===fe?void 0:fe.map((function(e){var i;return Object(R.jsx)("div",{className:"media",children:Object(R.jsx)("figure",{className:"portfolio_img",children:Object(R.jsx)("img",{src:e||h.a,alt:"portfolio-images"})})},null===X||void 0===X||null===(i=X.portfolioDetails)||void 0===i?void 0:i.portfolioId)})):Object(R.jsx)("img",{alt:"",src:h.a})})}),Object(R.jsxs)("div",{className:"flex_col_sm_6",children:[Object(R.jsx)("span",{className:"xs_sub_title",children:"Job Description"}),Object(R.jsx)("div",{className:"job_content",children:Object(R.jsx)("p",{children:null===X||void 0===X||null===(he=X.portfolioDetails)||void 0===he?void 0:he.jobDescription})})]})]})]})}),Object(R.jsxs)("div",{className:"section_wrapper",children:[Object(R.jsx)("span",{className:"sub_title",children:e.isSkeletonLoading?Object(R.jsx)(k.a,{count:2}):"Job posted"}),e.isSkeletonLoading?Object(R.jsx)(k.a,{height:250}):Object(R.jsx)("div",{className:"flex_row tradies_row",children:e.isSkeletonLoading||e.isLoading||(null===S||void 0===S||null===(xe=S.jobPostedData)||void 0===xe?void 0:xe.length)>0?null===S||void 0===S||null===(we=S.jobPostedData)||void 0===we||null===(ge=we.slice(0,4))||void 0===ge?void 0:ge.map((function(i){return Object(d.createElement)(v.a,Object(s.a)(Object(s.a)({item:i},e),{},{key:i.jobId,userType:N.a.getItem("userType")}))})):Object(R.jsxs)("div",{className:"no_record",children:[Object(R.jsx)("figure",{className:"no_data_img",children:Object(R.jsx)("img",{src:x.a,alt:"data not found"})}),Object(R.jsx)("span",{children:"No Data Found"})]})}),e.isSkeletonLoading?Object(R.jsx)(k.a,{}):Object(R.jsx)("button",{className:"fill_grey_btn full_btn m-tb40 view_more ".concat(0===(null===S||void 0===S?void 0:S.totalJobPostedCount)?"disable_btn":""),disabled:0===(null===S||void 0===S?void 0:S.totalJobPostedCount),onClick:function(){var i;null===(i=e.history)||void 0===i||i.push("/builder-posted-jobs?bId=".concat(null===S||void 0===S?void 0:S.builderId,"&jobCount=").concat(null===S||void 0===S?void 0:S.totalJobPostedCount))},children:"View ".concat((null===S||void 0===S?void 0:S.totalJobPostedCount)?"".concat(1===(null===S||void 0===S?void 0:S.totalJobPostedCount)?"".concat(null===S||void 0===S?void 0:S.totalJobPostedCount," job"):"all ".concat(null===S||void 0===S?void 0:S.totalJobPostedCount," jobs")):"")})]}),Object(R.jsxs)("div",{className:"section_wrapper",children:[Object(R.jsx)("span",{className:"sub_title",children:e.isSkeletonLoading?Object(R.jsx)(k.a,{count:2}):"Reviews"}),e.isSkeletonLoading?Object(R.jsx)(k.a,{height:200}):Object(R.jsx)("div",{className:"flex_row review_parent",children:e.isSkeletonLoading||e.isLoading||T.length>0?null===(Ce=T.slice(0,8))||void 0===Ce?void 0:Ce.map((function(e){return Object(R.jsx)(b.a,{item:e.reviewData})})):Object(R.jsxs)("div",{className:"no_record",children:[Object(R.jsx)("figure",{className:"no_data_img",children:Object(R.jsx)("img",{src:x.a,alt:"data not found"})}),Object(R.jsx)("span",{children:"No Data Found"})]})}),e.isSkeletonLoading?Object(R.jsx)(k.a,{}):Object(R.jsx)("button",{className:"fill_grey_btn full_btn view_more ".concat(0===(null===S||void 0===S?void 0:S.reviewsCount)?"disable_btn":""),disabled:0===(null===S||void 0===S?void 0:S.reviewsCount),onClick:function(){if("2"==ye||2==e.userType){var i={timeStamp:_.b.getCurrentTimeStamp()};_.b.moE_SendEvent(A.a.VIEWED_REVIEWS,i),_.a.mixP_SendEvent(A.a.VIEWED_REVIEWS,i)}ie((function(e){return Object(s.a)(Object(s.a)({},e),{},{showAllReviewsClicked:!0})}))},children:"View all ".concat((null===S||void 0===S?void 0:S.reviewsCount)||0," review").concat((null===S||void 0===S?void 0:S.reviewsCount)?"s":"")})]}),ee.showAllReviewsClicked&&(null===T||void 0===T?void 0:T.length)>0&&Object(R.jsx)(j.a,{className:"ques_ans_modal",open:ee.showAllReviewsClicked,onClose:function(){return de("showAllReviewsClicked")},"aria-labelledby":"simple-modal-title","aria-describedby":"simple-modal-description",children:Object(R.jsxs)("div",{className:"custom_wh","data-aos":"zoom-in","data-aos-delay":"30","data-aos-duration":"1000",children:[Object(R.jsxs)("div",{className:"heading",children:[Object(R.jsx)("span",{className:"sub_title",children:"".concat((null===S||void 0===S?void 0:S.reviewsCount)?"".concat(1===(null===S||void 0===S?void 0:S.reviewsCount)?"".concat(null===S||void 0===S?void 0:S.reviewsCount," review"):"".concat(null===S||void 0===S?void 0:S.reviewsCount," reviews")):"")}),Object(R.jsx)("button",{className:"close_btn",onClick:function(){return de("showAllReviewsClicked")},children:Object(R.jsx)("img",{src:w.a,alt:"cancel"})})]}),Object(R.jsxs)("div",{className:"inner_wrap",children:[null===T||void 0===T?void 0:T.map((function(e){var i,t,l,a,s,n,c,o,r,d,A=e.reviewData;return Object(R.jsxs)("div",{children:[Object(R.jsxs)("div",{className:"question_ans_card",children:[Object(R.jsxs)("div",{className:"user_detail",children:[Object(R.jsx)("figure",{className:"user_img",children:Object(R.jsx)("img",{src:(null===A||void 0===A?void 0:A.userImage)||f.a,alt:"user-img"})}),Object(R.jsxs)("div",{className:"details",children:[Object(R.jsx)("span",{className:"user_name",children:(null===A||void 0===A?void 0:A.name)||""}),Object(R.jsx)("span",{className:"date",children:(null===A||void 0===A?void 0:A.date)||""})]}),Object(R.jsx)("div",{className:"rating_star",children:Object(R.jsx)(p.a,{count:5,value:A.rating,size:30,edit:!1,isHalf:!0,emptyIcon:Object(R.jsx)("i",{className:"far fa-star"}),halfIcon:Object(R.jsx)("i",{className:"fa fa-star-half-alt"}),fullIcon:Object(R.jsx)("i",{className:"fa fa-star"}),activeColor:"#ffd700",color:"#DFE5EF"})})]}),Object(R.jsx)("p",{children:(null===A||void 0===A?void 0:A.review)||""}),Object.keys(null===A||void 0===A?void 0:A.replyData).length>0&&!ee.replyShownHideList.includes(null===A||void 0===A||null===(i=A.replyData)||void 0===i?void 0:i.replyId)&&Object(R.jsx)("span",{className:"show_hide_ans link",onClick:function(){var e;return je("showReviewClicked","",null===A||void 0===A||null===(e=A.replyData)||void 0===e?void 0:e.replyId)},children:"Show reply"}),ee.replyShownHideList.includes(null===A||void 0===A||null===(t=A.replyData)||void 0===t?void 0:t.replyId)&&Object(R.jsx)("span",{className:"show_hide_ans link",onClick:function(){var e;return je("hideReviewClicked","",null===A||void 0===A||null===(e=A.replyData)||void 0===e?void 0:e.replyId)},children:"Hide reply"}),!(null===A||void 0===A?void 0:A.isModifiable)&&0===Object.keys(null===A||void 0===A?void 0:A.replyData).length&&Object(R.jsx)("span",{className:"action link",onClick:function(){return je("reviewReplyClicked",A.reviewId)},children:"Reply"}),(null===A||void 0===A?void 0:A.isModifiable)&&0===Object.keys(null===A||void 0===A?void 0:A.replyData).length&&Object(R.jsx)("span",{className:"action link",onClick:function(){return je("updateReviewBuilder",null===A||void 0===A?void 0:A.reviewId,"",null===A||void 0===A?void 0:A.review,null===A||void 0===A?void 0:A.rating)},children:"Edit"}),(null===A||void 0===A?void 0:A.isModifiable)&&0===Object.keys(null===A||void 0===A?void 0:A.replyData).length&&Object(R.jsx)("span",{className:"action link",onClick:function(){return je("removeReviewBuilder",null===A||void 0===A?void 0:A.reviewId)},children:"Delete"})]}),(null===A||void 0===A||null===(l=A.replyData)||void 0===l?void 0:l.reply)&&ee.replyShownHideList.includes(null===A||void 0===A||null===(a=A.replyData)||void 0===a?void 0:a.replyId)&&Object(R.jsxs)("div",{className:"question_ans_card answer",children:[Object(R.jsxs)("div",{className:"user_detail",children:[Object(R.jsx)("figure",{className:"user_img",children:Object(R.jsx)("img",{src:(null===A||void 0===A||null===(s=A.replyData)||void 0===s?void 0:s.userImage)||f.a,alt:"user-img"})}),Object(R.jsxs)("div",{className:"details",children:[Object(R.jsx)("span",{className:"user_name",children:(null===A||void 0===A||null===(n=A.replyData)||void 0===n?void 0:n.name)||""}),Object(R.jsx)("span",{className:"date",children:(null===A||void 0===A||null===(c=A.replyData)||void 0===c?void 0:c.date)||""})]})]}),Object(R.jsx)("p",{children:null===A||void 0===A||null===(o=A.replyData)||void 0===o?void 0:o.reply}),(null===A||void 0===A||null===(r=A.replyData)||void 0===r?void 0:r.isModifiable)&&Object(R.jsx)("span",{className:"action link",onClick:function(){var e,i,t;return je("updateReviewReply",null===A||void 0===A||null===(e=A.replyData)||void 0===e?void 0:e.reviewId,null===A||void 0===A||null===(i=A.replyData)||void 0===i?void 0:i.replyId,null===A||void 0===A||null===(t=A.replyData)||void 0===t?void 0:t.reply)},children:"Edit"}),(null===A||void 0===A||null===(d=A.replyData)||void 0===d?void 0:d.isModifiable)&&Object(R.jsx)("span",{className:"action link",onClick:function(){var e,i;return je("removeReviewReply",null===A||void 0===A||null===(e=A.replyData)||void 0===e?void 0:e.reviewId,null===A||void 0===A||null===(i=A.replyData)||void 0===i?void 0:i.replyId)},children:"Delete"})]})]})})),(null===S||void 0===S?void 0:S.reviewsCount)>T.length&&Object(R.jsx)("div",{className:"text-center",children:Object(R.jsx)("button",{className:"fill_grey_btn load_more",onClick:Ae,children:"View more"})})]})]})}),Object(R.jsx)(j.a,{className:"ques_ans_modal",open:ee.reviewReplyClicked,onClose:function(){return de("reviewReplyClicked")},"aria-labelledby":"simple-modal-title","aria-describedby":"simple-modal-description",children:Object(R.jsxs)("div",{className:"custom_wh ask_ques","data-aos":"zoom-in","data-aos-delay":"30","data-aos-duration":"1000",children:[Object(R.jsxs)("div",{className:"heading",children:[Object(R.jsx)("span",{className:"sub_title",children:"".concat(ee.updateReviewsClicked?"Edit reply":ee.updateParentReviews?"Edit Review":"Reply")}),Object(R.jsx)("button",{className:"close_btn",onClick:function(){return de("reviewReplyClicked")},children:Object(R.jsx)("img",{src:w.a,alt:"cancel"})})]}),Object(R.jsxs)("div",{className:"form_field",children:[Object(R.jsx)("label",{className:"form_label",children:"Your ".concat(ee.updateParentReviews?"review":"reply")}),ee.updateParentReviews&&Object(R.jsx)(p.a,{value:ee.rating||0,count:5,isHalf:!0,onChange:function(e){return ie((function(i){return Object(s.a)(Object(s.a)({},i),{},{rating:e})}))},size:40,activeColor:"#ffd700",color:"#DFE5EF"}),Object(R.jsxs)("div",{className:"text_field",children:[Object(R.jsx)("textarea",{placeholder:"Text",maxLength:250,value:ee.reviewData,onChange:function(e){return function(e,i){e.target.value.trim().length<=250&&ie((function(t){return Object(s.a)(Object(s.a)({},t),{},Object(a.a)({},i,e.target.value))}))}(e,"reviewData")}}),Object(R.jsx)("span",{className:"char_count",children:"".concat((null===(Ne=ee.reviewData)||void 0===Ne?void 0:Ne.length)||"0","/250")})]}),!!n.reviewData&&Object(R.jsx)("span",{className:"error_msg",children:n.reviewData})]}),Object(R.jsxs)("div",{className:"bottom_btn custom_btn",children:[ee.updateReviewsClicked||ee.updateParentReviews?Object(R.jsx)("button",{className:"fill_btn full_btn btn-effect",onClick:function(){return ve(ee.reviewsClickedType)},children:"Save"}):Object(R.jsx)("button",{className:"fill_btn full_btn btn-effect",onClick:function(){return je(ee.reviewsClickedType)},children:"Send"}),Object(R.jsx)("button",{className:"fill_grey_btn btn-effect",onClick:function(){return je("replyCancelBtnClicked")},children:"Cancel"})]})]})}),Object(R.jsx)(j.a,{className:"custom_modal",open:ee.confirmationClicked,onClose:function(){return de("confirmationClicked")},"aria-labelledby":"simple-modal-title","aria-describedby":"simple-modal-description",children:Object(R.jsxs)("div",{className:"custom_wh confirmation","data-aos":"zoom-in","data-aos-delay":"30","data-aos-duration":"1000",children:[Object(R.jsxs)("div",{className:"heading",children:[Object(R.jsx)("span",{className:"xs_sub_title",children:"".concat(ee.deleteReviewsClicked||ee.deleteParentReviews?"Delete":"Reply"," Confirmation")}),Object(R.jsx)("button",{className:"close_btn",onClick:function(){return de("confirmationClicked")},children:Object(R.jsx)("img",{src:w.a,alt:"cancel"})})]}),Object(R.jsx)("div",{className:"modal_message",children:Object(R.jsx)("p",{children:"Are you sure you want to ".concat(ee.deleteReviewsClicked?"delete ":"").concat(ee.deleteParentReviews?"delete review":"reply","?")})}),Object(R.jsxs)("div",{className:"dialog_actions",children:[Object(R.jsx)("button",{className:"fill_btn btn-effect",onClick:function(){return ve(ee.reviewsClickedType)},children:"Yes"}),Object(R.jsx)("button",{className:"fill_grey_btn btn-effect",onClick:function(){return de("confirmationClicked")},children:"No"})]})]})})]})})}},587:function(e,i,t){"use strict";t.r(i);var l=t(2),a=t.n(l),s=t(12),n=t(17),c=t(0),o=t(37),r=t(314),d=t(83),A=t(262),u=t.n(A),v=t(115),j=t.n(v),b=(t(142),t(280)),m=t(66),p=t(1);i.default=Object(o.b)((function(e){return{isLoading:e.common.isLoading}}),null)((function(e){var i=Object(c.useState)([]),t=Object(n.a)(i,2),l=(t[0],t[1],Object(c.useState)(!1)),o=Object(n.a)(l,2),A=o[0],v=o[1],O=Object(c.useState)(1),f=Object(n.a)(O,2),h=f[0],x=f[1],w=Object(c.useState)(null),g=Object(n.a)(w,2),C=g[0],N=g[1];console.log("notificationData: ",C),Object(c.useEffect)((function(){y()}),[]);var y=function(){var i=Object(s.a)(a.a.mark((function i(){var t,l,s,n,c;return a.a.wrap((function(i){for(;;)switch(i.prev=i.next){case 0:return s=null===(t=new URLSearchParams(null===(l=e.location)||void 0===l?void 0:l.search))||void 0===t?void 0:t.get("admin_notification_id"),i.next=3,Object(d.b)({admin_notification_id:s});case 3:(n=i.sent).success&&N(null===(c=n.result)||void 0===c?void 0:c.notification_data);case 5:case"end":return i.stop()}}),i)})));return function(){return i.apply(this,arguments)}}(),k=function(e){var i=[],t=[];return i.push(e),t.push("image"),{sources:i,types:t}}(null===C||void 0===C?void 0:C.image),_=k.sources,R=k.types;return Object(p.jsx)("div",{className:"app_wrapper",children:Object(p.jsx)("div",{className:"section_wrapper",children:Object(p.jsx)("div",{className:"custom_container",children:C||e.isLoading?Object(p.jsxs)(p.Fragment,{children:[Object(p.jsx)("div",{className:"flex_row",children:Object(p.jsx)("div",{className:"flex_col_sm_8",children:Object(p.jsxs)("div",{className:"description",children:[Object(p.jsx)("span",{className:"sub_title",children:null===C||void 0===C?void 0:C.title}),Object(p.jsx)("p",{className:"commn_para",children:null===C||void 0===C?void 0:C.sub_title})]})})}),Object(p.jsx)(u.a,{toggler:A,slide:h,sources:_,types:R},null===_||void 0===_?void 0:_.length),C&&Object(p.jsx)("div",{className:"section_wrapper",children:Object(p.jsx)("div",{className:"custom_container",children:Object(p.jsx)(j.a,{responsive:r.b,showDots:!1,arrows:!0,infinite:!0,className:"portfolio_wrappr",partialVisbile:!0,children:Object(p.jsx)("div",{className:"media",children:Object(p.jsx)("figure",{className:"portfolio_img",children:Object(p.jsx)("img",{src:(null===C||void 0===C?void 0:C.image)||b.a,alt:"portfolio-images",onClick:function(){v((function(e){return!e})),x(1)}})})})})})})]}):Object(p.jsxs)("div",{className:"no_record",children:[Object(p.jsx)("figure",{className:"no_img",children:Object(p.jsx)("img",{src:m.a,alt:"data not found"})}),Object(p.jsx)("span",{children:"No Data Found"})]})})})})}))}}]);
//# sourceMappingURL=28.d45184f2.chunk.js.map