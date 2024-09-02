# Frontend Readme file

#### **Task**
 
	**Web app**
		PWA를 활용하여 모바일 기기에도 적합하게 볼 수 있도록
		1차 목표 : 스마트폰 / Web (Web이 아이패드도 커버칠 수 있게?)
	**refactoring**
		스파게티 코드로 얽혀있는 코드를 객체 분리
	**real-time Rendering for user**
		각 행동이 자연스럽게 이어진다.
	**ServerSide Rendering**
		SSR을 활용하여 로딩 시간 단축(현재는 사용X, user/id 부분에서 미리 SSR하는 방법 고려)
	**Version Upgrade**
		현재 Next 12 version, 이를 14 version으로 Upgrade


```
wms-front
├─ .github
│  └─ workflows
│     └─ main.yml
├─ .gitignore
├─ .npmrc
├─ .prettierignore
├─ CHANGELOG.md
├─ components
│  ├─ Badge
│  │  └─ Badge.js
│  ├─ Card
│  │  ├─ Card.js
│  │  ├─ CardBody.js
│  │  ├─ CardFooter.js
│  │  ├─ CardHeader.js
│  │  └─ CardSelect.js
│  ├─ Clearfix
│  │  └─ Clearfix.js
│  ├─ CustomButtons
│  │  └─ Button.js
│  ├─ CustomDropdown
│  │  └─ CustomDropdown.js
│  ├─ CustomInput
│  │  └─ CustomInput.js
│  ├─ CustomLinearProgress
│  │  └─ CustomLinearProgress.js
│  ├─ CustomTabs
│  │  └─ CustomTabs.js
│  ├─ Footer
│  │  └─ Footer.js
│  ├─ Grid
│  │  ├─ GridContainer.js
│  │  └─ GridItem.js
│  ├─ Header
│  │  ├─ BusinessHeaderLinks.js
│  │  ├─ Header.js
│  │  ├─ HeaderLinks.js
│  │  ├─ HomeHeader.js
│  │  ├─ HomeHeaderLinks.js
│  │  ├─ LogInHomeHeaderLinks.js
│  │  ├─ SelectHeader.jsx
│  │  ├─ SelectHeaderLinks.js
│  │  ├─ UserHeader.jsx
│  │  └─ UserHeaderLinks.js
│  ├─ InfoArea
│  │  └─ InfoArea.js
│  ├─ LineCreate.jsx
│  ├─ Main
│  │  ├─ HowToUse1.jsx
│  │  ├─ HowToUse2.jsx
│  │  ├─ HowToUse3.jsx
│  │  ├─ HowToUse4.jsx
│  │  ├─ HowToUse5.jsx
│  │  ├─ HowToUseStart.jsx
│  │  ├─ MainEnd.jsx
│  │  ├─ ServiceInfo1.jsx
│  │  ├─ ServiceInfo2.jsx
│  │  └─ ServiceInfo3.jsx
│  ├─ MyPage
│  │  ├─ Alarm.jsx
│  │  ├─ EditInfo.jsx
│  │  ├─ Info.jsx
│  │  ├─ ManageBusiness.jsx
│  │  ├─ ManageEmployees.jsx
│  │  └─ SubInfo.jsx
│  ├─ NavPills
│  │  └─ NavPills.js
│  ├─ PageChange
│  │  └─ PageChange.js
│  ├─ Pagination
│  │  └─ Pagination.js
│  ├─ Parallax
│  │  ├─ Parallax.js
│  │  └─ ParallaxUser.js
│  ├─ Snackbar
│  │  └─ SnackbarContent.js
│  ├─ Test
│  │  ├─ constants.jsx
│  │  ├─ hansonStyle.js
│  │  └─ hooksCallbacks.jsx
│  └─ Typography
│     ├─ Danger.js
│     ├─ Info.js
│     ├─ Muted.js
│     ├─ Primary.js
│     ├─ Quote.js
│     ├─ Small.js
│     ├─ Success.js
│     └─ Warning.js
├─ context
│  └─ AuthContext.js
├─ Dockerfile
├─ Documentation
│  ├─ assets
│  │  ├─ css
│  │  │  ├─ bootstrap.min.css
│  │  │  ├─ demo-documentation.css
│  │  │  └─ material-dashboard.css
│  │  ├─ img
│  │  │  ├─ apple-icon.png
│  │  │  ├─ cover.jpeg
│  │  │  ├─ faces
│  │  │  │  └─ marc.jpg
│  │  │  ├─ favicon.png
│  │  │  ├─ mask.png
│  │  │  ├─ new_logo.png
│  │  │  ├─ reactlogo.png
│  │  │  ├─ sidebar-1.jpg
│  │  │  ├─ sidebar-2.jpg
│  │  │  ├─ sidebar-3.jpg
│  │  │  ├─ sidebar-4.jpg
│  │  │  ├─ tim_80x80.png
│  │  │  └─ WareHouseWallpaper.png
│  │  └─ js
│  │     ├─ bootstrap.min.js
│  │     └─ jquery-3.2.1.min.js
│  └─ tutorial-components.html
├─ ISSUE_TEMPLATE.md
├─ LICENSE.md
├─ next.config.js
├─ package.json
├─ pages
│  ├─ 404.js
│  ├─ api
│  │  ├─ index.js
│  │  ├─ load-json.js
│  │  ├─ load-map.js
│  │  ├─ save-json.js
│  │  └─ save-map.js
│  ├─ components.jsx
│  ├─ index.js
│  ├─ mypage.jsx
│  ├─ oauth
│  │  └─ callback.jsx
│  ├─ payment.jsx
│  ├─ serviceInfo3.jsx
│  ├─ signIn.jsx
│  ├─ signup.jsx
│  ├─ user
│  │  ├─ select.jsx
│  │  └─ [id].jsx
│  ├─ _app.js
│  ├─ _document.js
│  └─ _error.js
├─ pages-sections
│  └─ Components-Sections
│     ├─ MyContainerMap.jsx
│     ├─ MyContainerNavigation.jsx
│     └─ MyContainerProduct.jsx
├─ public
│  ├─ excel
│  │  ├─ Presidents.xlsx
│  │  └─ Uniqlo.xlsx
│  ├─ img
│  │  ├─ apple-icon.png
│  │  ├─ bg.jpg
│  │  ├─ bg2.jpg
│  │  ├─ bg3.jpg
│  │  ├─ bg4.jpg
│  │  ├─ bg7.jpg
│  │  ├─ box.png
│  │  ├─ brickCursor.cur
│  │  ├─ delete.png
│  │  ├─ examples
│  │  │  ├─ clem-onojegaw.jpg
│  │  │  ├─ clem-onojeghuo.jpg
│  │  │  ├─ cynthia-del-rio.jpg
│  │  │  ├─ mariya-georgieva.jpg
│  │  │  ├─ olu-eletu.jpg
│  │  │  ├─ studio-1.jpg
│  │  │  ├─ studio-2.jpg
│  │  │  ├─ studio-3.jpg
│  │  │  ├─ studio-4.jpg
│  │  │  └─ studio-5.jpg
│  │  ├─ faces
│  │  │  ├─ avatar.jpg
│  │  │  ├─ camp.jpg
│  │  │  ├─ card-profile1-square.jpg
│  │  │  ├─ card-profile2-square.jpg
│  │  │  ├─ card-profile4-square.jpg
│  │  │  ├─ card-profile5-square.jpg
│  │  │  ├─ card-profile6-square.jpg
│  │  │  ├─ christian.jpg
│  │  │  ├─ kendall.jpg
│  │  │  └─ marc.jpg
│  │  ├─ favicon.png
│  │  ├─ google.png
│  │  ├─ kakao-sign-in.png
│  │  ├─ kakao.png
│  │  ├─ landing-bg.jpg
│  │  ├─ landing.jpg
│  │  ├─ location.png
│  │  ├─ loginLogo.png
│  │  ├─ logo.png
│  │  ├─ logo1.png
│  │  ├─ mailIcon.png
│  │  ├─ mailIconBk.png
│  │  ├─ main1.jpg
│  │  ├─ main2.jpg
│  │  ├─ main3.jpg
│  │  ├─ mainInfo1.png
│  │  ├─ naver-sign-in.png
│  │  ├─ naver.png
│  │  ├─ nextjs_header.jpg
│  │  ├─ notification.png
│  │  ├─ profile-bg.jpg
│  │  ├─ profile.jpg
│  │  ├─ sign.jpg
│  │  ├─ sub1.jpg
│  │  ├─ sub2.jpg
│  │  ├─ subscribe.jpg
│  │  ├─ warehouse1.png
│  │  ├─ warehouse2.png
│  │  ├─ warehouse3.png
│  │  └─ WareHouseWallpaper.png
│  ├─ json
│  │  └─ tableDataTest.json
│  ├─ map
│  │  └─ rectangles.json
│  └─ video
│     ├─ import.mp4
│     ├─ location.mp4
│     ├─ wall.mp4
│     └─ warehouse1.mp4
├─ README.md
├─ styles
│  ├─ css
│  │  └─ material-kit-react.css.map
│  ├─ globals.css
│  ├─ jss
│  │  ├─ nextjs-material-kit
│  │  │  ├─ components
│  │  │  │  ├─ badgeStyle.js
│  │  │  │  ├─ buttonStyle.js
│  │  │  │  ├─ cardBodyStyle.js
│  │  │  │  ├─ cardFooterStyle.js
│  │  │  │  ├─ cardHeaderStyle.js
│  │  │  │  ├─ cardStyle.js
│  │  │  │  ├─ cardWarehouse.js
│  │  │  │  ├─ customDropdownStyle.js
│  │  │  │  ├─ customInputStyle.js
│  │  │  │  ├─ customLinearProgressStyle.js
│  │  │  │  ├─ customTabsStyle.js
│  │  │  │  ├─ footerStyle.js
│  │  │  │  ├─ headerLinksStyle.js
│  │  │  │  ├─ headerStyle.js
│  │  │  │  ├─ infoStyle.js
│  │  │  │  ├─ navPillsStyle.js
│  │  │  │  ├─ paginationStyle.js
│  │  │  │  ├─ parallaxStyle.js
│  │  │  │  ├─ parallaxUserStyle.js
│  │  │  │  ├─ selectHeaderStyle.js
│  │  │  │  ├─ snackbarContentStyle.js
│  │  │  │  ├─ typographyStyle.js
│  │  │  │  ├─ userHeaderLinksStyle.js
│  │  │  │  └─ userHeaderStyle.js
│  │  │  ├─ effect
│  │  │  │  ├─ customCheckboxRadioSwitch.js
│  │  │  │  ├─ imagesStyles.js
│  │  │  │  ├─ modalStyle.js
│  │  │  │  ├─ popoverStyles.js
│  │  │  │  └─ tooltipsStyle.js
│  │  │  └─ pages
│  │  │     ├─ components.js
│  │  │     ├─ componentsSections
│  │  │     │  ├─ detailStyle.js
│  │  │     │  ├─ editInfoStyle.js
│  │  │     │  ├─ howToUseStartStyle.js
│  │  │     │  ├─ howToUseStyle.js
│  │  │     │  ├─ infoStyle.js
│  │  │     │  ├─ loginStyle.js
│  │  │     │  ├─ mainEndStyle.js
│  │  │     │  ├─ manageBusinessStyle.js
│  │  │     │  ├─ manageEmployeesStyle.js
│  │  │     │  ├─ MyContainerProductStyle.jsx
│  │  │     │  ├─ MyContainerStyle.jsx
│  │  │     │  ├─ mypageStyle.js
│  │  │     │  ├─ notificationsStyles.js
│  │  │     │  ├─ selectStyle.js
│  │  │     │  ├─ serviceInfo1Style.js
│  │  │     │  ├─ serviceInfo2Style.js
│  │  │     │  ├─ serviceInfo3Style.js
│  │  │     │  ├─ signupStyle.js
│  │  │     │  ├─ subInfoStyle.js
│  │  │     │  └─ subStyle.js
│  │  │     ├─ loginPage.js
│  │  │     ├─ profilePage.js
│  │  │     ├─ selectPage.js
│  │  │     └─ users.js
│  │  └─ nextjs-material-kit.js
│  └─ scss
│     ├─ core
│     │  ├─ mixins
│     │  │  └─ _colored-shadows.scss
│     │  ├─ variables
│     │  │  ├─ _bootstrap-material-design-base.scss
│     │  │  ├─ _bootstrap-material-design.scss
│     │  │  ├─ _brand.scss
│     │  │  ├─ _colors-map.scss
│     │  │  ├─ _colors.scss
│     │  │  ├─ _functions.scss
│     │  │  ├─ _shadow.scss
│     │  │  └─ _variables.scss
│     │  ├─ _misc.scss
│     │  ├─ _mixins.scss
│     │  ├─ _page-transition.scss
│     │  └─ _variables.scss
│     ├─ nextjs-material-kit.scss
│     └─ plugins
│        ├─ _plugin-nouislider.scss
│        ├─ _plugin-react-datetime.scss
│        └─ _plugin-react-slick.scss
├─ utils
│  └─ responseHandler.js
└─ _middleware.js

```