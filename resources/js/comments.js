import fs from 'node:fs';
import path from 'node:path';
import {graphql} from '@octokit/graphql';


const OWNER = "kodedevel";
const REPO = "kodedevel.github.io";
const CATEGORY_ID = "DIC_kwDOPuPkF84DDOgs";
const SITE_DIR = "_site";

const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  console.log("No GITHUB_TOKEN found! Skipping lazy comment initialization.")
  process.exit(0);
}

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${TOKEN}`
  }
});


async function fetchAllDiscussions() {

  let allDiscussions = [];
  let hasNextPage = true;
  let cursor = null;

  console.log("Downloading discussions from github... ");

  while (hasNextPage) {

    const result = await graphqlWithAuth(`
      query($owner: String!, $name: String!, $categoryId: ID!, $after: String){
        repository(owner: $owner, name: $name){
          discussions(categoryId: $categoryId, first: 50, after: $after){
            pageInfo{
              hasNextPage
              endCursor
            }
            nodes{
              title
              comments(first: 100){
                nodes{
                bodyHTML
                createdAt
                author{
                  login
                  url
                }
              }
            }
          }
        }
      }
    }
      `,
      {
        owner: OWNER,
        name: REPO,
        categoryId: CATEGORY_ID,
        after: cursor
      });

    const discussions = result.repository.discussions;
    allDiscussions = allDiscussions.concat(discussions.nodes);

    hasNextPage = discussions.pageInfo.hasNextPage;
    cursor = discussions.pageInfo.endCursor;
  }

  return allDiscussions;
}


function normalizePath(input) {
  return input.replace(/^\/+/, '').replace(/\/$/, '').replace(/\/index$/, '');
}

function createStaticComments(comments) {

  if (!comments || comments.length === 0) return '';


  return comments.map(comment => {

    const authName = comment.author ? comment.author.login : 'Anonymous';
    const authURL = comment.author ? comment.author.url : '#';
    const date = new Date(comment.createdAt).toLocaleDateString("fa-IR", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const dateTime = comment.createdAt;

    const body = comment.bodyHTML;

    return `
      <article class="static-comment" itemscope itemtype="https://schema.org/Comment">
        <header class="static-comment-header">
           <span itemprop="author" itemscope itemtype="https://schema.org/Person">
              <a itemprop="url"  href="${authURL} "target="_blank" rel="noopener noreferrer">
                <strong itemprop="name">${authName}</strong>
              </a>
           </span>
           <time itemprop="datePublished" datetime="${dateTime}">${date}</time>
        </header>
           <div class="static-comment-body" itemprop="text">
               ${body}
           </div>
      </article>`;

  }).join('\n');

}

function walkDirectory(dir, callback) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkDirectory(fullPath, callback);
    } else if (file.endsWith('.html')) {
      callback(fullPath)
    }
  });
}


async function initStaticComments() {
  const discussions = await fetchAllDiscussions();

  console.log(`${discussions.length} discussions found.`);

  const commentsMap = new Map();

  discussions.forEach(discussion => {
    const key = normalizePath(discussion.title);
    commentsMap.set(key, discussion.comments.nodes);
  });


  walkDirectory(SITE_DIR, filePath => {
    let html = fs.readFileSync(filePath, "utf8");

    let pagePath = filePath
      .replace(SITE_DIR, '')
      .replace(/\\/g, '/')
      .replace(/\/index\.html$/, '/')
      .replace(/\.html$/, '');

    pagePath = normalizePath(pagePath);

    const comments = commentsMap.get(pagePath) || [];
    const staticComments = createStaticComments(comments);

    if (staticComments) {
      html = html.replace(/(<div class="giscus"[^>]*>)/i, (match) => `${staticComments}\n${match}`);
      fs.writeFileSync(filePath, html);
      console.log(`${comments.length} injected into ${pagePath}`);
    }
  });

  console.log("injection finished");

}

initStaticComments().catch(err => {
  console.error(err);
  process.exit(1)
});


