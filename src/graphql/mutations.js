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
      createdAt
      updatedAt
    }
  }
`;
