import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import sampleScene from "./assets/VFEdata/ERI_Scene6-IMG_20231006_081813_00_122.jpg";

function PhotoSphereViewer() {
  return (
    <ReactPhotoSphereViewer
      src={sampleScene}
      height={"100vh"}
      width={"100%"}
    ></ReactPhotoSphereViewer>
  );
}

export default PhotoSphereViewer;
