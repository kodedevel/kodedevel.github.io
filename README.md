<div align="center" dir="rtl">

<a target="_blank" href="https://kodedevel.ir">
  <img src="https://kodedevel.ir/resources/favicon.png" alt="آموزش برنامه نویسی KodeDevel" width="240" height="240">
</a>

# KodeDevel

[![HTML](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Jekyll](https://img.shields.io/badge/Jekyll-CC0000?style=for-the-badge&logo=jekyll&logoColor=white)](https://jekyllrb.com/)
[![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white)](https://www.json.org/json-en.html)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

*صفحات وبسایت آموزش برنامه نویسی KodeDevel*

**<a  href="https://github.com/kodedevel/kodedevel.github.io">سورس کد</a>**

**<a target="_blank" href="https://kodedevel.ir">ادرس سایت</a>**

</div>

<div dir="rtl">

## توضیحات
این سایت در صفحات گیت با jekyll کامپایل شده و در دسترس قرار گرفته.

### metadata صفحات

metadata صفحات داخل یک فایل به نام json قرار گرفته که به رندر شدن صفحات کمک میکنه.

**[لینک metadata صفحات](https://kodedevel.ir/resources/json/metadata.json)**

### نقشه ی سایت

ابتدا سایت با *jekyll* کامپایل میشه و سپس صفحات کامپایل شده روی شبکه سرو میشن و در نهایت بعضی از عناصر (کامنت ها، عنصر head و ...) با Node.js در `resources/js/backend` به صفحات تزریق میشن.


`_data/json` داده های مورد نیاز برای ساخت صفحات در اینجا قرار دارن

`_includes` اجزای صفحات (مثل هدر، فوتر، دیالوگ و...) داخل این بخش نوشته شدن و هنگام کامپایل توسط Jekyll به صفحات اضافه میشن.

`_layouts` قالب کلی صفحات داخل این بخش نوشته شدن و سپس محتوای صفحات، هنگام کامپایل توسط Jekyll داخل قالب ها قرار میگیرن.

`post` محتوای صفحات سایت در اینجا نوشته میشن

`resources` منابع مورد نیاز کلاینت از قبیل فایل های css, js, image و ... در اینجا قرار دارن

`index.html` صفحه ی اول سایت

---

<pre dir="ltr">

github.com/kodedevel/kodedevel.github.io/
│
│
├── _data/
│   └── json/
│       ├── post/
│       │    └── (subjects)*.json
│       │
│       ├── course.json
│       └── root.json
│
├── _includes/
│   ├── article-foot.html
│   ├── article-head.html
│   ├── course-foot.html
│   ├── course-head.html
│   ├── dialog.html
│   ├── footer.html
│   ├── comment.html
│   ├── header.html  
│   └── sidebar.html
│
│
├── _layouts/
│   ├── course.html
│   └── default.html
│    
│
│
├── post/
│   ├── (pages)*.html   
│   │
├── resources/
│   ├── css/
│   │   ├── article.css
│   │   ├── base.css
│   │   ├── main.css
│   │   ├── learn.css
│   │   ├── layouts.css
│   │   ├── bt.css
│   │   ├── text.css
│   │   └── utils.css
│   │
│   ├── image/
│   │   └── (images)* 
│   │      
│   ├── js/
│   │   ├── article.js
│   │   ├── base.js
│   │   ├── index.js
│   │   ├── main.js
│   │   ├── seo-config.js
│   │   │── ui.js
│   │   └── backend/
│   │      │── comments.js
│   │      │── create-elements.js
│   │      └── inject.js
│   │
│   └──json/
│      └── metadata.json
│
│
└── index.html

</pre>

---

</div>

<div align="center" dir="rtl">

**<a target="_blank" href="https://t.me/skybirdbits">ارتباط با ما</a>**

**<a target="_blank" href="https://t.me/kodedevel">کانال تلگرام</a>**

</div>
