import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import CustomButton from "../CustomButton";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Fragment, memo, useEffect, useState } from "react";
import { formatDate } from "../../helpers/Utils";

const style = {
  arrow: {
    up: "w-0 h-0 border border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-transparent border-b-[16px] border-emerald-500 transform cursor-pointer ",
    down: "w-0 h-0 border border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-transparent border-t-[16px] border-emerald-500 transform cursor-pointer ",
    right:
      "w-0 h-0 border border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent border-r-transparent border-l-[16px] border-emerald-500 transform cursor-pointer ",
    left: "w-0 h-0 border border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent border-l-transparent border-r-[16px] border-emerald-500 transform cursor-pointer ",
  },
  circle: {
    green: "w-4 h-4 rounded-full bg-emerald-500",
    red: "w-4 h-4 rounded-full bg-red-500",
    yellow: "w-4 h-4 rounded-full bg-yellow-500",
    blue: "w-4 h-4 rounded-full bg-blue-500",
    gray: "w-4 h-4 rounded-full bg-gray-500",
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
  onConfirm: (data: any) => void;
};
// const NEAR_DECIMAL = 1_000_000_000_000_000_000_000_000;
const NEAR_DECIMAL = 1;
const sampleInform = [
  { email: "quan.leanh.02@gmail.com" },
  { "acccount near": "ciuz.testnet" },
];
const BuyOffer = memo(
  ({
    id,
    reward,
    minPledge,
    description,
    rewardDetail,
    rewardDeadline,
    informationForm = [],
    onConfirm,
  }: Props) => {
    const [collapsed, setCollapsed] = useState(false);
    const [plegde, setPledge] = useState(0);
    const [inform, setinForm] = useState("");

    const handleSubmit = (e: any) => {
      e.preventDefault();
      onConfirm({ offer_id: id, pledge: plegde, information: inform });
    };
    useEffect(() => {
      let text = "";
      if (informationForm) {
        {
          informationForm?.map((inform, index) => {
            for (const [key, _value] of Object.entries(inform)) {
              if (key == "id") continue;
              text += `${key}: ${_value} \n`;
            }
          });
        }
      }
      setinForm(text);
    }, []);
    const renderContent = () => {
      if (collapsed && !reward) {
        return (
          <div className="w-full p-4">
            <form onSubmit={handleSubmit}>
              <div className="w-full flex flex-col text-center">
                <label className="font-semibold text-lg ">{description}</label>
                <div className="text-left md:mt-4 my-2 flex md:flex-row flex-col items-center w-full">
                  <div className="flex flex-row md:w-5/6 mb-2 items-center">
                    <label className="w-1/2 mr-2 md:mr-4">
                      Plegde Amount: (Min {minPledge / NEAR_DECIMAL} NEAR)
                    </label>
                    <input
                      type="text"
                      name=""
                      id=""
                      onChange={(e) => {
                        setPledge(Number(e.target.value));
                      }}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      className=" w-full border border-primary p-2 rounded-lg"
                    />
                  </div>
                  <button className="flex-1 bg-purple text-white mx-4 p-2 rounded-lg md:w-1/6 w-full mb-2">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        );
      }
      if (collapsed && reward) {
        return (
          <>
            <div className="w-full p-4">
              <form onSubmit={handleSubmit}>
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
                      <span className="w-full">
                        {formatDate(rewardDeadline)}
                      </span>
                    </div>
                  </div>
                  <div className="my-2 w-full">
                    <div className="flex md:flex-row flex-col w-full ">
                      <label className="md:w-1/3 w-full">
                        Reward Information Form:{" "}
                      </label>
                      <div className="w-full whitespace-pre-wrap ">
                        <textarea
                          cols={30}
                          rows={10}
                          className="w-full border border-primary p-2 rounded-lg"
                          value={inform}
                          onChange={(e) => setinForm(e.target.value)}
                          // placeholder="Enter your information here&#10;afsfd&#10;asdfa"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-left md:mt-4 my-2">
                    <div className="flex md:flex-row flex-col w-full">
                      <label className="md:w-1/3 w-full">
                        Plegde Amount: (Min {minPledge / NEAR_DECIMAL} NEAR)
                      </label>
                      <input
                        type="text"
                        onChange={(e) => {
                          setPledge(Number(e.target.value));
                        }}
                        className=" w-full border border-primary p-2 rounded-lg"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className=" bg-purple text-white p-2 rounded-lg  w-full mb-2"
                  >
                    Submit
                  </button>
                </div>
              </form>
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
                !collapsed ? style.circle.gray : style.circle.green + " flex"
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

BuyOffer.displayName = "BuyOffer";

export default BuyOffer;
