import fs from "node:fs";
import path from "node:path"
import {createComments, createEmptyComment, createHead} from "./create-elements.js";
import {getAllDiscussions} from "./comments.js";
import {getAllPosts, toBriefPath, ROOT} from "./file-utils.js";

async function mapComments() {

  const map = new Map();

  try {
    const posts = getAllPosts();

    const allDiscussions = await getAllDiscussions();

    for (let i = 0; i < posts.length; i++) {

      const post = posts[i];

      map.set(post, null);

      //e.g post/java/loops
      const briefPath = toBriefPath(post);

      for (const discussion of allDiscussions) {

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


const allComments = (async () => mapComments())();

async function injectComments() {

  allComments.forEach((comments, pageUrl) => {

    const createdComments = (!comments || comments.length === 0) ? createEmptyComment() : createComments(comments);


    if (createdComments) {
      let html = fs.readFileSync(pageUrl, "utf-8");
      html = html.replace(/(<giscus-widget.*)/i, (match) => `${createdComments}\n${match}`);
      fs.writeFileSync(pageUrl, html, "utf-8");

    }
  });

}

async function getPagesMetadata() {

  try {
    const response = await fetch(`${ROOT}/resources/json/list-posts.json`, {
      method: 'GET'
    });

    if (!response.ok) {
      const error = response.text();
      throw new Error(`HTTP ERROR ${response.status}: ${error}`);
    }

    const json = await response.json();

    return json;

  } catch (error) {
    console.error("Error: ", error);
    return null;
  }

}


async function injectHead() {

  try {

    const allPagesMetadata = await getPagesMetadata();

    allPagesMetadata.forEach(metadata => {

      const pagePath = path.join(ROOT, metadata.link);
      const html = fs.readFileSync(relativePath, "utf-8");
      const comments = allComments[pagePath];
      const head = createHead({metadata: metadata, comments: comments});

      html = html.replace(/(<html.*>)/i, match => {
        `${match}\n${head}`
      });

      fs.writeFileSync(pageUrl, html, "utf-8");

    });

  } catch (err) {
    console.error(err);
  }

}

(async () => {
  injectHead();
  injectComments();
})();
