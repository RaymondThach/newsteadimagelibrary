import React, {useRef, useState, useEffect} from 'react';
import { MdClose, MdEdit, MdFileDownload, MdShare } from 'react-icons/md';
import { AiFillTag, AiOutlinePlus } from 'react-icons/ai';
import { FcOk, FcCancel } from 'react-icons/fc';
import { Storage, API, graphqlOperation } from 'aws-amplify';
import { updateMediaFile } from '../../graphql/mutations';
import { AmplifyS3Image } from '@aws-amplify/ui-react';
import { useAppContext } from '../services/context.js';
import transparentLogo from '../images/transparentLogo.png';
import Select from 'react-select';
import CreateCategory from '../Modal/CreateCategory';
import { listTags } from '../../graphql/queries';
import './Gallery.css';

export default function Gallery({showGallery, setShowGallery, item, fetchMediaFiles}) {
  //Reference to modal's background
  let modalRef = useRef();
  
  //Context object to keep track of whether gallery modal is open in App.js
  const { galleryHasOpened } = useAppContext();

  //State for showing the create category modal
  const [createCategory, setCreateCategory] = useState(false);

  //State for edit button to hide/show confirmEdit and cancelEdit buttons for detailTextbox
  const [ edit, setEdit ] = useState(false);

  //Input for detailsTextbox to update description
  const [ details, setDetails ] = useState('');

  //Close modal if background of modal is clicked. Fetch latest information.
  const closeGallery = event => {
    if (modalRef.current === event.target) {
      setShowGallery(false);
      galleryHasOpened(false);
      fetchMediaFiles();
    }
  } 

  //Options for the category selector
  const [ tagOptions ] = useState([]);

  //Selected options of the category selector
  const [ selectedCategories, setSelectedCategories ] = useState();
  
  const collectionOptions = [];

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
    if (item.description != null) {
      setDetails(item.description);
    } else {
      setDetails('');
    }
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

  //Add a tag option back into the selector
  function addOption(categoryName) {
    tagOptions.push({ value: categoryName, label: categoryName })
  }

  //Remove the tag from the selected media file then push the updated array to Dynamodb
  //fetch the update media files from Dynamodb to update UI dynamically. Add the tag option back into the selector array.
  function removeTag(tag) {
    const currentTags = item.tags;
    var index = currentTags.indexOf(tag);
    if (index !== -1){
      currentTags.splice(index, 1);
      updateTags(currentTags);
      fetchMediaFiles();
      addOption(tag);
    } 
  }

  //Populate the category options, not including what the item is already tagged with
  async function populateCatSelector() {
    const results = await API.graphql(graphqlOperation(listTags));
    const options = results.data.listTags.items;
    options.map((option) => (item.tags.includes(option.categoryName) ? null : tagOptions.push({ value: option.categoryName, label: option.categoryName })));
  }

  //Get the values from the category selector
  const handleCatSelect = (selectedCategories) => {
    setSelectedCategories(selectedCategories);
  }

  //Remove tag options from selector upon tagging an image
  function removeOption() {
    selectedCategories.map((option) => {
      const index = tagOptions.indexOf(option);
      if (index !== -1) { (tagOptions.splice(index, 1)); }
    })
  }

  //Add tags to selected catalogue item
  function addTags(item) {
    const selectedOptions = [];
    if (selectedCategories) {
      selectedCategories.map((option) => selectedOptions.push(option.value)); //Allow only category options the item is not tagged with
      const combinedTags = selectedOptions.concat(item.tags);                 //Combine selected options with existing tags
      item.tags = combinedTags;                                               //Assign to local data for dynamic rerender
      updateTags(combinedTags);                                               //Assign data to server
      fetchMediaFiles();                                                      //rerender
      setSelectedCategories(null);                                            //Reset the field
      removeOption();                                                         //Remove the selected options from selector
      
    }   
  }

  //On load get the initial description of selected item.
  useEffect(() => {
    if (item.description != null) {
      setDetails(item.description);
    }
    galleryHasOpened(true);
    populateCatSelector();
  }, []); 

  return (
      <>
      {showGallery ?
      (<div class='background' ref={modalRef} onClick={closeGallery}>
        <div class='leftMenu'>
          <img class='galleryLogo' src={transparentLogo}/>
          <div class='menu-wrapper'>
            <div class='categorySelection'>
              <label class='tagLabel'>Tag by Category</label>
              <AiOutlinePlus class='createCategoryBtn' onClick={() => setCreateCategory(true)}/>
              <Select isMulti options={tagOptions} class='categorySelector' value={selectedCategories} onChange={ handleCatSelect } closeMenuOnSelect={false}/>
              <button class='tagCategoryBtn' onClick={() => {addTags(item);}}>Tag</button>
            </div>
            <div class='collectionSelection'>
              <label class='collectionLabel'>Add to Collection</label>
              <AiOutlinePlus class='createCollectionBtn'/>
              <Select isMulti options={collectionOptions} class='collectionSelector'/>
              <button class='addCollectionBtn'>Add</button>
            </div>
          </div>
        </div>
        <div class='container'>
          <div class='imageName'>
            <label>{item.name}</label>
          </div>
          <div class= 'mediaContainer'>
            <AmplifyS3Image imgKey={item.name} class='image'/>
          </div>
          <div class='dataColumn'>
            <div class='closeGalleryButton'>
              <MdClose onClick={closeGallery} size={20}/>
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
                <AiFillTag size={15}/>
                {tag}
                <MdClose onClick={() => removeTag(tag)}/>
              </label>
              ))
            }
            </div>
          </div>
        </div>
        <div class='createCat'>
        {
          createCategory ? <CreateCategory class='createCatModal' setCreateCategory={setCreateCategory}/> : null
        }
        </div>
      </div>)
      : null }
    </>
  );
}      