(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[761],{2705:function(t,e,n){var r=n(5639).Symbol;t.exports=r},4239:function(t,e,n){var r=n(2705),o=n(9607),c=n(2333),i=r?r.toStringTag:void 0;t.exports=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":i&&i in Object(t)?o(t):c(t)}},7561:function(t,e,n){var r=n(7990),o=/^\s+/;t.exports=function(t){return t?t.slice(0,r(t)+1).replace(o,""):t}},1957:function(t,e,n){var r="object"==typeof n.g&&n.g&&n.g.Object===Object&&n.g;t.exports=r},9607:function(t,e,n){var r=n(2705),o=Object.prototype,c=o.hasOwnProperty,i=o.toString,a=r?r.toStringTag:void 0;t.exports=function(t){var e=c.call(t,a),n=t[a];try{t[a]=void 0;var r=!0}catch(t){}var o=i.call(t);return r&&(e?t[a]=n:delete t[a]),o}},2333:function(t){var e=Object.prototype.toString;t.exports=function(t){return e.call(t)}},5639:function(t,e,n){var r=n(1957),o="object"==typeof self&&self&&self.Object===Object&&self,c=r||o||Function("return this")();t.exports=c},7990:function(t){var e=/\s/;t.exports=function(t){for(var n=t.length;n--&&e.test(t.charAt(n)););return n}},3279:function(t,e,n){var r=n(3218),o=n(7771),c=n(4841),i=Math.max,a=Math.min;t.exports=function(t,e,n){var u,s,l,f,d,p,v=0,m=!1,h=!1,b=!0;if("function"!=typeof t)throw TypeError("Expected a function");function g(e){var n=u,r=s;return u=s=void 0,v=e,f=t.apply(r,n)}function x(t){var n=t-p,r=t-v;return void 0===p||n>=e||n<0||h&&r>=l}function y(){var t,n,r,c=o();if(x(c))return j(c);d=setTimeout(y,(t=c-p,n=c-v,r=e-t,h?a(r,l-n):r))}function j(t){return(d=void 0,b&&u)?g(t):(u=s=void 0,f)}function _(){var t,n=o(),r=x(n);if(u=arguments,s=this,p=n,r){if(void 0===d)return v=t=p,d=setTimeout(y,e),m?g(t):f;if(h)return clearTimeout(d),d=setTimeout(y,e),g(p)}return void 0===d&&(d=setTimeout(y,e)),f}return e=c(e)||0,r(n)&&(m=!!n.leading,l=(h="maxWait"in n)?i(c(n.maxWait)||0,e):l,b="trailing"in n?!!n.trailing:b),_.cancel=function(){void 0!==d&&clearTimeout(d),v=0,u=p=s=d=void 0},_.flush=function(){return void 0===d?f:j(o())},_}},3218:function(t){t.exports=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}},7005:function(t){t.exports=function(t){return null!=t&&"object"==typeof t}},3448:function(t,e,n){var r=n(4239),o=n(7005);t.exports=function(t){return"symbol"==typeof t||o(t)&&"[object Symbol]"==r(t)}},7771:function(t,e,n){var r=n(5639);t.exports=function(){return r.Date.now()}},4841:function(t,e,n){var r=n(7561),o=n(3218),c=n(3448),i=0/0,a=/^[-+]0x[0-9a-f]+$/i,u=/^0b[01]+$/i,s=/^0o[0-7]+$/i,l=parseInt;t.exports=function(t){if("number"==typeof t)return t;if(c(t))return i;if(o(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=o(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=r(t);var n=u.test(t);return n||s.test(t)?l(t.slice(2),n?2:8):a.test(t)?i:+t}},7779:function(t,e,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/barcode",function(){return n(483)}])},483:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return l}});var r=n(5893),o=n(7294),c=n(1163),i=n(3279),a=n.n(i),u=n(2461),s=n.n(u);function l(){let t=(0,c.useRouter)(),[e,n]=(0,o.useState)(""),[i,u]=(0,o.useState)([]),[l,f]=(0,o.useState)([]),[d,p]=(0,o.useState)(0),[v,m]=(0,o.useState)(0),[h,b]=(0,o.useState)(!1);(0,o.useEffect)(()=>{console.log("scannedProducts 상태가 업데이트되었습니다:",l)},[l]),(0,o.useEffect)(()=>{t.query.products&&u(JSON.parse(t.query.products))},[t.query.products]);let g=t=>new Intl.NumberFormat("ko-KR").format(t),x=t=>{if(h)return;b(!0),console.log("fetchAndSetProducts 호출됨: ".concat(t));let e=i.find(e=>String(e.barcode)===String(t));e?(f(n=>{let r=n.find(e=>String(e.barcode)===String(t));if(r){console.log("기존 상품 수량 증가 직전: ".concat(r.productName,", 현재 수량: ").concat(r.quantity));let e=n.map(e=>e.barcode===t?{...e,quantity:e.quantity+1}:e);return console.log("업데이트된 상품 리스트:",e),b(!1),e}{console.log("새로운 상품 추가: ".concat(e.productName));let t=[...n,{...e,quantity:1}];return console.log("새로 추가된 상품 리스트:",t),b(!1),t}}),p(t=>t+(e.sellingPrice||0)),m(t=>t+1)):b(!1)};(0,o.useEffect)(()=>{let t=a()(t=>{console.log("RFID 인식된 바코드:",t),n(t),x(t)},300),e=window.electronAPI.onRFIDDetected(e=>{t(e)});return()=>{"function"==typeof e&&e()}},[i]);let y=t=>{f(e=>{let n=e.find(e=>String(e.barcode)===String(t));if(n){if(n.quantity>1){let r=e.map(e=>e.barcode===t?{...e,quantity:e.quantity-1}:e);return p(t=>t-(n.sellingPrice||0)),m(t=>t-1),r}{let r=e.filter(e=>e.barcode!==t);return p(t=>t-(n.sellingPrice||0)),m(t=>t-1),r}}return e})};return(0,r.jsxs)("div",{className:s().pageContainer,children:[(0,r.jsx)("header",{className:s().header,children:(0,r.jsx)("h2",{children:"매장 이름"})}),(0,r.jsx)("hr",{className:s().divider}),(0,r.jsx)("div",{className:s().productsContainer,children:l.map((t,e)=>(0,r.jsxs)("div",{className:"".concat(s().product," ").concat(e%2==0?s().evenProduct:s().oddProduct),children:[(0,r.jsx)("img",{src:"/".concat(t.barcode,".jpg"),alt:t.productName,className:s().productImg}),(0,r.jsxs)("span",{children:[t.productName," & ",t.barcode]}),(0,r.jsxs)("div",{className:s().quantity,children:[(0,r.jsx)("button",{onClick:()=>y(t.barcode),children:"−"}),(0,r.jsx)("label",{children:t.quantity})," ",(0,r.jsx)("button",{onClick:()=>x(t.barcode),children:"+"})]}),(0,r.jsxs)("label",{className:s().price,children:[g((t.sellingPrice||0)*t.quantity)," 원"]})]},t.productId))}),(0,r.jsxs)("div",{className:s().summary,children:[(0,r.jsxs)("div",{className:s().totalQuantity,children:["총 수량: ",v,"개"]}),(0,r.jsxs)("div",{className:s().totalPrice,children:["총 결제금액: ",g(d),"원"]})]}),(0,r.jsxs)("div",{className:s().checkoutFooter,children:[(0,r.jsx)("button",{onClick:()=>{t.push("/select")},className:s().cancelBtn,children:"주문 취소"}),(0,r.jsx)("button",{onClick:()=>{let e={products:encodeURIComponent(JSON.stringify(l)),totalPrice:d};t.push({pathname:"/payment/checkout",query:e})},className:s().checkoutBtn,children:"결제하기"})]})]})}},2461:function(t){t.exports={container:"rfid_container__G3ien",beforeScan:"rfid_beforeScan__LgcHY",cartContainer:"rfid_cartContainer___8_YB",cartImage:"rfid_cartImage__ghV8x",product:"rfid_product__3RcJV",addToCart:"rfid_addToCart__WIpoN"}},1163:function(t,e,n){t.exports=n(9090)}},function(t){t.O(0,[888,774,179],function(){return t(t.s=7779)}),_N_E=t.O()}]);