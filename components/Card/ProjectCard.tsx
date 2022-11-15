import { memo, useCallback, useEffect, useState } from "react";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import PersonIcon from "@mui/icons-material/Person";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import { ProjectCardProps } from "../../helpers/types";
import { useRouter } from "next/router";

const ProjectCard = memo(
  ({
    id,
    name,
    img,
    descriptions,
    owner,
    pledgers,
    backers,
  }: ProjectCardProps) => {
    const fiveStar = 5;
    const [rate, setRate] = useState(3);
    const router = useRouter();

    const renderRate = useCallback(() => {
      const cols = [];
      for (let i = 0; i < fiveStar; i++) {
        if (i < rate) {
          cols.push(
            <div className="" key={i + new Date().getDate()}>
              <img src="/golden-star.png" alt="star" />
            </div>
          );
          continue;
        }
        cols.push(
          <div className="" key={i + new Date().getDate()}>
            <img src="/silver-star.png" alt="star" />
          </div>
        );
      }
      return cols;
    }, [rate]);

    return (
      <>
        <div
          className="w-full lg:h-[426px] md:h-[436px] flex flex-col rounded-lg overflow-hidden border border-purple bg-white hover:cursor-pointer"
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
            <div className="w-full italic my-2">{owner}</div>
            <div className="w-full grid grid-cols-7">{renderRate()}</div>
            <div className="w-full my-2">
              <CurrencyBitcoinIcon />
              <span className="text-lg font-semibold h-auto text-center align-middle">
                {pledgers + ""}
              </span>
              <span className="overflow-hidden text-center align-middle">
                {" "}
                pledged of $... goal
              </span>
            </div>
            <div className="w-full my-2">
              <PersonIcon />
              <span className="text-lg font-semibold h-auto text-center align-middle">
                {backers}
              </span>
              <span className="text-center align-middle"> backers</span>
            </div>
            <div className="w-full my-2">
              <PanoramaFishEyeIcon />
              <span className="text-lg font-semibold h-auto text-center align-middle">
                45
              </span>
              <span className="text-center align-middle"> minutes to go</span>
            </div>
          </div>
        </div>
      </>
    );
  }
);

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
