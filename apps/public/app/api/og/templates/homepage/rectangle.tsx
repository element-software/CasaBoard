/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unknown-property */
import { OGImageProps } from "../types";

const HomepageRectangle = ({
  logoBuffer,
  description,
  title,
  imageUrl,
}: OGImageProps) => {
  return (
    <div
      style={{
        background: "linear-gradient(to right, #1e0c35, #120a1f)",
      }}
      tw="w-full h-full p-8 flex flex-row items-center justify-center relative text-center"
    >
      <div
        tw="absolute top-0 left-0 w-[1200px] h-[630px]"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage: `
          linear-gradient(to right, #120a1f 1px, transparent 1px),
          linear-gradient(to bottom, #120a1f 1px, transparent 1px)`,
        }}
      />
      <img
        src={`data:image/png;base64,${Buffer.from(logoBuffer).toString(
          "base64"
        )}`}
        style={{
          objectFit: "contain",
          width: "550px",
          //filter: "brightness(0) invert(1)",
        }}
        alt="Background"
      />
      <div tw="flex flex-col items-center justify-center pr-32">
        <h1 tw="text-white text-8xl font-black">{title}</h1>
        <p tw="text-white text-3xl font-bold">{description}</p>
      </div>
    </div>
  );
};

export default HomepageRectangle;
