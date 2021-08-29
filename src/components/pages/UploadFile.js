import React from 'react';
import './UploadFile.css';

import { Storage, API, graphqlOperation } from 'aws-amplify';
import { createMediaFile } from '../../graphql/mutations';
import awsExports from '../../aws-exports.js';
import Select from 'react-select'
import {getTag} from '../../graphql/queries';

let tagOptions = []
let multipleFiles = []
//let file =[]
//let desc =[]
//let tagSelected =[]


//const { showStatus } = false;


class UploadMediaFile extends React.Component {

    //File state management
    constructor(props) {
        super(props);
        this.state = {
            file: [''],
            desc: [''],
            tags: [''],
            selectedTags: [''],
            successs: false,
            inputList:[]
            


        }
        this.handleSubmit = this.handleSubmit.bind(this);
        
    }


    // add data into db related to upload
    addFileToDB = async (mediaFile) => {
        console.log('Adding file to DB')
        try {
            await API.graphql(graphqlOperation(createMediaFile, { input: mediaFile }));

        } catch (error) {
            console.log(error)
        }

    }

    // Sends upload to s3 and dyanmodb on submit
    handleSubmit(e) {
        let file = this.uploadInput.files[0];
        console.log(file);
        console.log('hi i am submitting')

        //Uploads image to S3 bucket
        Storage.put(file.name, file, {
            contentType: 'media'
        }).then((result) => {
            this.setState({ file: URL.createObjectURL(file) })
            console.log(result);

            //creating media file object for Graphql storage
            const mediaFile = {
                name: file.name,
                description: this.state.desc,
                tags: this.state.selectedTags,

                file: {
                    bucket: awsExports.aws_user_files_s3_bucket,
                    region: awsExports.aws_user_files_s3_bucket_region,
                    key: 'public/' + file.name
                }
            }

                

            console.log(mediaFile);

            //pushes to graphql db
            this.addFileToDB(mediaFile);
            console.log('file added to database')

        })

        e.preventDefault();
    }
    //save each file into an array
    saveFileDetails = () =>{

        let file = this.uploadInput.files[0];

    }

    //grabs user input in textbox
    myChangeHandler = (event) => {
        this.setState({ desc: event.target.value });
    }

    //grab dropdown box selection

    dropdownHandler = (newValue) => {
        console.log(newValue);
        this.setState({ selectedTags: newValue })


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

    handleChange = (e) => {
        this.setState({file: URL.createObjectURL(e.target.files[0])})
        const inputList = this.state.inputList;
        this.setState({
            inputList: inputList.concat(<div>
                <img src={URL.createObjectURL(e.target.files[0])} class="thumbnail"/>
                
                <input type="text" value={this.state.desc} onChange={this.myChangeHandler} />
    
                <Select isMulti name='Category' options={tagOptions} className="basic-multi-select" classNamePrefix="select" onChange={this.dropdownHandler} />
            </div>)
        })
        

    }



    componentDidMount() {
        this.fetchCategory()
    }


    render() {

       

        return (

            <div class="main-content">
                <p>Select Local File</p>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        
                        {this.state.inputList}
                        

                        <div>
                            <input type="file" onChange={this.handleChange} ref={(ref) => { this.uploadInput = ref; }} />
                            <input type="submit" value="Submit" />
                        </div>
                   
                    </form>
                </div>
                
            </div>
        )

    }
}

export default UploadMediaFile
