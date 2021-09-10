import React from "react";
import "./UploadFile.css";

import { Storage, API, graphqlOperation } from "aws-amplify";
import { createMediaFile } from "../../graphql/mutations";
import awsExports from "../../aws-exports.js";
import Select from "react-select";
import { fileName } from "../../graphql/queries";
import ProgressBar from "react-bootstrap/ProgressBar";

let tagOptions = [];
let collectionOptions = [];
let selectedCollection = [];

class UploadMediaFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploads: [],
      fileName: [],
      descriptions: [],
      categories: [],
      list: [],
      successs: [],
      file: [],
      tags: [],
      collectionList: [],
      collection: [],
      progressBar: 0,
      progress: 0,
      mediaFiles: [],
    };
  }

  // grab the list of available categories
  fetchNames /*GraphQl*/ = `query MyQuery {
    listTags {
      items {
        categoryName
      }
    }
  }
  `;
  // grab the list of available collections
  fetchCollectionNames /*GraphQl*/ = `query CollectionQuery {
        listCollections {
        items {
        name
            }
        }
    }
    `;
  /***********************************************************************************
   *
   * TEST BUTTON
   *
   */
  addForm() {
    
    console.log(this.state.collection);
   
    console.log(this.state.collection[0]);
    console.log(this.state.collection[1]);
    console.log(this.state.collection[2]);
    

 

  }

  /**********************************************************************************/

  //grab dropdown box selection

  dropdownHandler = (e, index) => {
    const selectedStrings = e.map((obj) => obj.value);
    console.log("test" + selectedStrings);
    this.state.categories[index] = selectedStrings;
    console.log(selectedStrings);
    this.setState({ categories: this.state.categories});

    
  };

  //grab dropdown box selection for collections

  collectionDropdownHandler = (e, index) => {

    this.state.collection[index] = e
    
    this.setState({collection: this.state.collection})


    /*e.map((obj,i)=>
      selectedCollection.push({
        value: obj.value,
        label: obj.value
      })

    )*/
    console.log(e)
    console.log(selectedCollection)
    console.log(tagOptions)
    
    /*selectedCollection.push(e)
    console.log(selectedCollection)
    const x = e.map((obj) => obj.value);
    this.state.collection[index] = x;
    console.log(this.state.collection[index]);
    this.setState({ collection: x});*/
  };

 

  //Handles user text input changes for file names

  async handleFileNameChange(e, index) {
    this.state.fileName[index] = e.target.value;
    this.setState({ fileName: this.state.fileName });
  }

  //Handles user text input changes

  handleChange(e, index) {
    this.state.descriptions[index] = e.target.value;
    this.setState({ descriptions: this.state.descriptions });
  }

  // Removes Upload form

  handleRemove(index) {

    

    this.state.collection.splice(index, 1)
    this.state.categories.splice(index, 1);


    
    
    this.state.uploads.splice(index, 1);
    
    this.state.descriptions.splice(index, 1);
    this.state.fileName.splice(index,1);
    this.state.file.splice(index,1);
 

    this.setState({ collection: this.state.collection });
    this.setState({ categories: this.state.categories });

    this.setState({ uploads: this.state.uploads });
    this.setState({ file: this.state.file });
    this.setState({ descriptions: this.state.descriptions });
    this.setState({ fileName: this.state.fileName });

  
    //console.log(this.state.file[0].name)
    
  }

  //remove all file details after submit

  reset() {
    this.setState({ uploads: [] });
    this.setState({ file: [] });
    this.setState({ descriptions: [] });
    this.setState({ categories: [] });
    this.uploadInput.files = null;
  }

  // add data into db related to upload
  addFileToDB = async (mediaFile) => {
    console.log("Adding file to DB");
    try {
      await API.graphql(
        graphqlOperation(createMediaFile, { input: mediaFile })
      );
      console.log("file added to database");
    } catch (error) {
      console.log("DB Error " + error);
    }
  };

  //Submission handling to S3 and dynamodb
  handleSubmit = async (e) => {
    //let files = this.state.list

    for (var i = 0; i < this.state.file.length; i++) {
      var fileExt = this.state.file[i].name.split(".").pop();

      const newFileName = {
        name: this.state.fileName[i] + "." + fileExt,
      };

      //let files = this.uploadInput.files[1]

      //console.log(files.name)
      const mediaFile = {
        name: this.state.fileName[i] + "." + fileExt,
        description: this.state.descriptions[i],
        tags: this.state.categories[i],
        collection: this.state.collection[i],

        file: {
          bucket: awsExports.aws_user_files_s3_bucket,
          region: awsExports.aws_user_files_s3_bucket_region,
          key: "public/" + this.state.fileName[i] + "." + fileExt,
        },
      };
      //this.setState({mediaFiles: [...this.state.mediaFiles, mediaFile]})
      try {
        const arrResult = await API.graphql(
          graphqlOperation(fileName, newFileName)
        );
        if (
          arrResult.data.fileName.items.length === 0 ||
          this.state.fileName[i] == undefined
        ) {
          if (
            this.state.fileName.length === 0 ||
            this.state.fileName[i] == undefined
          ) {
            alert("Please enter a file name for file #" + [i + 1]);
            if (this.state.categories.length === 0) {
              alert("Please assign at least one category for file #" +[i+1]);
            }
          } else {
            try {
              this.setState({ uploads: [...this.state.uploads, mediaFile] });
              //Uploads image to S3 bucket

              await Storage.put(
                this.state.fileName[i] + "." + fileExt,
                this.state.file[i],
                {
                  contentType: "media",
                  progressCallback: (progress) => {
                    this.setState({
                      progressBar: Math.round(
                        (100 * progress.loaded) / progress.total
                      ),
                    });
                    //console.log(`${progress.loaded}/${progress.total}`)
                    //this.setState({})
                  },
                }
              ).then((result) => {
                console.log(
                  "Uploading " +
                    this.state.fileName[i] +
                    "." +
                    fileExt +
                    " to s3"
                );

                this.addFileToDB(this.state.uploads[i]);
                if (
                  !alert && i === this.state.file.length(
                    this.state.file.length + " files uploaded successfully"
                  )
                ) {
                  //window.location.reload();
                }
              });
            } catch (error) {
              console.log("Error uploading file: ", error);
            }
          }
        } else {
          alert(
            this.state.fileName[i] +
              "." +
              fileExt +
              " already exist. Please enter a different name"
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  //Handle file uploads from upload button

  handleFile = (e) => {
    let fileNames = this.uploadInput.files;
    //let files  = e.target.files
    //console.log(files)
    Array.from(fileNames).forEach((file) => {
      let newFile = fileNames.name;
      this.setState({ list: [...this.state.list, newFile] });
    });
    this.setState({ file: [...this.state.file, ...e.target.files] });
  };

  // Fetch category names for dropdown selection
  async fetchCategory() {
    console.log("fetching category names");

    const results = await API.graphql(graphqlOperation(this.fetchNames));
    this.setState({ tags: results.data.listTags.items });

    this.state.tags.map((listname, i) =>
      tagOptions.push({
        value: listname.categoryName,
        label: listname.categoryName,
      })
    );
  }

  // Fetch category names for dropdown selection
  async fetchCollection() {
    console.log("fetching collection names");

    const results = await API.graphql(
      graphqlOperation(this.fetchCollectionNames)
    );
    this.setState({ collectionList: results.data.listCollections.items });

    this.state.collectionList.map((listname, i) =>
      collectionOptions.push({ value: listname.name, label: listname.name })
    );
  }

  componentDidMount() {
    this.fetchCategory();
    this.fetchCollection();
  }

  render() {
    return (
      <div className="main-content">
        <h1>Upload Files</h1>
        <hr />

        {this.state.file.map((f, index) => {
          return (
            <div key={index}>
              {console.log(index)}
              <div class="thumbnail">
                <img src={URL.createObjectURL(this.state.file[index])} />
              </div>

              <input
                onChange={(e) => this.handleFileNameChange(e, index)}
                value={this.state.fileName[index]}
              />
              <input
                onChange={(e) => this.handleChange(e, index)}
                value={this.state.descriptions[index]}
              />
              <button onClick={() => this.handleRemove(index)}>Remove</button>
             
              <Select
                isMulti
                name="Category"
                options={tagOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(e) => this.dropdownHandler(e, index)}
              />
              {
                
              }
              
              <Select
                isMulti
                name="Collection"
                value={this.state.collection[index]}
                options={collectionOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(e) => this.collectionDropdownHandler(e, index)}
                cache={false}
              />

              <ProgressBar
                now={this.state.progressBar}
                label={`${this.state.progressBar}%`}
              />
              <hr />
            </div>
          );
        })}
        <input
          type="file"
          onChange={this.handleFile}
          multiple
          ref={(ref) => {
            this.uploadInput = ref;
          }}
        />
        <hr />
        <button onClick={(e) => this.addForm(e)}>TEST BUTTON</button>
        <hr />
        <button onClick={(e) => this.handleSubmit(e)}>Submit</button>
      </div>
    );
  }
}

export default UploadMediaFile;
