(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[638],{1331:function(e,t,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/payment/success",function(){return s(8434)}])},3923:function(e,t,s){"use strict";s.d(t,{Hg:function(){return n},t2:function(){return o}});var c=s(7066);let a="https://j11a302.p.ssafy.io/api";async function o(e){try{let t=(await c.Z.post("".concat(a,"/auths/devices/sign-in"),{deviceOtp:e})).data;if(!t.success)return{valid:!1,products:[],storeName:"",accessToken:""};{let e=t.result.accessToken,s=t.result.storeName,a=t.result.productResponseList||[];return console.log("Authorization Token:",e),localStorage.setItem("accessToken",e),c.Z.defaults.headers.common.Authorization="Bearer ".concat(e),localStorage.setItem("products",JSON.stringify(a)),localStorage.setItem("storeName",s),{valid:!0,products:a,storeName:s,accessToken:e}}}catch(e){return console.error("상품 조회 API 요청 실패:",e),{valid:!1,products:[],storeName:"",accessToken:""}}}async function n(e,t,s){try{let o=localStorage.getItem("accessToken");if(!o){console.error("No access token found. Please log in again.");return}console.log("Sending payment data to backend..."),console.log("Order ID:",e),console.log("Total Price:",t),console.log("Payed Products:",s),console.log("Authorization Token:",o);let n=await c.Z.post("".concat(a,"/payments"),{paymentCreateRequestList:s.map(e=>({barcode:e.barcode,productName:e.productName,quantity:e.quantity,sellingPrice:e.sellingPrice})),orderId:e,totalPrice:t},{headers:{Authorization:"Bearer ".concat(o),"Content-Type":"application/json"}});console.log("Payment data sent successfully:",n.data)}catch(e){console.error("Failed to send payment data:",e)}}},8434:function(e,t,s){"use strict";s.r(t),s.d(t,{SuccessPage:function(){return l}});var c=s(5893),a=s(7294),o=s(1163),n=s(3923),r=s(6703),i=s.n(r);function l(){let e=(0,o.useRouter)(),{orderId:t,amount:s,paymentKey:r,products:l,totalPrice:u}=e.query,[d,p]=(0,a.useState)([]),[m,g]=(0,a.useState)(!1);return(0,a.useEffect)(()=>{let c={orderId:t,amount:s,paymentKey:r};async function a(){let t=await fetch("/confirm",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)}),s=await t.json();if(!t.ok){e.push("/payment/fail?message=".concat(s.message,"&code=").concat(s.code));return}console.log("결제가 성공적으로 확인되었습니다.")}t&&s&&r&&a(),l&&p(JSON.parse(decodeURIComponent(l)))},[t,s,r,l,e]),(0,a.useEffect)(()=>{if(d.length>0){let e={paymentCreateRequestList:d.map(e=>({barcode:e.barcode,productName:e.productName,quantity:e.quantity,sellingPrice:e.sellingPrice})),orderId:t,totalPrice:Number(u)};(0,n.Hg)(t,Number(u),e.paymentCreateRequestList).then(e=>{console.log("결제 정보가 백엔드에 성공적으로 전송되었습니다."),g(!0)}).catch(e=>{console.error("결제 정보 전송 중 오류 발생:",e)})}},[d,t,u]),(0,c.jsx)("div",{className:i().resultWrapper,children:(0,c.jsxs)("div",{className:i().boxSection,children:[(0,c.jsx)("img",{src:"/successPayment.png",alt:"결제 성공 이미지",className:i().successImage}),(0,c.jsx)("h2",{className:i().heading,children:"결제가 완료되었습니다."}),(0,c.jsx)("h2",{children:"구매 상품 목록"}),(0,c.jsxs)("div",{className:i().receipt,children:[(0,c.jsx)("ul",{className:i().productList,children:d.map((e,t)=>(0,c.jsxs)("li",{children:[e.productName," ",e.quantity,"개 - ",e.sellingPrice,"원"]},t))}),(0,c.jsx)("hr",{className:i().divider}),(0,c.jsx)("p",{className:i().totalPrice,children:"총 결제 금액: ".concat((e=>{let t=Number(e);return isNaN(t)?"0":t.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")})(u),"원")})]}),(0,c.jsx)("button",{className:i().mainButton,onClick:()=>e.push("/select"),children:"메인 페이지로 이동"})]})})}t.default=l},6703:function(e){e.exports={resultWrapper:"success_resultWrapper__3pahz",boxSection:"success_boxSection__l1kVt",successImage:"success_successImage__ya1LG",heading:"success_heading__JCvfQ",receipt:"success_receipt__gNHK1",productList:"success_productList__U_E1f",totalPrice:"success_totalPrice__n6Fi3",divider:"success_divider__pmMo3",mainButton:"success_mainButton__KsK9N"}}},function(e){e.O(0,[143,888,774,179],function(){return e(e.s=1331)}),_N_E=e.O()}]);