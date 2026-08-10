<div dir="rtl" class="font-family: Samim;">
<p align="center">
    <a href="https://kodedevel.github.io">
        <img width="200" height="200" src="https://kodedevel.github.io/resources/favicon.png"/>
    </a>
</p>

<h3 align="center">KodeDevel</h3>


<div align="center">

*صفحات وب آموزش برنامه نویسی KodeDevel به صورت متن باز*

*<a href="https://github.com/kodedevel/kodedevel.github.io">سورس کد</a>*

*<a href="https://kodedevel.ir">ادرس سایت</a>*

</div>


### توضیحات
این سایت در صفحات گیت با jekyll کامپایل شده و در دسترس قرار میگیره و آدرس سایت در بالا گفته شده است.

#### لینک فایل های Json
<div dir="ltr">

https://kodedevel.github.io/resources/json/list-posts.json    

### نقشه ی سایت

ابتدا سایت با jekyll کامپایل میشه و سپس صفحات کامپایل شده سرو روی شبکه سرو میشن:

1- _data/json: داده های مورد نیاز برای ساخت صفحات در اینجا قرار دارن

2- _includes: اجزای صفحات (مثل هدر، فوتر، دیالوگ و..) داخل این بخش نوشته شدن و هنگام کامپایل توسط Jekyll به صفحات اضافه میشن.

3- _layouts: قالب کلی صفحات داخل این بخش نوشته شدن و سپس محتوای صفحات، هنگام کامپایل توسط Jekyll داخل قالب ها قرار میگیرن.

4- post: محتوای صفحات سایت در اینجا نوشته میشن

5- resources: منابع مورد نیاز کلاینت از قبیل فایل های css, js, image و ... در اینجا قرار دارن

6- index.html: صفحه ی اول سایت


<br/>

<div dir="ltr">

```text
kodedevel.github.io/
│
│
├── _data/
│   └── json/
│       ├── post/
│       │    └── (subject)*.json
│       │
│       ├── category.json
│       └── root.json
│
├── _includes/
│   ├── article-foot.html
│   ├── article-head.html
│   ├── category-foot.html
│   ├── category-head.html
│   ├── dialog.html
│   ├── footer.html
│   ├── head.html
│   ├── header.html 
│   ├── nosidebar-header.html
│   └── sidebar.html
│
│
├── _layouts/
│   ├── category.html
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
│   │   └── ui.js
│   │
│   └──json/
│      └── list-posts.json
│
│
└── index.html
```
</div>


<div>

*ارتباط با ما*

<a href="https://t.me/skybirdbits">تلگرام</a>


*گروه و کانال تلگرام*

<a href="https://t.me/kodedevel_chat">گروه تلگرام</a> <a href="https://t.me/kodedevel">کانال تلگرام</a>


</div>

</div>
