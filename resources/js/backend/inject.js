import fs from "node:fs";
import path from "node:path"
import {createComments, createHead} from "./create-elements.js";
import {getAllDiscussions} from "./comments.js";

const ROOT = "_site";

function toRelativePath(briefPath) {
  return "\/" + briefPath.concat(".html");
}

async function getAllComments() {

  const map = new Map();

  try {

    const allPagesMetadata = await getAllPagesMetadata();
    const allDiscussions = await getAllDiscussions();

    allPagesMetadata.forEach(metadata => {

      const postPath = metadata.path;
      map.set(postPath, null);

      allDiscussions.forEach(discussion => {

        const discussionPath = toRelativePath(discussion.title);

        if (postPath === discussionPath) {
          const comments = discussion?.comments.nodes;
          map.set(postPath, comments);
        }

      });
    });

  } catch (err) {
    console.error(err);
  }

  return map;
}

async function injectComments(allComments) {

  allComments.forEach((comments, pagePath) => {

    const relativePath = pagePath === '/' ? '/index.html' : pagePath;
    const absolutePath = ROOT + relativePath;

    const createdComments = createComments(comments);

    if (createdComments) {
      let html = fs.readFileSync(absolutePath, "utf-8");
      html = html.replace(/(<giscus-widget.*)/i, (match) => `${createdComments}\n${match}`);
      fs.writeFileSync(absolutePath, html, "utf-8");

    }
  });

}

async function getAllPagesMetadata() {


  let allPagesMetadata = [];

  try {
    const response = await fetch(new URL("/resources/json/metadata.json", "https://kodedevel.ir"), {
      method: 'GET'
    });

    if (!response.ok) {
      const error = response.text();
      throw new Error(`HTTP ERROR ${response.status}: ${error}`);
    }

    const result = await response.json();

    allPagesMetadata.push(result.home);
    allPagesMetadata.push(result.about);

    const courses = result.courses;

    courses.forEach(course => {

      if (course.path) {
        allPagesMetadata.push({
          title: course.title,
          author: course.author,
          description: course.description,
          datePublished: course.datePublished,
          lastModified: course.lastModified,
          imgCover: course.imgCover,
          path: course.path
        });
      }

      const posts = course.metadata_list;
      allPagesMetadata = allPagesMetadata.concat(posts);

    });
    return allPagesMetadata;

  } catch (error) {
    console.error("Error: ", error);
    return null;
  }

}


class PageInfo {
  constructor(metadata, comments) {
    this.metadata = metadata;
    this.comments = comments;
  }
}

async function injectHead(allComments) {

  try {

    const allPagesMetadata = await getAllPagesMetadata();

    if (!allPagesMetadata) return;

    allPagesMetadata.forEach(metadata => {

      let pageFullPath = metadata.path === '/' ? path.join(ROOT, metadata.path, 'index.html') : path.join(ROOT, metadata.path);

      let html = fs.readFileSync(pageFullPath, "utf-8");
      const comments = allComments.get(metadata.path);
      const head = createHead(new PageInfo(metadata, comments));

      html = html.replace(/(<html.*>)/i, match => `${match}\n${head}`);

      fs.writeFileSync(pageFullPath, html, "utf-8");
    });


  } catch (err) {
    console.error(err);
  }

}

async function main() {

  const allComments = await getAllComments();

  injectHead(allComments);
  injectComments(allComments);

}


main().catch(console.error);
