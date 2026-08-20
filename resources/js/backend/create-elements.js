function createEmptyComment() {
  return `
    <article class="empty-comment">
      <div class="empty-comment-body">
        <p>اولین نفری باشید که در این صفحه نظر می‌دهید</p>
      </div>
    </article>`;
}

function createComments(comments) {

  if (comments === null || comments.length === 0) return createEmptyComment();

  const allComments = comments.map(comment => {
    const name = comment.author?.login;
    const url = comment?.author?.url;
    const avatar = comment?.author?.avatarUrl;
    const date = new Date(comment?.createdAt).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric"

    });

    const dateTime = comment?.createdAt;

    const body = comment?.bodyHTML;

    return `
      <article class="comment">
        <header class="comment-header">
           <div class="author-info">
            <a class="author-url" href="${url} "target="_blank" rel="noopener noreferrer">
              <img class="author-avatar" src="${avatar}" alt="${name}" itemprop="image">
              <strong class="author-name" itemprop="name">${name}</strong>
            </a>
           </div>
           <time class="comment-date" datetime="${dateTime}">${date}</time>
        </header>
           <div class="comment-body" itemprop="text">
               ${body}
           </div>
      </article>`
  }).join("\n");

  const createdComments = `
    <div class="comments">
      ${allComments}
    </div>`

  return createdComments;
}

function createHead(pageInfo) {

  return `<head>
  ${createMetaElements(pageInfo)}\n
  ${createLinksAndScripts(pageInfo)}\n
  ${createPageSchema(pageInfo)}\n
  ${createBreadcrumbListSchema(pageInfo)}\n
  </head>`
}


function createBreadcrumbListSchema(pageInfo) {

  if (pageInfo.metadata.path.match(/^\/(post)\/.+\/.+(\.html)$/g) === null) return '';

  return `
<script type="application/ld+json">{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [${createItemListElements(pageInfo)}]
  }
  </script>`
}


function hasCoursePage(name) {
  const courseNames = ["java", "kotlin", "linux", "algorithm", "data-structure"];
  for (var i = 0; i < courseNames.length; i++) {
    if (name === courseNames[i])
      return true;
  }

  return false;
}

class ListItem {

  courses = new Map([["java", "جاوا"], ["kotlin", "کاتلین"], ["linux", "لینوکس"], ["algorithm", "الگوریتم"], ["data-structure", "ساختمان‌ داده"]]);

  constructor(name, path) {
    this.name = this.courses.get(name);
    this.path = path;
  }

}

function createItemListElements(pageInfo) {
  const path = pageInfo.metadata.path;

  const parentName = path.replace(/(^\/(post)\/)/g, '').replace(/\/[a-zA-Z\-\d]+(\.html)$/g, '');
  const parentPath = 'https://kodedevel.ir/' + parentName + '.html';

  const course = new ListItem(parentName, parentPath);

  if (hasCoursePage(parentName)) {
    return `
      {
        "@type": "ListItem",
        "name": "خانه",
        "item": "https://kodedevel.ir/",
        "position": 1
      },{
      "@type": "ListItem",
      "name": "${course.name}",
      "item": "${course.path}"
      "position": 2
      }
    }`;
  }
}


function createPageSchema(pageInfo) {
  const datePublished = new Date(Date.parse(pageInfo.metadata.datePublished)).toISOString();

  let lastModified = "";
  const rawLastModified = pageInfo.metadata.lastModified;

  if (rawLastModified && rawLastModified.length > 0)
    lastModified = new Date(Date.parse(pageInfo.metadata.lastModified)).toISOString();

  const title = pageInfo.metadata.title;
  const path = pageInfo.metadata.path;
  const description = pageInfo.metadata.description;
  const author = pageInfo.metadata.author;

  let imgCover = pageInfo.metadata.imgCover ? "https://kodedevel.ir" + pageInfo.metadata.imgCover : "";

  return `
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://kodedevel.ir${path}"
    },
    
    "headline": "${title}",
    "description": "${description}",
    "datePublished": "${datePublished}","dateModified": "${lastModified}","inLanguage": "fa-IR",

    "image": {
      "@type": "ImageObject",
      "url": "${imgCover}",
      "width": 1920,
      "height": 1080
    },
    "author": {
      "@type": "Person",
      "name": "${author}",
      "url": "https://github.com/kodedevel"
    },
    "publisher": {
      "@type": "Organization",
      "name": "KodeDevel",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kodedevel.ir/resources/favicon.png"
      },
      "sameAs": ["https://t.me/KodeDevel","https://t.me/KodeDevel_Chat","https://github.com/KodeDevel"] 
     }
    ${createCommentsSchema(pageInfo.comments)}

}
</script>`
}

function createCommentsSchema(comments) {

  if (!comments) return '';

  const schemaContent = comments.map(comment => {
    const name = comment.author?.login;
    const url = comment?.author?.url.trim();
    const avatar = comment?.author?.avatarUrl.trim();
    const date = comment?.createdAt;
    const text = comment.bodyHTML.replace(/<p.*?(?=>)>/i, "").replace(/<\/p.*?(?=>)>/i, "");

    return `{
      "@type": "Comment",
      "author": {
        "@type": "Person",
        "name": "${name}",
        "url": "${url}",
        "image": "${avatar}"
      },
      "datePublished": "${date}",
      "text": "${text}"
      }`
  });

  const schema = `,
    "comment": [
      ${schemaContent}
    ]`;

  return schema;
}

function createLinksAndScripts(pageInfo) {

  return `
    <link rel="canonical" href="https://kodedevel.ir${pageInfo.metadata.path}">
    <link rel="icon" type="image/png" sizes="512x512" href="/resources/favicon.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/resources/apple-touch-icon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link rel="dns-prefetch" href="//www.google-analytics.com">

    <link href="/resources/css/main.css" rel="stylesheet">
    <link href="/resources/favicon.png" rel="icon" type="image/x-icon">
    <script type="module" src="/resources/js/main.js"></script>`
}


function createMetaElements(pageInfo) {

  return `
    <meta content="${pageInfo.metadata.description}" name="description">
    <meta charset="UTF-8">
    <meta content="width:device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no" name="viewport">

    <title>${pageInfo.metadata.title}</title>

    <meta name="author" content="${pageInfo.metadata.author}">

    <meta property="og:title" content="${pageInfo.metadata.title}">
    <meta property="og:description" content="${pageInfo.metadata.description}">
    <meta property="og:image" content="https://kodedevel.ir/resources/favicon.png">
    <meta property="og:image:alt" content="${pageInfo.metadata.title}">
    <meta property="og:url" content="https://kodedevel.ir${pageInfo.metadata.path}">
    <meta property="og:locale" content="fa_IR">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="KodeDevel">

    <meta name="twitter:title" content="${pageInfo.metadata.title}">
    <meta name="twitter:description" content="${pageInfo.metadata.description}">
    <meta name="twitter:image" content="https://kodedevel.ir${pageInfo.metadata.imgCover}">
    <meta name="twitter:card" content="summary_large_image">`

}

export {createComments, createHead};
