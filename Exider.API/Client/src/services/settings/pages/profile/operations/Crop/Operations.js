import React, { useEffect, useRef } from "react";

const CropImage = (props) => {

  const canvasRef = useRef();

  useEffect(() => {

    const SetImage = async () => {

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const image = new Image();

      image.src = props.image;

      image.onload = function () {
  
        canvas.width = props.size;
        canvas.height = props.size;

        ctx.drawImage(
          image,
          props.x,
          props.y,
          props.size,
          props.size,
          0,
          0,
          props.size,
          props.size
        )

        props.setCroppedImage(canvas.toDataURL());
        props.setAvatar(canvas.toDataURL());
        props.setOpenState(false);
        
      };

      image.onerror = function () {
        props.setCroppedImage(props.image);
      };
  
    }

    if (props.image && props.cropState) {

      SetImage();

    }

  }, [props.cropState]);

  return <canvas ref={canvasRef} style={{'display': 'none'}} />;

}

export default CropImage;