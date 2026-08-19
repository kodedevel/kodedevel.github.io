const TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'kodedevel';
const REPO = 'kodedevel.github.io';
const CATEGORY_ID = "DIC_kwDOPuPkF84DDOgs";

const query = `
  query getComments($owner: String!, $repo: String!, $categoryId: ID!, $after: String){

    repository(owner: $owner, name: $repo){
      discussions(first: 100, categoryId: $categoryId, after: $after){
        pageInfo{
          hasNextPage
          endCursor
        }
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
  }`;


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

async function getAllDiscussions() {

  let allDiscussions = [];
  let hasNextPage = true;
  let cursor = null;

  while (hasNextPage) {

    const data = await graphql(query, {
      owner: OWNER,
      repo: REPO,
      categoryId: CATEGORY_ID,
      after: cursor
    });

    const pageInfo = data?.repository?.discussions?.pageInfo;
    hasNextPage = pageInfo?.hasNextPage;
    cursor = pageInfo?.endCursor;
    const discussions = data?.repository?.discussions.nodes;
    allDiscussions = allDiscussions.concat(discussions);

  }
  console.log("data successfully fetched!")

  return allDiscussions;
}



export {getAllDiscussions}
