import fs from "node:fs";
import path from "node:path";


const ROOT = "_site";

function getAllPosts() {
  const files = fs.readdirSync(ROOT);
  return getPosts(ROOT, files);
}

function getPosts(root, files) {

  let posts = [];

  for (const file of files) {
    const relativePath = path.join(root, file);
    const stat = fs.statSync(relativePath);

    if (stat.isDirectory()) {
      const f = fs.readdirSync(relativePath);
      posts = posts.concat(getPosts(relativePath, f));
    } else {

      if (relativePath.match(/\.html$/g))
        posts.push(relativePath);
    }
  }

  return posts;
}

function toBriefPath(post) {
  let path = post;
  path = path.replace(/\.html$/, '').replace(`${ROOT}/`, '');

  return path;
}

export {getAllPosts, toBriefPath, ROOT};
