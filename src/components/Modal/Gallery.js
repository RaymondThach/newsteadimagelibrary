import React, { useRef, useState, useEffect } from 'react';
import { MdClose, MdEdit, MdFileDownload, MdShare } from 'react-icons/md';
import { AiFillTag, AiOutlinePlus, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { FcOk, FcCancel } from 'react-icons/fc';
import { Storage, API, graphqlOperation } from 'aws-amplify';
import { updateMediaFile } from '../../graphql/mutations';
import { AmplifyS3Image } from '@aws-amplify/ui-react';
import transparentLogo from '../images/transparentLogo.png';
import Select from 'react-select';
import CreateCategory from '../Modal/CreateCategory';
import { listTags, listCollections } from '../../graphql/queries';
import CreateCollection from '../Modal/CreateCollection';
import Videojs from '../services/video.js';
import './Gallery.css';

export default function Gallery({ showGallery, setShowGallery, item, fetchMediaFiles }) {
  //Reference to modal's background
  let modalRef = useRef();

  //State for showing the create category modal
  const [createCategory, setCreateCategory] = useState(false);

  //State for showing the create collection modal
  const [createCollection, setCreateCollection] = useState(false);

  //State for edit button to hide/show confirmEdit and cancelEdit buttons for detailTextbox
  const [edit, setEdit] = useState(false);

  //Input for detailsTextbox to update description
  const [details, setDetails] = useState('');

  //Options for the category selector
  const [tagOptions] = useState([]);

  //Selected options of the category selector
  const [selectedCategories, setSelectedCategories] = useState();

  //Options for the collection selector
  const [collectionOptions] = useState([]);

  //Selected options of the collection selector
  const [selectedCollections, setSelectedCollections] = useState();

  //Video signed url
  const [videoUrl, setVideoUrl] = useState();

  //File Extensions
  const [fileExt, setFileExt] = useState();

  //Favourited state for selected item
  const [favourited, setFavourited] = useState(item.favourite); 

  //Close modal if background of modal is clicked. Fetch latest information.
  const closeGallery = event => {
    if (modalRef.current === event.target) {
      setShowGallery(false);
    }
  }

  // Accepted video extensions
  const videoFormat = ['mp4', 'mov', 'wmv', 'avi', 'avchd', 'flv', 'f4v', 'swf', 'mkv']

  //Generate and fetch signed URL for item in S3 bucket (24 hour expiry or 86,400 seconds).
  async function getSignedURL() {
    setVideoUrl(Storage.get(item.name, { expires: 86400 }))
    return await Storage.get(item.name, { expires: 86400 });
  }

  //Functionality for 'Share' button. Fetch generated signed URL for item in S3 bucket (24 hour expiry) and copy to clipboard.
  async function copyToClipboard() {
    const signedURL = await getSignedURL();
    navigator.clipboard.writeText(signedURL)
      .then(function () { alert('Copied link for "' + item.name + '" to clipboard - expires in 24 hours.'); })
  }

  //Download the currently viewed media file via the "Download" button.
  async function download() {
    const blob = await Storage.get(item.name, {
      download: true, progressCallback(progress) {
        console.log(`Downloaded: ${progress.loaded}/${progress.total}`)
      }
    });
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
    await API.graphql(graphqlOperation(updateMediaFile, { input: { id: item.id, description: details } }));
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
  async function updateTags(tagArray) {
    await API.graphql(graphqlOperation(updateMediaFile, { input: { id: item.id, tags: tagArray } }));
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
    if (index !== -1) {
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
    if (item.tags) {
      options.map((option) => (item.tags.includes(option.categoryName) ? null : tagOptions.push({ value: option.categoryName, label: option.categoryName })));
    }
  }

  //Populate the collection options, not including what the item is already a member of
  async function populateColSelector() {
    const results = await API.graphql(graphqlOperation(listCollections));
    const options = results.data.listCollections.items;
    if (item.collection) {
      options.map((option) => (item.collection.includes(option.name) ? null : collectionOptions.push({ value: option.name, label: option.name })));
    } else {
      options.map((option) => collectionOptions.push({ value: option.name, label: option.name }));
    }
  }

  //Get the values from the category selector
  const handleCatSelect = (selectedCategories) => {
    setSelectedCategories(selectedCategories);
  }

  //Get the values from the category selector
  const handleColSelect = (selectedCollections) => {
    setSelectedCollections(selectedCollections);
  }

  //Remove tag options from selector upon tagging an image
  function removeOption(selectedItems, optionArray) {
    selectedItems.map((option) => {
      const index = optionArray.indexOf(option);
      if (index !== -1) { (optionArray.splice(index, 1)); }
    })
  }

  //Add tags to selected catalogue item
  function addTags(item) {
    if (selectedCategories) {
      const selectedOptions = [];
      selectedCategories.map((option) => selectedOptions.push(option.value)); //Allow only category options the item is not tagged with
      const combinedTags = selectedOptions.concat(item.tags);                 //Combine selected options with existing tags
      item.tags = combinedTags;                                               //Assign to local data for dynamic rerender
      updateTags(combinedTags);                                               //Assign data to server
      fetchMediaFiles();                                                      //rerender
      setSelectedCategories(null);                                            //Reset the field
      removeOption(selectedCategories, tagOptions);                           //Remove the selected options from selector
    }
  }

  //Add selected item to the collections via Gallery
  async function addCollection() {
    let currentCol = [];
    if (selectedCollections) {
      const selectedCol = [];
      if (item.collection !== null) {
        currentCol = item.collection;
      }
      selectedCollections.map((option) => selectedCol.push(option.value));
      const combinedCol = currentCol.concat(selectedCol);
      await API.graphql(graphqlOperation(updateMediaFile, { input: { id: item.id, collection: combinedCol } }));
      setSelectedCollections(null);
      removeOption(selectedCollections, collectionOptions);
      alert(item.name + ' has been added to collections.');
    }
  }

  //Video Player 
  const videoJsOptions = {
    autoplay: false,
    playbackRates: [0.5, 1, 1.25, 1.5, 2],
    width: 720,
    height: 300,
    controls: true,
    sources: [
      {
        src: videoUrl,
      },
    ],
  };

  //Generate and fetch signed URL for item in S3 bucket (24 hour expiry or 86,400 seconds).
  async function getVideoObject() {
    const result = await (Storage.get(item.name, { expires: 86400 }))
    setVideoUrl(result) //Sign URL for video player
  }

  //Change the favourite property to true or false for the selected item in the database
  async function setFavourite() {
    if (favourited === undefined || favourited === null) {
      await API.graphql(graphqlOperation(updateMediaFile, { input: { id: item.id, favourite: true } }));
      setFavourited(true);
    }
    else if (favourited === true) {
      await API.graphql(graphqlOperation(updateMediaFile, { input: { id: item.id, favourite: false } }));
      setFavourited(prev => !prev);
    }
    else if (favourited === false) {
      await API.graphql(graphqlOperation(updateMediaFile, { input: { id: item.id, favourite: true } }));
      setFavourited(prev => !prev);
    }
  }

  //On load get the details of the selected item.
  useEffect(() => {
    setFileExt((item.name.split('.').pop()));
    getVideoObject();
    if (item.description != null) {
      setDetails(item.description);
    }
    populateCatSelector();
    populateColSelector();
  }, []);

  return (
    <>
      {showGallery ?
        (<div class='galleryBackground' ref={modalRef} onClick={closeGallery}>
          <div class='leftMenu'>
            <img class='galleryLogo' src={transparentLogo} />
            <div class='menu-wrapper'>
              <div class='categorySelection'>
                <label class='tagLabel'>Tag by Category</label>
                <AiOutlinePlus class='createCategoryBtn' onClick={() => setCreateCategory(true)} />
                <Select isMulti options={tagOptions} class='categorySelector' value={selectedCategories} onChange={handleCatSelect} closeMenuOnSelect={false} />
                <button class='tagCategoryBtn' onClick={() => { addTags(item); }}>Tag</button>
              </div>
              <div class='collectionSelection'>
                <label class='collectionLabel'>Add to Collection</label>
                <AiOutlinePlus class='createCollectionBtn' onClick={() => { setCreateCollection(true); }} />
                <Select isMulti options={collectionOptions} class='collectionSelector' value={selectedCollections} onChange={handleColSelect} closeMenuOnSelect={false} />
                <button class='addCollectionBtn' onClick={() => { addCollection(); }}>Add</button>
              </div>
            </div>
          </div>
          <div class='galContainer'>
            <div class='imageName'>
              <label>{item.name}</label>
            </div>
            <div class='mediaContainer'>
              {
                videoFormat.indexOf(fileExt) > -1
                  ? videoUrl !== undefined ? <Videojs {...videoJsOptions} /> : null
                  : <AmplifyS3Image imgKey={item.name} class='image' />
              }
            </div>
            <div class='dataColumn'>
              <div class='closeGalleryButton'>
                <MdClose onClick={() => { setShowGallery(false); }} />
              </div>
              <div class='detailLabel'>
                <label>Details:</label>
              </div>
              <div class='detailText'>
                <textarea id="detailTextbox" value={details} onChange={(e) => setDetails(e.target.value)} disabled></textarea>
              </div>
              <div class='editButton'>
                <MdEdit size={20} onClick={enableEdit} />
              </div>
              <div class='downloadButton'>
                <MdFileDownload size={20} onClick={download} />
              </div>
              <div class ='favouriteButton' onClick={() => {setFavourite();}}>
                {
                  (favourited !== null || favourited !== undefined ? 
                    (favourited === true ? <AiFillStar size={20} id='favouritedStar'/> : <AiOutlineStar size={20}/>)
                  : <AiOutlineStar size={20}/>)
                } 
              </div>
              <div class='shareButton'>
                <MdShare size={20} onClick={copyToClipboard} />
              </div>
              <>
                {edit ? (
                  <>
                    <FcOk class='confirmButton' size={20} onClick={updateDescription} />
                    <FcCancel class='cancelButton' size={20} onClick={disableEdit} />
                  </>
                )
                  : null}
              </>
              <div class='tagsArea'>
                {
                  item.tags.map((tag) => (
                    <label class="tags" key={tag}>
                      <AiFillTag size={15} />
                      {tag}
                      <MdClose onClick={() => removeTag(tag)} />
                    </label>
                  ))
                }
              </div>
            </div>
          </div>
          <div class='createCat'>
            {
              createCategory ? <CreateCategory class='createCatModal' setCreateCategory={setCreateCategory} tagOptions={tagOptions}/> : null
            }
          </div>
          <div class='createCollection'>
            {
              createCollection ? <CreateCollection class='createColModal' setCreateCollection={setCreateCollection} /> : null
            }
          </div>
        </div>)
        : null}
    </>
  );
}