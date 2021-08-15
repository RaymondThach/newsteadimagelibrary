/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMediaFile = /* GraphQL */ `
  query GetMediaFile($id: ID!) {
    getMediaFile(id: $id) {
      id
      name
      description
      file {
        bucket
        region
        key
      }
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
        file {
          bucket
          region
          key
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCollection = /* GraphQL */ `
  query GetCollection($id: ID!) {
    getCollection(id: $id) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const listCollections = /* GraphQL */ `
  query ListCollections(
    $filter: ModelCollectionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCollections(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;


