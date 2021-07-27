/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMediaFile = /* GraphQL */ `
  query GetMediaFile($id: ID!) {
    getMediaFile(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const listMediaFiles = /* GraphQL */ `
  query ListMediaFiles(
    $filter: ModelMediaFileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMediaFiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
