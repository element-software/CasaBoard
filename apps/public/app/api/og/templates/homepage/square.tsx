/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unknown-property */
import { OGImageProps } from "../types";

const HomepageSquare = ({
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
      tw="w-full h-full p-8 flex flex-col items-center justify-center relative text-center"
    >
      <div
        tw="absolute top-0 left-0 w-[400px] h-[400px]"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage: `
          linear-gradient(to right, #120a1f 1px, transparent 1px),
          linear-gradient(to bottom, #120a1f 1px, transparent 1px)`,
        }}
      />
      <h1 tw="text-white text-5xl font-black -mb-8">{title}</h1>
      <img
        src={`data:image/png;base64,${Buffer.from(logoBuffer).toString(
          "base64"
        )}`}
        style={{
          objectFit: "contain",
          width: "250px",
        }}
        alt="Background"
      />
      <p tw="text-white text-xl font-bold -mt-8">{description}</p>
    </div>
  );
};

export default HomepageSquare;
