if(!self.define){let e,i={};const s=(s,a)=>(s=new URL(s+".js",a).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(a,c)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(i[n])return;let r={};const d=e=>s(e,n),t={module:{uri:n},exports:r,require:d};i[n]=Promise.all(a.map((e=>t[e]||d(e)))).then((e=>(c(...e),r)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/-v6e0v3oaKV-bJo8TiAAI/_buildManifest.js",revision:"a5398bdbc9ac6f74565f37fb67258579"},{url:"/_next/static/-v6e0v3oaKV-bJo8TiAAI/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/23.9ce49aa38ca4d19d.js",revision:"9ce49aa38ca4d19d"},{url:"/_next/static/chunks/281-afffbcc1802ce898.js",revision:"afffbcc1802ce898"},{url:"/_next/static/chunks/293-41ec6dd8a56fb741.js",revision:"41ec6dd8a56fb741"},{url:"/_next/static/chunks/471-735c54bf5710fe6b.js",revision:"735c54bf5710fe6b"},{url:"/_next/static/chunks/506-777fa887340a2655.js",revision:"777fa887340a2655"},{url:"/_next/static/chunks/540.ce8bd512925c4518.js",revision:"ce8bd512925c4518"},{url:"/_next/static/chunks/641.6dacda2749f4289c.js",revision:"6dacda2749f4289c"},{url:"/_next/static/chunks/642-2dddb0709425123a.js",revision:"2dddb0709425123a"},{url:"/_next/static/chunks/646-b73ed74db6e3e74d.js",revision:"b73ed74db6e3e74d"},{url:"/_next/static/chunks/67.e08979e95a4fadf1.js",revision:"e08979e95a4fadf1"},{url:"/_next/static/chunks/674.e8646d429ee377d6.js",revision:"e8646d429ee377d6"},{url:"/_next/static/chunks/674a26a7.3b0f4b20ff2c2997.js",revision:"3b0f4b20ff2c2997"},{url:"/_next/static/chunks/684.45602c50b7bb05b0.js",revision:"45602c50b7bb05b0"},{url:"/_next/static/chunks/908.f0c93761668bc12d.js",revision:"f0c93761668bc12d"},{url:"/_next/static/chunks/94c5bee4.21b3e3b52920a531.js",revision:"21b3e3b52920a531"},{url:"/_next/static/chunks/955-22d15cda3941b6c0.js",revision:"22d15cda3941b6c0"},{url:"/_next/static/chunks/cf70ba6d.190bea300e519126.js",revision:"190bea300e519126"},{url:"/_next/static/chunks/d93df0d5.e7e9e56046d95a49.js",revision:"e7e9e56046d95a49"},{url:"/_next/static/chunks/ee8b1517.ab408eed1369375d.js",revision:"ab408eed1369375d"},{url:"/_next/static/chunks/framework-e952fed463eb8e34.js",revision:"e952fed463eb8e34"},{url:"/_next/static/chunks/main-8531663f7daa9006.js",revision:"8531663f7daa9006"},{url:"/_next/static/chunks/pages/404-45dd98d3aada3521.js",revision:"45dd98d3aada3521"},{url:"/_next/static/chunks/pages/_app-9e548f87a22b3688.js",revision:"9e548f87a22b3688"},{url:"/_next/static/chunks/pages/_error-530b458855f02f29.js",revision:"530b458855f02f29"},{url:"/_next/static/chunks/pages/components-932ae52c22c86a62.js",revision:"932ae52c22c86a62"},{url:"/_next/static/chunks/pages/index-d604e0489952c55d.js",revision:"d604e0489952c55d"},{url:"/_next/static/chunks/pages/mypage-d2a6fbbea7c59eab.js",revision:"d2a6fbbea7c59eab"},{url:"/_next/static/chunks/pages/oauth/callback-cc84d9b3720c39d8.js",revision:"cc84d9b3720c39d8"},{url:"/_next/static/chunks/pages/payment-b3d49d706d85d195.js",revision:"b3d49d706d85d195"},{url:"/_next/static/chunks/pages/serviceInfo3-728d6ff38efc6dce.js",revision:"728d6ff38efc6dce"},{url:"/_next/static/chunks/pages/signIn-829aed8edaed2f3b.js",revision:"829aed8edaed2f3b"},{url:"/_next/static/chunks/pages/signup-61d9a783bd353cdc.js",revision:"61d9a783bd353cdc"},{url:"/_next/static/chunks/pages/user/%5Bid%5D-848d0df22243f811.js",revision:"848d0df22243f811"},{url:"/_next/static/chunks/pages/user/select-126ee2e0bf40a2f9.js",revision:"126ee2e0bf40a2f9"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-fe4edfb2739504bc.js",revision:"fe4edfb2739504bc"},{url:"/_next/static/css/0d8c5db2eff585d0.css",revision:"0d8c5db2eff585d0"},{url:"/_next/static/css/69f81e06845cd7ae.css",revision:"69f81e06845cd7ae"},{url:"/_next/static/css/6cad800d5a68bf19.css",revision:"6cad800d5a68bf19"},{url:"/excel/Presidents.xlsx",revision:"d3e9d3fb651614a44aa526843f86f11d"},{url:"/excel/Uniqlo.xlsx",revision:"3124375401d2335837e05cf303493394"},{url:"/icons/icon512_maskable.png",revision:"fd141c68c2fee2c4b4253cc26cbcb14d"},{url:"/icons/icon512_rounded.png",revision:"95d0c6bb723d64e59093c9292e26083f"},{url:"/img/WareHouseWallpaper.png",revision:"0be165436f0e806d2ffffc26121e8451"},{url:"/img/apple-icon.png",revision:"173d66da760349a1a276b211e974e5b6"},{url:"/img/bg.jpg",revision:"e52419719dd0c4c8b172136f0b625008"},{url:"/img/bg2.jpg",revision:"843781834b1db2908f08d921c6460c81"},{url:"/img/bg3.jpg",revision:"e76de24b6d8ab5e920bb4d49241ad15f"},{url:"/img/bg4.jpg",revision:"199e9ec14308832c6a8a49bd96c1fde6"},{url:"/img/bg7.jpg",revision:"b08234a2b7e8e4fb2e3c4e713252021c"},{url:"/img/box.png",revision:"5c5a91a038ef2e2f79619b582690b55e"},{url:"/img/brickCursor.cur",revision:"332dede86444aefbde3327dce3744880"},{url:"/img/delete.png",revision:"cef05ab1d8ed66aabc905d7feea80387"},{url:"/img/examples/clem-onojegaw.jpg",revision:"c058841b1dd64e5f79c6348b24cfb78d"},{url:"/img/examples/clem-onojeghuo.jpg",revision:"216ef03c54bc13771c5e1b8d8f8d5926"},{url:"/img/examples/cynthia-del-rio.jpg",revision:"9813593cc577a319a2201342ef0fb237"},{url:"/img/examples/mariya-georgieva.jpg",revision:"4575c40bfb8dec6713d2da51c4c4066e"},{url:"/img/examples/olu-eletu.jpg",revision:"4112cbc1477d9e149033c5df66087e16"},{url:"/img/examples/studio-1.jpg",revision:"ae0150c08dbcc95e4f50458e02e5bd5c"},{url:"/img/examples/studio-2.jpg",revision:"76e2987ed95634136dd22d4d9e1009a7"},{url:"/img/examples/studio-3.jpg",revision:"1d5451ced89eabb55683e27e070bdb60"},{url:"/img/examples/studio-4.jpg",revision:"e064d0908dbd53b55f8980c02b3748bb"},{url:"/img/examples/studio-5.jpg",revision:"ef5c30ea69b7ad740ee6221782c73741"},{url:"/img/faces/avatar.jpg",revision:"f1d71f777331fd7e3de116edf4ee3b67"},{url:"/img/faces/camp.jpg",revision:"9cf5e86c61632a693ec3cacd6968e168"},{url:"/img/faces/card-profile1-square.jpg",revision:"63ca893bd4080f5d51e9ea2ba6395ccf"},{url:"/img/faces/card-profile2-square.jpg",revision:"a038f38f2152f9db5c8522a4721e4c8d"},{url:"/img/faces/card-profile4-square.jpg",revision:"0db68e27d944c1426ab17bcf24f99e89"},{url:"/img/faces/card-profile5-square.jpg",revision:"963e83931f298beec44405b39c09d70a"},{url:"/img/faces/card-profile6-square.jpg",revision:"ed99fa181a303f3e4f88172338ba3d7b"},{url:"/img/faces/christian.jpg",revision:"56633ed3f62f39d71f571374a6409e65"},{url:"/img/faces/kendall.jpg",revision:"e0508cc923eb0b5e68ca6783c53d0f1d"},{url:"/img/faces/marc.jpg",revision:"394bb8ec2379be4a242158d5b8a3362f"},{url:"/img/favicon.png",revision:"8fd18845fb63d7c0167363428add7ace"},{url:"/img/google.png",revision:"b134917acd7c1b01b56ae00d27831fa2"},{url:"/img/kakao-sign-in.png",revision:"01783a8c428ad51ab74f959abe8a2380"},{url:"/img/kakao.png",revision:"b194c20ba19fbe312fda734910ee6119"},{url:"/img/landing-bg.jpg",revision:"df8fd3efcd662b64b44de07f351c838b"},{url:"/img/landing.jpg",revision:"08e18cb904f0f3c6dd9e3d4ed72e0eca"},{url:"/img/location.png",revision:"3365298d195eb3924ebc052d56b5493c"},{url:"/img/loginLogo.png",revision:"4642014e59345ceeb6e8063135b6ce9f"},{url:"/img/logo.png",revision:"0371a755c63f5cc5776d9d881c24a635"},{url:"/img/logo1.png",revision:"441bcdcb5326e7167e6f7f8fed41a80e"},{url:"/img/mailIcon.png",revision:"a90c5261af3231afb2b5ab9e9816523b"},{url:"/img/mailIconBk.png",revision:"e4547b68bc37359bb2759dc9c767efcc"},{url:"/img/main1.jpg",revision:"7ea62deb3073218a46dfd877ec150043"},{url:"/img/main2.jpg",revision:"20c49a41cd1e9dc4cac2ca6c5a3813cc"},{url:"/img/main3.jpg",revision:"ca6979bd298809fe77e5caa30051c0b0"},{url:"/img/mainInfo1.png",revision:"a6a561a03e695c3e3f0960dc77b9b21d"},{url:"/img/naver-sign-in.png",revision:"3ee72298e79dff060b6d4628bcbaf788"},{url:"/img/naver.png",revision:"84149d0d1f64fa76b234fb4152c158a4"},{url:"/img/nextjs_header.jpg",revision:"5b5bdd5947add66de4b99db16abe8b22"},{url:"/img/notification.png",revision:"368f4d39b0d06d3bd25ba5ea162154f4"},{url:"/img/profile-bg.jpg",revision:"baf6b40a654b078399e93e3d9cb6d455"},{url:"/img/profile.jpg",revision:"090a5aabae505f67ee0981613d02ee05"},{url:"/img/sign.jpg",revision:"cf8b686b294041d0925f4e745b1fabb9"},{url:"/img/sub1.jpg",revision:"7fe3b12cd7c185cd755d4e03048b16b4"},{url:"/img/sub2.jpg",revision:"dea165ad961e886148e26e1e82729ded"},{url:"/img/subscribe.jpg",revision:"6049a252aebd94ad4a2d155fe2b6e778"},{url:"/img/warehouse1.png",revision:"a89df64adee3bfb5988812260b2645d8"},{url:"/img/warehouse2.png",revision:"831e5bd9f2ef3417c98831cb35bf56b3"},{url:"/img/warehouse3.png",revision:"64c73607e2313e772ced063296c13a3d"},{url:"/json/tableDataTest.json",revision:"ff1bbab138bf367216e939f09ddf573c"},{url:"/manifest.json",revision:"c6542b0d69e3e8ce5cbdfc7156fecc0a"},{url:"/map/rectangles.json",revision:"f0ba06d42a0756aa1bf423008925f95c"},{url:"/video/import.mp4",revision:"efda0a653e869e9befcf90b4b9230587"},{url:"/video/location.mp4",revision:"7026dfb135dcda8f2f3c30fd29ae2403"},{url:"/video/wall.mp4",revision:"10b20cb1ba965096a3f29303843a23fe"},{url:"/video/warehouse1.mp4",revision:"12686daa91a2f0b0b490e6644b74a0bf"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:i,event:s,state:a})=>i&&"opaqueredirect"===i.type?new Response(i.body,{status:200,statusText:"OK",headers:i.headers}):i}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const i=e.pathname;return!i.startsWith("/api/auth/")&&!!i.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
