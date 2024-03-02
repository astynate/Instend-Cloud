import React, { useEffect, useRef } from "react";

const CropImage = (props) => {

  const canvasRef = useRef();

  useEffect(() => {

    const SetImage = async () => {

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const image = new Image();

      image.src = props.image;

      image.onload = async () => {
  
        canvas.width = props.size;
        canvas.height = props.size;

        ctx.fillStyle = '#eee';
        ctx.fillRect(0, 0, props.size, props.size);

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

        await props.setCroppedImage(canvas.toDataURL());
        await props.setAvatar(canvas.toDataURL());
        await props.setOpenState(false);
        
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