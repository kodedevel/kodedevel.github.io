import fs from "node:fs"
import path from "node:path"

const TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'kodedevel';
const REPO = 'kodedevel.github.io';


const POST_BASE_PATH = '_site/post';


const variables = {
  owner: OWNER,
  repo: REPO
}
const query = `
  query getComments($owner: String!, $repo: String!){

    repository(owner: $owner, name: $repo){
      discussions(first: 100){
        nodes{
          id
          title
          comments(first: 100){
            nodes{
              bodyHTML
              createdAt
              author{
                login
                url
                avatarUrl
              }
            }
          }
        }
      }
    }
  }`

function createComments(comments) {

  if (!comments || comments.length == 0)
    return `<article class="comment" itemscope itemtype="https://schema.org/Comment">
              <div class="comment-body" itemprop="text">
                 <p>کامنتی وجود ندارد</p>
               </div>
            </article>`;

  const pageComments = comments.map(comment => {
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
      <article class="comment" itemscope itemtype="https://schema.org/Comment">
        <header class="comment-header">
           <div itemprop="author" itemscope itemtype="https://schema.org/Person">
            <div class="author-info">
              <a class="author-url" itemprop="url" href="${url} "target="_blank" rel="noopener noreferrer">
                <img class="author-avatar" src="${avatar}" itemprop="avatar">
                <strong class="author-name" itemprop="name">${name}</strong>
              </a>
            </div>
            <div> 
              <time itemprop="datePublished" datetime="${dateTime}">${date}</time>
            </div>
           </div>
        </header>
           <div class="comment-body" itemprop="text">
               ${body}
           </div>
      </article>`

  }).join("\n");

  return pageComments;
}

function getPosts(p, files) {

  const posts = [];


  for (const file of files) {
    const relativePath = path.join(p, file);
    const stat = fs.statSync(relativePath);

    if (stat.isDirectory()) {
      const f = fs.readdirSync(relativePath);
      const c = getPosts(relativePath, f);
      for (const post of c)
        posts.push(post);
    } else {
      posts.push(relativePath);
    }
  }

  return posts;
}

function toBriefPath(post) {
  let path = post;
  path = path.replace(/\.html$/, '').replace("_site/", '');

  return path;
}

async function matchComments() {

  const map = new Map();

  try {
    const files = fs.readdirSync(POST_BASE_PATH);
    const posts = getPosts(POST_BASE_PATH, files);

    const data = await graphql(query, variables);
    console.log("data successfully fetched!")
    const discussions = data?.repository?.discussions?.nodes;


    for (let i = 0; i < posts.length; i++) {

      const post = posts[i];
      //e.g post/java/loops
      const briefPath = toBriefPath(post);

      map.set(post, null);

      for (const discussion of discussions) {

        const discussionPath = discussion.title;

        if (briefPath == discussionPath) {
          const comments = discussion?.comments.nodes;
          map.set(post, comments);
          break;
        }
      }

    }
  } catch (err) {
    console.error(err);
  }

  return map;
}

async function graphql(query, variables) {

  const response = await fetch("https://api.github.com/graphql", {

    method: "POST",
    headers: {
      "Authorization": `bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "Comments"
    },
    body: JSON.stringify({query: query, variables: variables})
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ERROR ${response.status}: ${error}`);
  }


  const json = await response.json();

  if (json.errors) {
    console.error("GraphQL query errors: ", json.errors);
    throw new Error("Failed to fetch data from github");
  }

  return json.data;
}

async function run() {

  const map = await matchComments();

  //value: comments key: pageUrl
  map.forEach((comments, pageUrl) => {

    let html = fs.readFileSync(pageUrl, "utf-8");

    const createdComments = createComments(comments);

    if (createdComments) {
      html = html.replace(/(<div class="giscus"[^>]*>)/i, (match) => `${createdComments}\n${match}`);
      fs.writeFileSync(pageUrl, html, "utf-8");
    }
  })

}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
