/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTag = /* GraphQL */ `
  subscription OnCreateTag {
    onCreateTag {
      id
      categoryName
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTag = /* GraphQL */ `
  subscription OnUpdateTag {
    onUpdateTag {
      id
      categoryName
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTag = /* GraphQL */ `
  subscription OnDeleteTag {
    onDeleteTag {
      id
      categoryName
      createdAt
      updatedAt
    }
  }
`;
export const onCreateMediaFile = /* GraphQL */ `
  subscription OnCreateMediaFile {
    onCreateMediaFile {
      id
      name
      description
      tags
      collection
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
export const onUpdateMediaFile = /* GraphQL */ `
  subscription OnUpdateMediaFile {
    onUpdateMediaFile {
      id
      name
      description
      tags
      collection
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
export const onDeleteMediaFile = /* GraphQL */ `
  subscription OnDeleteMediaFile {
    onDeleteMediaFile {
      id
      name
      description
      tags
      collection
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
export const onCreateCollection = /* GraphQL */ `
  subscription OnCreateCollection {
    onCreateCollection {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateCollection = /* GraphQL */ `
  subscription OnUpdateCollection {
    onUpdateCollection {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteCollection = /* GraphQL */ `
  subscription OnDeleteCollection {
    onDeleteCollection {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
