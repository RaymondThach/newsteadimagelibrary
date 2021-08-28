/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMediaFile = /* GraphQL */ `
  mutation CreateMediaFile(
    $input: CreateMediaFileInput!
    $condition: ModelMediaFileConditionInput
  ) {
    createMediaFile(input: $input, condition: $condition) {
      id
      name
      description
      tag {
        id
        categoryName
        createdAt
        updatedAt
      }
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
export const updateMediaFile = /* GraphQL */ `
  mutation UpdateMediaFile(
    $input: UpdateMediaFileInput!
    $condition: ModelMediaFileConditionInput
  ) {
    updateMediaFile(input: $input, condition: $condition) {
      id
      name
      description
      tag {
        id
        categoryName
        createdAt
        updatedAt
      }
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
export const deleteMediaFile = /* GraphQL */ `
  mutation DeleteMediaFile(
    $input: DeleteMediaFileInput!
    $condition: ModelMediaFileConditionInput
  ) {
    deleteMediaFile(input: $input, condition: $condition) {
      id
      name
      description
      tag {
        id
        categoryName
        createdAt
        updatedAt
      }
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
export const createCollection = /* GraphQL */ `
  mutation CreateCollection(
    $input: CreateCollectionInput!
    $condition: ModelCollectionConditionInput
  ) {
    createCollection(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const updateCollection = /* GraphQL */ `
  mutation UpdateCollection(
    $input: UpdateCollectionInput!
    $condition: ModelCollectionConditionInput
  ) {
    updateCollection(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const deleteCollection = /* GraphQL */ `
  mutation DeleteCollection(
    $input: DeleteCollectionInput!
    $condition: ModelCollectionConditionInput
  ) {
    deleteCollection(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const createTag = /* GraphQL */ `
  mutation CreateTag(
    $input: CreateTagInput!
    $condition: ModelTagConditionInput
  ) {
    createTag(input: $input, condition: $condition) {
      id
      categoryName
      createdAt
      updatedAt
    }
  }
`;
export const updateTag = /* GraphQL */ `
  mutation UpdateTag(
    $input: UpdateTagInput!
    $condition: ModelTagConditionInput
  ) {
    updateTag(input: $input, condition: $condition) {
      id
      categoryName
      createdAt
      updatedAt
    }
  }
`;
export const deleteTag = /* GraphQL */ `
  mutation DeleteTag(
    $input: DeleteTagInput!
    $condition: ModelTagConditionInput
  ) {
    deleteTag(input: $input, condition: $condition) {
      id
      categoryName
      createdAt
      updatedAt
    }
  }
`;
