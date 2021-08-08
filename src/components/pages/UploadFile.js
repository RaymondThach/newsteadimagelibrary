import React from 'react';
import './UploadFile.css';

import {Storage, API, graphqlOperation } from 'aws-amplify';
import {createMediaFile } from '../../graphql/mutations';
import awsExports from '../../aws-exports.js';

/*Once files finishes proccessing pushes to S3, will output message in console 
Currently no gui prompts if succesfully or not.
*/

class UploadMediaFile extends React.Component {

    //File state management
    constructor(props){
        super(props);
        this.state ={
            file : null
        }
    }

    addFileToDB = async (mediaFile) =>{
        console.log('Adding file to DB')
        try{
            await API.graphql(graphqlOperation(createMediaFile, {input:mediaFile}));

        } catch (error){
            console.log(error)
        }

    }
    
    onChange(e){
        const file = e.target.files[0];
        console.log(file);

        //Uploads image to S3 bucket
        Storage.put(file.name, file, {
            contentType: 'media'
        }).then((result) => {
            this.setState({file: URL.createObjectURL(file)})
            console.log(result);

            //creating media file object for Graphql storage
            const mediaFile ={
                name: file.name,
                file: {
                    bucket: awsExports.aws_user_files_s3_bucket,
                    region: awsExports.aws_user_files_s3_bucket_region,
                    key: 'public/'+ file.name
                }
            }

            console.log(mediaFile);

            //pushes to graphql db
            this.addFileToDB(mediaFile);
            console.log('file added to database')

        })
    }

    render(){

        return(
            <div>
                <p>Select Local File</p>
                <input type="file" onChange={(evt) => this.onChange(evt)}/>
            </div>
        )

    }
}

export default UploadMediaFile
