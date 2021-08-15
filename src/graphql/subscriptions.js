/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMediaFile = /* GraphQL */ `
  subscription OnCreateMediaFile {
    onCreateMediaFile {
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
export const onUpdateMediaFile = /* GraphQL */ `
  subscription OnUpdateMediaFile {
    onUpdateMediaFile {
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
export const onDeleteMediaFile = /* GraphQL */ `
  subscription OnDeleteMediaFile {
    onDeleteMediaFile {
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
