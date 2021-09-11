import React from 'react';
import './UploadFile.css';

import { Storage, API, graphqlOperation } from 'aws-amplify';
import { createMediaFile } from '../../graphql/mutations';
import awsExports from '../../aws-exports.js';
import Select from 'react-select';
import { fileName } from "../../graphql/queries";
import ProgressBar from 'react-bootstrap/ProgressBar';




let tagOptions = []
let collectionOptions = []

class UploadMediaFile extends React.Component {

    constructor(props) {
        super(props)
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
            imgThumbnails: []
        }
    }

    // grab the list of available categories
    fetchNames = /*GraphQl*/
        `query MyQuery {
    listTags {
      items {
        categoryName
      }
    }
  }
  `
    // grab the list of available collections
    fetchCollectionNames = /*GraphQl*/
        `query CollectionQuery {
        listCollections {
        items {
        name
            }
        }
    }
    `
    /***********************************************************************************
     *                                                                                  
     * TEST BUTTON
     * 
     */
    addForm() {


        console.log(this.state.uploads.length);
        console.log(this.state.descriptions.length);
        console.log(this.state.categories.length);
        console.log(this.state.collection.length);
        console.log(this.state.file.length)
        console.log(this.state.progress)
    
    }

    /**********************************************************************************/

    //grab dropdown box selection

    dropdownHandler = (e, index) => {
        const selectedStrings = (e.map((obj => obj.value)));
        this.state.categories[index] = selectedStrings
        console.log(this.state.categories[0])
        this.setState({ categories: this.state.categories })

    }
    //Handles user text input changes for file names

    async handleFileNameChange(e, index) {

        this.state.fileName[index] = e.target.value
        this.setState({ fileName: this.state.fileName })

    }

    //Handles user text input changes

    handleChange(e, index) {

        this.state.descriptions[index] = e.target.value
        this.setState({ descriptions: this.state.descriptions })

    }

    // Removes Upload form

    handleRemove(index) {

        this.state.uploads.splice(index, 1)
        this.state.file.splice(index, 1)
        this.state.descriptions.splice(index, 1)
        this.state.categories.splice(index, 1)

        this.setState({ uploads: this.state.uploads })
        this.setState({ file: this.state.file })
        this.setState({ descriptions: this.state.descriptions })
        this.setState({ categories: this.state.categories })


        //console.log(this.state.file[0].name)
    }

    // add data into db related to upload
    addFileToDB = async (mediaFile) => {
        console.log('Adding file to DB')
        try {
            await API.graphql(graphqlOperation(createMediaFile, { input: mediaFile }));
            console.log('file added to database')

        } catch (error) {
            console.log("DB Error " + error)
        }

    }

 



    //Submission handling to S3 and dynamodb
    handleSubmit = async (e) => {
        //let files = this.state.list


        for (var i = 0; i < this.state.file.length; i++) {

            var fileExt = this.state.file[i].name.split('.').pop();

            const newFileName = {
                name: this.state.fileName[i]+'.'+fileExt
            }

            //let files = this.uploadInput.files[1]

            //console.log(files.name)
            const mediaFile = {
                name: this.state.fileName[i]+'.'+fileExt,
                description: this.state.descriptions[i],
                tags: this.state.categories[i],

                file: {
                    bucket: awsExports.aws_user_files_s3_bucket,
                    region: awsExports.aws_user_files_s3_bucket_region,
                    key: 'public/' + this.state.fileName[i]+'.'+fileExt
                }
               

            }
            //this.setState({mediaFiles: [...this.state.mediaFiles, mediaFile]})
            try {
                const arrResult = await API.graphql(graphqlOperation(fileName, newFileName));
                if (arrResult.data.fileName.items.length === 0) {
                    if (this.state.categories.length === 0) {
                        alert("Please assign at least on category")
                    } else {

                        try {
                            this.setState({ uploads: [...this.state.uploads, mediaFile] })
                            //Uploads image to S3 bucket

                            await Storage.put(this.state.fileName[i] + '.' + fileExt, this.state.file[i], {
                                contentType: 'media',
                                progressCallback: (progress) => {

                                    this.setState({progressBar: Math.round((100 * progress.loaded) / progress.total)})
                                    //console.log(`${progress.loaded}/${progress.total}`)
                                    //this.setState({})
                                },

                            }).then((result) => {

                                console.log('Uploading ' + this.state.fileName[i] + '.' + fileExt + " to s3");
                            
                                this.addFileToDB(this.state.uploads[i])

                                
                                

                            })
                            

                        }
                        catch (error) {
                            console.log('Error uploading file: ', error)
                        }
                    }

                } else {
                    alert(this.state.fileName[i] + '.' + fileExt + ' already exist. Please enter a different name')
                }
            } catch (error) {
                console.log(error);

            }
            


    }
}

    //Handle file uploads from upload button

    handleFile = (e) => {
        let fileNames = this.uploadInput.files
        //let files  = e.target.files
        //console.log(files)
        Array.from(fileNames).forEach((file) => {

            let newFile = fileNames.name
            this.setState({ list: [...this.state.list, newFile] })

        });
        this.setState({ file: [...this.state.file, ...e.target.files] })
    }

    // Fetch category names for dropdown selection
    async fetchCategory() {
        console.log('fetching category names')

        const results = await API.graphql(graphqlOperation(this.fetchNames))
        this.setState({ tags: results.data.listTags.items })

        this.state.tags.map((listname, i) => (
            tagOptions.push({ value: listname.categoryName, label: listname.categoryName })
            )
        )
    }

    // Fetch category names for dropdown selection
    async fetchCollection() {
        console.log('fetching collection names')

        const results = await API.graphql(graphqlOperation(this.fetchCollectionNames))
        this.setState({ collectionList: results.data.listCollections.items })

        this.state.collectionList.map((listname, i) => (
            collectionOptions.push({ value: listname.name, label: listname.name })
            )
        )
    }

    componentDidMount() {
        this.fetchCategory();
    }

    render() {
        return (
            <div className="main-content">
                <h1>Upload Files</h1>
                <hr />
                

                {

                    this.state.file.map((f, index) => {


                        return (
                            <div key={index}>
                                {console.log(index)}
                                <div class="thumbnail">
                                    
                                        
                                        <img src={URL.createObjectURL(this.state.file[index])} />
                                        
                                     

                                    
                              
                                </div>
                                
                                <input onChange={(e) => this.handleFileNameChange(e, index)} value={this.state.fileName[index]} />
                                <input onChange={(e) => this.handleChange(e, index)} value={this.state.descriptions[index]} />
                                <button onClick={() => this.handleRemove(index)}>Remove</button>
                                <Select isMulti name='Category' options={tagOptions} className="basic-multi-select" classNamePrefix="select" onChange={e => this.dropdownHandler(e, index)} />
                                <Select isMulti name='Collection' options={collectionOptions} className="basic-multi-select" classNamePrefix="select" onChange={e => this.collectionDropdownHandler(e, index)} />
                                
                                <ProgressBar now={this.state.progressBar} label={`${this.state.progressBar}%`} />
                                <hr />
                            </div>
                        )
                    })
                }
                <input type="file" onChange={this.handleFile} multiple ref={(ref) => { this.uploadInput = ref; }} />
                <hr />
                <button onClick={(e) => this.addForm(e)}>TEST BUTTON</button>
                <hr />
                <button onClick={(e) => this.handleSubmit(e)}>Submit</button>
            </div>
        )
    }
}

export default UploadMediaFile
