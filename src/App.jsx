import "./App.css";
import { Button, Modal } from "keep-react";
import { Avatar } from "keep-react";
import Image from "./assets/images/profile.jpg";
import { useState, createRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

function App() {
  const [showModal, setShowModal] = useState(false);

  const [image, setImage] = useState("");
  const [errorImage, setErrorImage] = useState(null);
  const [cropData, setCropData] = useState("");
  const cropperRef = createRef();
  const handleModal = () => {
    setShowModal(!showModal);
  };

  const onChange = (e) => {
    e.preventDefault();
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    let files;
    if (!allowedTypes.includes(e.target.files[0].type)) {
      setErrorImage(
        "Invalid file type. Please select a JPEG, PNG, or GIF image."
      );
    } else {
      setErrorImage(null);
    }
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
    }
    setShowModal(false);
    setImage("");
  };
  return (
    <>
      <div className="container mx-auto">
        <div className="mt-5 flex items-center justify-center flex-col">
          <Avatar shape="circle" size="2xl" img={cropData ? cropData : Image} />

          <Button
            size="md"
            className="mt-5"
            type="dashed"
            onClick={handleModal}
          >
            Upload
          </Button>
        </div>

        <Modal size="xl" show={showModal} position="center">
          <Modal.Body>
            <div className="flex flex-col items-center">
              <div className="rounded-full w-[100px] h-[100px] bg-yellow-100 overflow-hidden">
                <div className="h-full w-full img-preview"></div>
              </div>
              <input
                type="file"
                className="mt-1 mb-1 border border-slate-100"
                onChange={onChange}
              />
              <p className="text-red-500">{errorImage}</p>

              {image && !errorImage && (
                <Cropper
                  ref={cropperRef}
                  style={{ height: 400, width: "100%" }}
                  zoomTo={0.5}
                  initialAspectRatio={1}
                  preview=".img-preview"
                  src={image}
                  viewMode={1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                  guides={true}
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="outlineGray" color="error" onClick={handleModal}>
              Cancel
            </Button>
            {errorImage ? (
              <Button type="primary" disabled onClick={getCropData}>
                Upload
              </Button>
            ) : (
              <Button type="primary" onClick={getCropData}>
                Upload
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default App;
