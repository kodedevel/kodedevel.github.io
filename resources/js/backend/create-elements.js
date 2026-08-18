function createEmptyComment() {
  return `
    <article class="empty-comment">
      <div class="empty-comment-body">
        <p>اولین نفری باشید که در مورد این پست نظر می‌دهید</p>
      </div>
    </article>`;
}

function createComments(comments) {

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

function createCommentsSchema(comments) {

  const schemaContent = comments.map(comment => {
    const name = comment.author?.login;
    const url = comment?.author?.url.trim();
    const avatar = comment?.author?.avatarUrl.trim();
    const date = comment?.createdAt;
    const text = comment.bodyHTML.replace(/<p.*?(?=>)>/i, "").replace(/<\/p.*?(?=>)>/i, "");

    return `
      {
        "@type": "Comment",
        "author": {
          "@type": "Person",
          "name": "${name}",
          "url": "${url}",
          "image": "${avatar}"
        },
        "datePublished": "${date}",
        "text": "${text}"
      }
      `
  });

  const schema = `
    "comment": [
      ${schemaContent}
    ]`;

  return schema;
}


function createHead(pageInfo) {
  return `
  <head>
  ${createMetaElments(pageInfo)}\n
  ${createLinksAndScripts(pageInfo)}\n
  ${createPageSchema(pageInfo, comments)}\n
  ${createBreadcrumbListSchema(pageInfo)}\n
  </head>`
}


function createBreadcrumbListSchema(pageInfo) {

  return `
<script type="application/ld+json">{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [${createItemListElements(pageInfo)}]
  }
  </script>`
}

function createItemListElements(pageInfo) {
  const link = pageInfo.metadata.link;


  if (link.match(/^\/[a-zA-Z]+(\.html)$/g)) {
    return `
    {
      "@type": "ListItem",
      "position": 1,
      "name": "خانه",
      "item": "https://kodedevel.ir${link}"
    }`
  } else if (link.match(/^\/[a-zA-Z]+\/[a-zA-Z]+.html$/g)) {
    return `
    {
      "@type": "ListItem",
      "position": 1,
      "name": "خانه",
      "item": "https://kodedevel.ir"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "${pageInfo.metadata.title}",
      "item": "https://kodedevel.ir${link}"
    }`
  } else {
    const parentLink = link.replace(/(^\/[a-zA-Z]+\/)/g, '').replace(/(\/[a-zA-Z]+\.html$)/g, '.html');
    return `
    {
      "@type": "ListItem",
      "position": 1,
      "name": "خانه",
      "item": "https://kodedevel.ir"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": "https://kodedevel.ir${parentLink}"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "${pageInfo.metadata.title}",
      "item": "https://kodedevel.ir${link}"
    }`
  }

}

function createPageSchema(pageInfo) {

  const commentsSchema = createCommentsSchema(pageInfo.comments);

  return `
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://kodedevel.ir${pageInfo.metadata.link}"
    },
    
    "headline": "${pageInfo.metadata.title}",
    "description": "${pageInfo.metadata.description}",
    "datePublished": "2025-09-12","dateModified": "2026-07-30","inLanguage": "fa-IR",

    "image": {
      "@type": "ImageObject",
      "url": "https://kodedevel.ir${pageInfo.metadata.imgCover}",
      "width": 1920,
      "height": 1080
    },
    "author": {
      "@type": "Person",
      "name": "${pageInfo.author}",
      "url": "https://kodedevel.ir/about.html"
    },
    "publisher": {
      "@type": "Organization",
      "name": "KodeDevel",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kodedevel.ir/resources/favicon.png"
      },
      "sameAs": ["https://t.me/KodeDevel","https://t.me/KodeDevel_Chat","https://github.com/KodeDevel"] 
     },
    ${commentsSchema}

}
</script>`

}


function createLinksAndScripts(pageInfo) {

  return `
    <link rel="canonical" href="https://kodedevel.ir${pageInfo.metadata.link}">
    <link rel="icon" type="image/png" sizes="512x512" href="/resources/favicon.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/resources/apple-touch-icon.png">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link rel="dns-prefetch" href="//www.google-analytics.com">

    <link href="/resources/css/main.css" rel="stylesheet">
    <link href="/resources/favicon.png" rel="icon" type="image/x-icon">
    <script type="module" src="/resources/js/main.js"></script>`
}


function createMetaElments(pageInfo) {

  return `
  <meta content="${pageInfo.description}" name="description">
  <meta charset="UTF-8">
  <meta content="width:device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no" name="viewport">

  <title>${pageInfo.title}</title>

  <meta name="author" content="${pageInfo.metadata.author}">

  <meta property="og:title" content="${pageInfo.metadata.title}">
  <meta property="og:description" content="${pageInfo.metadata.description}">
  <meta property="og:image" content="https://kodedevel.ir/resources/favicon.png">
  <meta property="og:image:alt" content="${pageInfo.metadata.title}">
  <meta property="og:url" content="https://kodedevel.ir${pageInfo.metadata.link}">
  <meta property="og:locale" content="fa_IR">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="KodeDevel">

  <meta name="twitter:title" content="${pageInfo.metadata.title}">
  <meta name="twitter:description" content="${pageInfo.metadata.description}">
  <meta name="twitter:image" content="https://kodedevel.ir${pageInfo.metadata.imgCover}">
  <meta name="twitter:card" content="summary_large_image">`

}

export {createComments, createEmptyComment, createCommentsSchema, createHead};
