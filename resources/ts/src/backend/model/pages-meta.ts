import { GitHubSingleComment } from "./github-discussion";


interface Meta{
  title?: string;
  author?: string;
  description?: string;
  datePublished?: string;
  lastModified?: string;
  imgCover?: string;
  path?: string;
}

interface CourseMeta extends Meta{
  metadata_list: Meta[];
}


interface AllMeta {
  home: Meta,
  about: Meta,
  courses: CourseMeta[]
}

class PageInfo {
  comments: GitHubSingleComment[];
  metadata: Meta;

  constructor(metadata: Meta, comments: GitHubSingleComment[]) {
    this.metadata = metadata;
    this.comments = comments;
  }
}

export {Meta, CourseMeta, AllMeta, PageInfo};
