const imagePickerElement = document.querySelector(
  '#image-upload-control input'
);
const imagePreviewElement = document.querySelector('#image-upload-control img');

function updateImagePreview() {
  // We can access the files property of the input file element to get back an array (in this case, this will be an array with just 1 element).
  const files = imagePickerElement.files;

  if (!files || files.length === 0) {
    // We want to set the display to none in case the preview img was shown in a previous change from the user.
    imagePreviewElement.style.display = 'none';
    return;
  }

  // Since in this sceneario we only have 1 file, we can look for the file in the array getting the index 0.
  const pickedFile = files[0];

  // We can set (in the browser side) a way to construct a url to local files (provided by the visitor) thx to the built-in URL class, and then calling the static method createObjectURL(), passing there the picked file.
  // The method will create a URL that will work on the computer of the visitor who picked that file.
  imagePreviewElement.src = URL.createObjectURL(pickedFile);
  imagePreviewElement.style.display = 'block';
}

// The event 'change' is triggered whenever the user changes the input file element.
imagePickerElement.addEventListener('change', updateImagePreview);
