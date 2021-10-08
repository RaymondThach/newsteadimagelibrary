/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTag = /* GraphQL */ `
  query GetTag($id: ID!) {
    getTag(id: $id) {
      id
      categoryName
      createdAt
      updatedAt
    }
  }
`;
export const listTags = /* GraphQL */ `
  query ListTags(
    $filter: ModelTagFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTags(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        categoryName
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const tagByCatName = /* GraphQL */ `
  query TagByCatName(
    $categoryName: String
    $sortDirection: ModelSortDirection
    $filter: ModelTagFilterInput
    $limit: Int
    $nextToken: String
  ) {
    tagByCatName(
      categoryName: $categoryName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        categoryName
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMediaFile = /* GraphQL */ `
  query GetMediaFile($id: ID!) {
    getMediaFile(id: $id) {
      id
      name
      description
      tags
      collection
      favourite
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
        tags
        collection
        favourite
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
export const fileName = /* GraphQL */ `
  query FileName(
    $name: String
    $sortDirection: ModelSortDirection
    $filter: ModelMediaFileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    fileName(
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        description
        tags
        collection
        favourite
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
export const collectionName = /* GraphQL */ `
  query CollectionName(
    $name: String
    $sortDirection: ModelSortDirection
    $filter: ModelCollectionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    collectionName(
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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