import { Fragment, memo, useState } from "react";
import { formatDate } from "../../helpers/Utils";

const style = {
  arrow: {
    up: "w-0 h-0 border border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-transparent border-b-[16px] border-emerald-500 transform cursor-pointer ",
    down: "w-0 h-0 border border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-transparent border-t-[16px] border-emerald-500 transform cursor-pointer ",
    right:
      "w-0 h-0 border border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent border-r-transparent border-l-[16px] border-emerald-500 transform cursor-pointer ",
    left: "w-0 h-0 border border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent border-l-transparent border-r-[16px] border-emerald-500 transform cursor-pointer ",
  },
};

type Props = {
  id: string;
  reward: boolean;
  minPledge: number;
  description: string;
  rewardDetail?: string;
  rewardDeadline?: number;
  informationForm?: any[];
};
// const NEAR_DECIMAL = 1_000_000_000_000_000_000_000_000;
const NEAR_DECIMAL = 1;
const sampleInform = [
  { email: "quan.leanh.02@gmail.com" },
  { "acccount near": "ciuz.testnet" },
];
const OfferCard = memo(
  ({
    reward,
    minPledge,
    description,
    rewardDetail,
    rewardDeadline,
    informationForm = [],
  }: Props) => {
    const [collapsed, setCollapsed] = useState(false);

    const renderContent = () => {
      if (collapsed && !reward) {
        return (
          <div className="w-full p-4">
            <div className="w-full flex flex-col text-center">
              <label className="font-semibold text-lg ">{description}</label>
              <div className="text-left md:mt-4 my-2">
                <label className="">
                  Min. Plegde Amount: {minPledge / NEAR_DECIMAL} NEAR
                </label>
              </div>
            </div>
          </div>
        );
      }
      if (collapsed && reward) {
        return (
          <>
            <div className="w-full p-4">
              <div className="w-full flex flex-col ">
                <div className="my-2 w-full">
                  <div className="flex flex-row w-full">
                    <label className="w-1/3">Description: </label>
                    <span className="w-full">{description}</span>
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex flex-row w-full">
                    <label className="w-1/3">Offer (Minimun amount): </label>
                    <span className="w-full ">
                      {minPledge / NEAR_DECIMAL} Near
                    </span>
                  </div>
                  <div className="flex flex-row w-full">
                    <label className="w-1/3">Reward: </label>
                    <span className="w-full">{rewardDetail}</span>
                  </div>
                  <div className="flex flex-row w-full">
                    <label className="w-1/3">Reward Deadline: </label>
                    <span className="w-full">{formatDate(rewardDeadline)}</span>
                  </div>
                </div>
                <div className="my-2 w-full">
                  <div className="flex flex-row w-full ">
                    <label className="w-1/3">Reward Information Form: </label>
                    <div className="w-full whitespace-pre-wrap ">
                      {informationForm?.map((inform, index) => {
                        for (const [key, _value] of Object.entries(inform)) {
                          if (key == "id") continue;
                          return (
                            <Fragment key={index}>
                              <div className="flex flex-row w-full">
                                <span className="w-1/5">{key}</span>
                                <span className="w-4/5">{`${_value}`}</span>
                              </div>
                            </Fragment>
                          );
                        }
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-left md:mt-4 my-2">
                  <div className="flex flex-row w-full">
                    <label className="w-1/3">Min. Plegde Amount:</label>
                    <span className="w-full ">
                      {minPledge / NEAR_DECIMAL} NEAR
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      }
    };

    return (
      <>
        <div className="w-full border border-purple rounded-lg  my-2">
          <div
            className="flex flex-rows w-full p-4 text-center items-center"
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          >
            <div
              className={
                !collapsed ? style.arrow.right : style.arrow.down + " flex"
              }
            ></div>
            <span className="text-center w-full md:mr-4">
              {!reward ? "Pledge without reward" : "Pledge with reward"}
            </span>
          </div>
          {renderContent()}
        </div>
      </>
    );
  }
);

OfferCard.displayName = "OfferCard";

export default OfferCard;
