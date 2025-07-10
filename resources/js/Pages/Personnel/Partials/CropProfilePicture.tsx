import { useState } from "react";
import Cropper, { Point } from 'react-easy-crop';

interface CropProfilePictureProps {
    fileURL: string,
}

export default function CropProfilePicture({ fileURL }: CropProfilePictureProps) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0});
    const [zoom, setZoom] = useState(1);

    return (
        <div className="relative">
            <Cropper
                image={fileURL}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(cropped, croppedPixels) => console.log(cropped, croppedPixels)}
            />
        </div>
    );
}