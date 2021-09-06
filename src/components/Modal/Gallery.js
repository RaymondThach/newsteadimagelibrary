import React, {useRef, useState, useEffect} from 'react';
import { MdClose, MdEdit, MdFileDownload, MdShare } from 'react-icons/md';
import { AiFillTag } from 'react-icons/ai';
import { FcOk, FcCancel } from 'react-icons/fc';
import { Storage, API, graphqlOperation } from 'aws-amplify';
import { updateMediaFile } from '../../graphql/mutations';
import { AmplifyS3Image } from '@aws-amplify/ui-react';
import './Gallery.css';

export default function Gallery({showGallery, setShowGallery, item, fetchMediaFiles}) {

  //Reference to modal's background
  let modalRef = useRef();
  
  //State for edit button to hide/show confirmEdit and cancelEdit buttons for detailTextbox
  const [ edit, setEdit ] = useState(false);

  //Input for detailsTextbox to update description
  const [ details, setDetails ] = useState('');

  //Close modal if background of modal is clicked.
  const closeGallery = event => {
    if (modalRef.current === event.target) {
      setShowGallery(false);
    }
  } 

  //Generate and fetch signed URL for item in S3 bucket (24 hour expiry or 86,400 seconds).
  async function getSignedURL() {
    return await Storage.get(item.name, { expires: 86400 });
  }
  
  //Functionality for 'Share' button. Fetch generated signed URL for item in S3 bucket (24 hour expiry) and copy to clipboard.
  async function copyToClipboard() {
    const signedURL = await getSignedURL();
    navigator.clipboard.writeText(signedURL)
    .then(function() {alert('Copied link for "' + item.name + '" to clipboard - expires in 24 hours.');})
  
  }

  //Download the currently viewed media file via the "Download" button.
  async function download() {
    const blob = await Storage.get(item.name, { download: true, progressCallback(progress){
      console.log(`Downloaded: ${progress.loaded}/${progress.total}`)
    }});
    const url = URL.createObjectURL(blob.Body);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.name || 'download';
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener('click', clickHandler);
      }, 150)
    };
    a.addEventListener('click', clickHandler, false);
    a.click();
    return a;
  }

  //Push updated description to Dynamodb for selected item.
  async function updateDescription() {
    await API.graphql(graphqlOperation(updateMediaFile, {input: {id: item.id, description: details}}));
    alert('Updated description for ' + item.name + '.');
    setEdit(false);
    document.getElementById("detailTextbox").setAttribute("disabled", "disabled");
    fetchMediaFiles();
  }

  //Hide the confirmEdit, cancelEdit buttons, disable detailTextbox, and revert the edit
  function disableEdit() {
    setEdit(false);
    document.getElementById("detailTextbox").setAttribute("disabled", "disabled");
    setDetails(item.description);
  }

  //Enable confirmEdit, cancelEdit buttons, and detailTextbox.
  function enableEdit() {
    setEdit(true);
    document.getElementById("detailTextbox").removeAttribute("disabled");
  }

  //Update the array of tags for selected media file on DynamoDB.
  async function updateTags(tagArray){
    await API.graphql(graphqlOperation(updateMediaFile, {input: {id: item.id, tags: tagArray}}));
  }

  //Remove the tag from the selected media file then push the updated array to Dynamodb
  //fetch the update media files from Dynamodb to update UI dynamically.
  function removeTag(tag){
    const currentTags = item.tags;
    var index = currentTags.indexOf(tag);
    if (index !== -1){
      currentTags.splice(index, 1);
      updateTags(currentTags);
      fetchMediaFiles();
    } 
  }

  //On load get the initial description of selected item.
  useEffect(() => {
    console.log(item.file.key);
    setDetails(item.description);
  }, []); 

  return (
      <>
      {showGallery ?
      (<div class='background' ref={modalRef} onClick={closeGallery}>
        <div class='container'>
          <div class='imageName'>
            <label>{item.name}</label>
          </div>
          <div class= 'mediaContainer'>
            <AmplifyS3Image imgKey={item.name} class='image'/>
          </div>
          <div class='dataColumn'>
            <div class='closeGalleryButton'>
              <MdClose onClick={() => setShowGallery(prev => !prev)} size={20}/>
            </div>
            <div class='detailLabel'>
              <label>Details:</label>
            </div>
            <div class='detailText'>
              <textarea id="detailTextbox" value={details} onChange={(e) => setDetails(e.target.value)} disabled></textarea>
            </div>
            <div class='editButton'>
              <MdEdit size={20} onClick={enableEdit}/>
            </div>
            <div class='downloadButton'>
              <MdFileDownload size={20} onClick={download}/>
            </div>
            <div class='shareButton'>
              <MdShare size={20} onClick={copyToClipboard}/>
            </div>
            <>
            {edit ? (
              <>
              <FcOk class='confirmButton' size={20} onClick={updateDescription}/>
              <FcCancel class='cancelButton' size={20} onClick={disableEdit} />
              </>
            )
            : null}
            </>
            <div class='tagsArea'>
            {
              item.tags.map((tag) => (
              <label class="tags" key={tag}>
                <AiFillTag size={20}/>
                {tag}
                <MdClose onClick={() => removeTag(tag)}/>
              </label>
              ))
            }
            </div>
          </div>
        </div>
      </div>)
      : null }
    </>
  );
}      