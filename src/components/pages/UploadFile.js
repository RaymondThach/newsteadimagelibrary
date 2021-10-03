/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable no-loop-func */
import React from "react";
import "./UploadFile.css";
import { Storage, API, graphqlOperation } from "aws-amplify";
import { createMediaFile } from "../../graphql/mutations";
import awsExports from "../../aws-exports.js";
import Select from "react-select";
import { fileName } from "../../graphql/queries";
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsCloudUpload } from "react-icons/bs";

let tagOptions = [];
let collectionOptions = [];




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
      progressBar: [],
      progress: [],
      mediaFiles: [],
      selectedCollection: [],
      selectedCategories: [],
      error: 0,
      count: 0
    };
  }

  /**
   *
   * GraphQl Query - grab the list of available categories
   *
   * **/
  fetchNames /*GraphQl*/ = `query MyQuery {
    listTags {
      items {
        categoryName
      }
    }
  }
  `;

  /**
   *
   * GraphQL Query - grab the list of available collections
   *
   **/
  fetchCollectionNames /*GraphQl*/ = `query CollectionQuery {
        listCollections {
        items {
        name
            }
        }
    }
    `;

  /*****
   *
   * Grab dropdown box selection
   *
   *******/
  dropdownHandler = (e, index) => {
    this.state.categories[index] = e;


    //to keep dropdown box with latest selected labels and values
    this.setState({ categories: this.state.categories });


    // For passing just value (no lable + value) to DB
    const selectedStrings = (e.map((obj => obj.value)));
    this.state.selectedCategories[index] = selectedStrings
    this.setState({ selectedCategories: this.state.selectedCategories })

  };

  /**
   *
   * Grab dropdown box selection for collections
   *
   * */

  collectionDropdownHandler = (e, index) => {
    this.state.collection[index] = e;

    //to keep dropdown box with latest selected labels and values

    this.setState({ collection: this.state.collection });

    // For passing just value (no lable + value) to DB
    const selectedStrings = (e.map((obj => obj.value)));
    this.state.selectedCollection[index] = selectedStrings
    this.setState({ selectedCollection: this.state.selectedCollection })



  };

  /**
   *
   * Handles user text input changes for file names
   *
   * */

  async handleFileNameChange(e, index) {
    this.state.fileName[index] = e.target.value;
    this.setState({ fileName: this.state.fileName });
  }

  /**
   *
   * Handles user text input changes
   *
   * */

  handleChange(e, index) {
    this.state.descriptions[index] = e.target.value;
    this.setState({ descriptions: this.state.descriptions });
  }

  /***
   *
   * Removes Upload form
   *
   *  */

  handleRemove(index) {
    this.state.collection.splice(index, 1);
    this.state.categories.splice(index, 1);
    this.state.uploads.splice(index, 1);
    this.state.descriptions.splice(index, 1);
    this.state.fileName.splice(index, 1);
    this.state.file.splice(index, 1);
    this.state.progressBar.splice(index, 1);

    this.setState({ collection: this.state.collection });
    this.setState({ categories: this.state.categories });
    this.setState({ uploads: this.state.uploads });
    this.setState({ file: this.state.file });
    this.setState({ descriptions: this.state.descriptions });
    this.setState({ fileName: this.state.fileName });
    this.setState({ progressBar: this.state.progressBar });
  }

  /**
   *
   * Remove all file details after submit
   *
   * */

  reset() {
    this.setState({ uploads: [] });
    this.setState({ file: [] });
    this.setState({ descriptions: [] });
    this.setState({ categories: [] });
    this.uploadInput.files = null;
  }

  /***
   *
   * Add data into db related to upload
   *
   ***/

  addFileToDB = async (mediaFile, i) => {
    console.log("Adding file to DB");
    console.log(this.state.file.length)

    //Get File extension of uploaded file
    var fileExt = this.state.file[i].name.split(".").pop();

    //Set tag as an empty array for uncategorised mediaFiles
    if (
      this.state.categories.length === 0 &&
      this.state.categories[i] === undefined
    ) {
      mediaFile = {
        name: this.state.fileName[i] + "." + fileExt,
        description: this.state.descriptions[i],
        tags: [],
        collection: this.state.selectedCollection[i],

        file: {
          bucket: awsExports.aws_user_files_s3_bucket,
          region: awsExports.aws_user_files_s3_bucket_region,
          key: "public/" + this.state.fileName[i] + "." + fileExt,
        },
      };
    }

    //Upload mediaFile to db table
    try {
      await API.graphql(
        graphqlOperation(createMediaFile, { input: mediaFile })
      );
      console.log("file added to database");

      console.log("test count " + this.state.count)
      
      //this.handleRemove(i)

      this.setState({ count: this.state.count + 1 })
      console.log("test count " + this.state.count)




    } catch (error) {
      alert("DB Error " + error);

    }
  };

  /**
   *
   *
   * Submission handling to S3 and dynamodb
   *
   *
   * **/
  handleSubmit = async (e) => {
    for (var i = 0; i < this.state.file.length; i++) {
      var fileExt = this.state.file[i].name.split(".").pop();

      const newFileName = {
        name: this.state.fileName[i] + "." + fileExt,
      };
      const mediaFile = {
        name: this.state.fileName[i] + "." + fileExt,
        description: this.state.descriptions[i],
        tags: this.state.selectedCategories[i],
        collection: this.state.selectedCollection[i],

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
          this.state.fileName[i] === undefined
        ) {
          if (
            this.state.fileName.length === 0 ||
            this.state.fileName[i] === undefined
          ) {
            
            this.state.progressBar[i] = 0
            this.setState({progressBar: this.state.progressBar})
            
            alert("Please enter a file name for file #" + [i + 1]);
            if (i === this.state.file.length) {


              alert(
                this.state.count + " files uploaded successfully"
              );
              this.reset();
              window.location.reload();

            }

            


          }
          else {
            try {

              this.setState({ uploads: [...this.state.uploads, mediaFile] });
              //Uploads image to S3 bucket

              await Storage.put(
                this.state.fileName[i] + "." + fileExt,
                this.state.file[i],
                {
                  contentType: "media",
                  progressCallback: (progress) => {
                    this.state.progressBar[i] = Math.round(
                      (100 * progress.loaded) / progress.total
                    );
                    this.setState({
                      progressBar: this.state.progressBar,
                    });
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

                this.addFileToDB(this.state.uploads[i], i).then((e)=>{

                  if (i === this.state.file.length) {


                    alert(
                      this.state.count + " files uploaded successfully"
                    );
                    this.reset();
                    window.location.reload();
  
                  }
  

                }
                  )
                

                


              });
            } catch (error) {
              alert("Error uploading file: ", error);
              
            }
          }

        } else {
          
          this.state.progressBar[i] = 0
          this.setState({progressBar: this.state.progressBar})
          console.log("sashatest " + i )
          alert(
            this.state.fileName[i] +
            "." +
            fileExt +
            " already exist. Please enter a different name"
          )
          if (i === this.state.file.length - 1) {


            alert(
              this.state.count + " files uploaded successfully"
            );
            this.reset();
            window.location.reload();

          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  /**
   *
   * Handle file uploads from upload button
   *
   * */
  handleFile = (e) => {
    let fileNames = e.target.files;
    const filesAdded = [];
    const progress = [];

    Array.from(fileNames).forEach((file, i) => {
      let newFile = file.name
        .split(".")
        .slice(0, -1)
        .join(".");
      filesAdded.push(newFile);
      progress.push(0);
    });

    this.setState({ fileName: [...this.state.fileName, ...filesAdded] });
    this.setState({ progressBar: [...this.state.progressBar, ...progress] });

    this.setState({ file: [...this.state.file, ...e.target.files] });
  };

  /*
   *
   * Fetch category names for dropdown selection
   *
   */

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

  /**
   *
   * Fetch category names for dropdown selection
   *
   **/

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

        <div className="upload-forms">
          {this.state.file.map((f, index) => {
            return (
              <div key={index}>
                <div class="thumbnail">
                  <img src={URL.createObjectURL(this.state.file[index])} />
                </div>

                <input
                  onChange={(e) => this.handleFileNameChange(e, index)}
                  value={this.state.fileName[index]}
                  defaultValue={this.state.fileName[index]}
                />
                <input
                  onChange={(e) => this.handleChange(e, index)}
                  value={this.state.descriptions[index]}
                />
                <button onClick={() => this.handleRemove(index)}>Remove</button>

                <Select
                  isMulti
                  name="Category"
                  value={this.state.categories[index]}
                  options={tagOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={(e) => this.dropdownHandler(e, index)}
                />
                { }

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
                  now={this.state.progressBar[index]}
                  label={`${this.state.progressBar[index]}%`}
                />
              </div>
            );
          })}
        </div>
        <hr />
        <div className="drop-area">
          <div className="upload-button">
            <BsCloudUpload id="bsIcon" />
            <div class="text">Drag and Drop to Upload Files</div>
            <input
              id="inp"
              className="dropbox"
              type="file"
              onChange={this.handleFile}
              multiple
              ref={(ref) => {
                this.uploadInput = ref;
              }}
            />
          </div>
        </div>
        <button onClick={(e) => this.handleSubmit(e)}>Submit</button>
      </div>
    );
  }
}

export default UploadMediaFile;