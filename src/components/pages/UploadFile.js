import React from 'react';
import './UploadFile.css';

import { Storage, API, graphqlOperation } from 'aws-amplify';
import { createMediaFile } from '../../graphql/mutations';
import awsExports from '../../aws-exports.js';
import Select from 'react-select'
import { getTag } from '../../graphql/queries';

const delay = ms => new Promise(res => setTimeout(res, ms));
let tagOptions = []

class UploadMediaFile extends React.Component {

    state = {
        uploads: [],
        descriptions: [],
        categories: [],
        list: [],
        successs: [],
        file: [],
        tags: []
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



/***********************************************************************************
 *                                                                                  
 * TEST BUTTON
 * 
 */
    addForm() {
        console.log(this.uploadInput.files.length)
        console.log(this.state.uploads);
        console.log(this.state.file)
        console.log(this.state.categories)
    }

/**********************************************************************************/

   //grab dropdown box selection

   dropdownHandler = (e, index) =>  {
        const selectedStrings = (e.map((obj => obj.value)));
        this.state.categories[index] = selectedStrings
        console.log(this.state.categories[0])
        this.setState({categories: this.state.categories})
       
    } 
    


    //Handles user text input changes

    handleChange(e, index) {

        this.state.descriptions[index] = e.target.value
        this.setState({ descriptions: this.state.descriptions })

    }

    // Removes Upload form

    handleRemove(index) {

        this.state.uploads.splice(index,1)
        this.state.file.splice(index,1)
        this.state.descriptions.splice(index,1)
        this.state.categories.splice(index,1)

        this.setState({uploads: this.state.uploads})
        this.setState({file: this.state.file})
        this.setState({descriptions: this.state.descriptions})
        this.setState({categories: this.state.categories})

        console.log(this.state.uploads);
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
    handleSubmit = async(e)=> {
        //let files = this.state.list
        

        for (var i = 0; i < this.state.list.length; i++) {

            //let files = this.uploadInput.files[1]


            //console.log(files.name)
            const mediaFile = {
                name: this.state.file[i].name,
                description: this.state.descriptions[i],
                tags: this.state.categories[i],

                file: {
                    bucket: awsExports.aws_user_files_s3_bucket,
                    region: awsExports.aws_user_files_s3_bucket_region,
                    key: 'public/' + this.state.file[i].name
                }

            }
            this.setState({ uploads: [...this.state.uploads, mediaFile] })
            try{
            //Uploads image to S3 bucket
        
                await  Storage.put(this.state.file[i].name, this.state.file[i], {
                    contentType: 'media'
                    
                }).then((result) => {
                    
                    console.log('Uploading ' + this.state.file[i].name + " to s3");
                })

                    this.addFileToDB(this.state.uploads[i])
                


                    

                    

            }
            catch(error){
                console.log('Error uploading file: ', error)
        }

              
        }


        }


        handleFile = (e) => {
            let fileNames = this.uploadInput.files
            //let files  = e.target.files
            //console.log(files)
            Array.from(fileNames).forEach((file) => {

                let newFile = fileNames.name
                this.setState({ list: [...this.state.list, newFile] })

                




            });
            this.setState({ file: [...this.state.file, ...e.target.files]})




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

    componentDidMount(){
        this.fetchCategory();
    }


        render() {
            return (
                <div className="main-content">
                    <h1>Upload Files</h1>
                    <hr />
                    <input type="file" onChange={this.handleFile} multiple onChange={this.handleFile} ref={(ref) => { this.uploadInput = ref; }} />

                    {

                        this.state.file.map((f, index) => {


                            return (
                                <div key={index}>
                                    {console.log(index)}
                                    <input onChange={(e) => this.handleChange(e, index)} value={this.state.descriptions[index]} />
                                    <button onClick={() => this.handleRemove(index)}>Remove</button>
                                    <Select isMulti name='Category' options={tagOptions} className="basic-multi-select" classNamePrefix="select" onChange= {e => this.dropdownHandler(e, index)}/>
                                    <hr />
                                </div>
                            )
                        })
                    }
                    <hr />
                    <button onClick={(e) => this.addForm(e)}>TEST BUTTON</button>
                    <hr />
                    <button onClick={(e) => this.handleSubmit(e)}>Submit</button>
                </div>
            )
        }
    }

    export default UploadMediaFile
