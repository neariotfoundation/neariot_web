import { memo, useCallback, useEffect, useState } from "react";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import PersonIcon from "@mui/icons-material/Person";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import { ProjectCardProps } from "../../helpers/types";
import { useRouter } from "next/router";

const NewProjectCard = memo(
  ({ id, name, img, descriptions }: ProjectCardProps) => {
    const router = useRouter();
    return (
      <>
        <div
          className="w-full lg:h-[236px] md:h-[246px] flex flex-col rounded-lg overflow-hidden border border-purple bg-white"
          onClick={() => {
            router.push(`/sandbox/project/${id}`);
          }}
        >
          <div className="w-full flex justify-center bg-gray-300 border-2 border-purple h-32">
            <img src={img} alt="" className="object-cover w-auto h-auto" />
          </div>
          <div className="w-full px-2 flex-col">
            <label className="font-semibold text-lg flex">{name}</label>
            <div className="flex w-full max-h-12 overflow-hidden truncate whitespace-pre-line break-words my-2">
              <p className="">{descriptions}</p>
            </div>
          </div>
        </div>
      </>
    );
  }
);

NewProjectCard.displayName = "NewProjectCard";

export default NewProjectCard;
