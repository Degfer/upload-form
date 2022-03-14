import { upload } from "./upload"

upload('#file-formup', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif'],
    onUpload(files) {
        
    }
})