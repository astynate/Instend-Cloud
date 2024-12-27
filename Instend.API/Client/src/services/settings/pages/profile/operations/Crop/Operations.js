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
        canvas.width = props.width;
        canvas.height = props.height;

        ctx.fillStyle = '#eee';
        ctx.fillRect(0, 0, props.height, props.width);

        ctx.drawImage(
          image,
          props.x,
          props.y,
          props.width,
          props.height,
          0,
          0,
          props.width,
          props.height
        )

        await props.setCroppedImage(canvas.toDataURL());
        await props.setAvatar(canvas.toDataURL());
        await props.Update(canvas.toDataURL().replace('data:image/png;base64,', ''), props.setContext);
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