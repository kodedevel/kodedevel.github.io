interface GitHubAuthor {
  login: string;
  url: string;
  avatarUrl: string;
}


interface GitHubSingleComment {
  bodyHTML: string;
  createdAt: string;
  author: GitHubAuthor | null;
}


interface GitHubDiscussion {
  id: string;
  title: string;
  comments: {
    nodes: GitHubSingleComment[];
  }
}


interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}


interface AllDiscussions {

  repository: {
    discussions: {
      pageInfo: PageInfo;
      nodes: GitHubDiscussion[]
    }
  }

}

interface GitHubGraphQLResponse<AllDiscussions> {
  data?: AllDiscussions;
  errors?: Array<{
    message: string;
    locations?: {line: number, column: number}[];
    path?: (string | number)[];
    extensions?: Record<string, unknown>;
  }>;
}

export {GitHubAuthor, GitHubSingleComment, GitHubDiscussion, PageInfo, AllDiscussions, GitHubGraphQLResponse};
