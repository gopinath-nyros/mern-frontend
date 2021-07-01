import React, { Fragment, useRef, useState, useEffect } from "react";
import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewURL, setpreviewURL] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setpreviewURL(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const pickedHandler = (event) => {
    console.log(event.target.files);
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }

    props.onInput(props.id, pickedFile, fileIsValid);
  };

  return (
    <Fragment>
      <div className='form-control'>
        <input
          type='file'
          id={props.id}
          ref={filePickerRef}
          style={{ display: "none" }}
          accept='.jpg,.png,.jpeg'
          onChange={pickedHandler}
        />
      </div>
      <div className={`image-upload ${props.center && "center"}`}>
        <div className='image-upload__preview'>
          {previewURL && <img src={previewURL} alt='preview' />}
          {!previewURL && <p>please pick an image!</p>}
        </div>
        <Button type='button' onClick={pickImageHandler}>
          Upload Image
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </Fragment>
  );
};

export default ImageUpload;
