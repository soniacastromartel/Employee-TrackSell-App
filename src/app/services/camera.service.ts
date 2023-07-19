import { Injectable } from '@angular/core';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(private camera: Camera) {

  }

  /**
   * Set the camera options and get the picture depending on the user elected option.
   * @param sourceType 
   */
  pickImage(type) {
    console.log(type);
    let sourceType;
    switch (type) {
      case 1:
        sourceType = this.camera.PictureSourceType.CAMERA;
        break;
      case 2:
        sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
        break;
    }
        const options: CameraOptions = {
          quality: 100,
          sourceType: sourceType,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE
        }
        this.camera.getPicture(options).then((imageData) => {
          // imageData is either a base64 encoded string or a file URI
          const imgUrl = 'data:image/jpeg;base64,' + imageData;
          // this.imgUrl = 'data:image/jpeg;base64,' + imageData;

          return imgUrl;
        }, (err) => {
          console.log(err);
        });

    }
  }
