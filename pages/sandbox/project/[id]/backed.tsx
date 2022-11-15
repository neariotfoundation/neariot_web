import { useRouter } from "next/router";
import { Fragment, memo, useCallback, useEffect, useState } from "react";
import LineChart from "../../../../components/Chart/LineChart";
import Section from "../../../../components/Section";
import { formatDate } from "../../../../helpers/Utils";
import HelpIcon from "@mui/icons-material/Help";
import { Popover, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { ProjectData } from "../../../../helpers/types";
import Notify from "../../../../components/Notify";
import Confirm from "../../../../components/Confirm";
import BuyOffer from "../../../../components/Card/BuyOffer";
import { utils } from "near-api-js";

const BackedProject = memo(() => {
  const [data, setData] = useState<ProjectData>({
    id: "",
    owner: "",
    name: "",
    // type: "",
    descriptions: "",
    repository: "",
    created_at: "",
    noSetting: true,
    offers: [],
    section: [],
    pledgers: 0,
    project_target: 0,
    avg_rate: 0,
    project_rate: 0,
  });
  const [openLoading, setOpenLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [snackMsg, setSnackMsg] = useState("");
  const [offers, setOffers] = useState<any[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const wallet = useSelector((state: any) => state.wallet);
  const web3storage = useSelector((statex: any) => statex.w3storage);
  const [milestone, setMilestone] = useState<any>(0);
  const router = useRouter();
  const { id } = router.query;

  const onCloseSnack = () => {
    setOpenSnack(false);
  };

  const onShowResult = ({ type, msg }: any) => {
    setOpenSnack(true);
    setOpenLoading(false);
    setAlertType(type);
    setSnackMsg(msg);
  };

  const onRequestConnectWallet = () => {
    const { nearConfig, walletConnection } = wallet;
    walletConnection?.requestSignIn?.(nearConfig?.contractName);
  };

  useEffect(() => {
    setOpenLoading(true);
    const { walletConnection } = wallet;
    const userId = walletConnection.getAccountId();
    if (userId === "") {
      onRequestConnectWallet();
      return;
    }

    (async () => {
      const project = await getProject(id);
      const _data = await getDataWeb3(project.metadata);
      setData({
        id: project.id,
        owner: _data.owner,
        name: _data.name,
        // type: _data.type,
        offers: project.offers || [],
        descriptions: _data.descriptions,
        repository: _data.repository,
        created_at: project.created_at,
        noSetting: _data.noSetting,
        data: _data.data,
        section: _data.section,
        pledgers: project.total_pledge + "",
        project_target: _data.project_target + "",
        avg_rate: project.avg_rate + "",
        project_rate: _data.project_rate + "",
      });
      setMilestone(_data?.milestone || new Date().getTime());
      setOpenLoading(false);
    })();
  }, []);

  const getDataWeb3 = async (cid: any, callback?: (res?: any) => void) => {
    const { web3Connector } = web3storage;
    return await web3Connector
      .getData(cid)
      .then((res: any) => {
        callback?.(res);
        return res.metadata;
      })
      .catch((err: any) => {
        onShowResult({
          type: "error",
          msg: String(err),
        });
      });
  };

  const getProject = async (id: any) => {
    const { walletConnection, contract } = wallet;
    return await contract
      .get_project({ id: id }, 50000000000000)
      .catch((error: any) => {
        onShowResult({
          type: "error",
          msg: String(error),
        });
      });
  };

  const handleSubcribe = async () => {
    setOpenLoading(true);
    const { walletConnection, contract } = wallet;
    await contract
      .add_to_watchlist({ id: id }, 50000000000000)
      .then((res: any) => {
        onShowResult({
          type: "success",
          msg: "Subcribe success",
        });
      })
      .catch((err: any) => {
        onShowResult({
          type: "error",
          msg: String(err),
        });
      });
  };

  const renderButton = useCallback(() => {
    return (
      <>
        <button
          onClick={() => handleSubcribe()}
          className="col-span-2 bg-purple shadow-lg shadow-indigo-500/50 hover:bg-indigo-800/90 hover:shadow-indigo-500/40 text-white rounded-lg border-0  w-full h-12  items-center"
        >
          Save this project
        </button>
        <button className="col-span-2 bg-purple shadow-lg shadow-indigo-500/50 hover:bg-indigo-800/90 hover:shadow-indigo-500/40 text-white rounded-lg border-0  w-full h-12  items-center">
          View Testing Guide
        </button>
      </>
    );
  }, []);

  useEffect(() => {
    (async () => {
      const _offers: any[] = [];
      if (!data.offers) {
        return;
      }
      for (const offer of data.offers || []) {
        const _data = await getDataWeb3(offer.metadata);
        if (_data) {
          _data.id = offer.id;
          _offers.push(_data);
        }
      }
      setOffers(_offers);
    })();
  }, [data]);

  const handleBuyOffer = async (offer: any) => {
    setOpenLoading(true);
    if (!offer.pledge || offer.pledge == 0) {
      onShowResult({
        type: "error",
        msg: "Please fill Pledge Amount",
      });
      return;
    }
    await handleSaveOfferInformation(offer);
    const { walletConnection, contract } = wallet;
    const depositAmount = utils.format.parseNearAmount(offer.pledge + "");

    await contract
      .buy_offer(
        { project_id: id, offer_id: offer.offer_id },
        300000000000000,
        depositAmount
      )
      .then((res: any) => {
        if (res) {
          onShowResult({
            type: "success",
            msg: "Buy offer success",
          });
        }
      })
      .catch((err: any) => {
        onShowResult({
          type: "error",
          msg: String(err),
        });
      });
  };

  const handleSaveOfferInformation = async (offer: any) => {
    const { walletConnection } = wallet;
    const _index = data.offers?.findIndex((item: any) => {
      item.id == offer.offer_id;
    });
    if (_index != -1) {
      let filename = "";
      let projectId = "";
      const _data = await getDataWeb3(offer.metadata, (res: any) => {
        filename = res.filename;
        projectId = res.projectId;
      });
      if (_data) {
        const _inform = [
          ..._data.boughtInform,
          {
            account_id: walletConnection.getAccountId(),
            information: offer.information,
            pledge: offer.pledge,
          },
        ];
        _data.boughtInform = _inform;
        console.log(_data);
        await web3storage.web3Connector.setData(projectId, filename, _data);
      }
    }
  };

  const renderOffers = useCallback(() => {
    return offers.map((offer: any, index: any) => {
      return (
        <Fragment key={index}>
          <BuyOffer
            id={offer.id}
            description={offer.description}
            minPledge={offer.minPledge}
            reward={offer.reward}
            rewardDetail={offer.rewardDetail}
            rewardDeadline={offer.rewardDeadline}
            informationForm={offer.informationForm}
            onConfirm={(data) => {
              handleBuyOffer(data);
            }}
          />
        </Fragment>
      );
    });
  }, [offers]);

  return (
    <>
      <Notify
        openLoading={openLoading}
        openSnack={openSnack}
        alertType={alertType}
        snackMsg={snackMsg}
        onClose={onCloseSnack}
      />
      <Confirm
        onShow={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
        }}
        onConfirm={(data: any) => {}}
      />
      <div className="w-full mb-12 pt-36"></div>
      <div className="w-full lg:px-16 sm:px-8">
        <div className="flex md:flex-row flex-col p-4 justify-between">
          <div className="md:w-6/12 lg:min-h-[300px] md:min-h-[310px] items-center align-middle my-auto pb-2 w-full rounded bg-white md:mr-4 shadow-indigo-600 shadow-sm  h-full flex-grow">
            <div className="flex flex-row w-full py-2 m-2">
              <div className="flex mx-2 w-3/12">Project Name: </div>
              <span className="flex mx-2 w-9/12 px-2 overflow-x-auto">
                {data.name}
              </span>
            </div>
            <div className="flex flex-row w-full py-2 m-2">
              <div className="flex mx-2 w-3/12">Description: </div>
              <span className="flex mx-2 w-9/12 px-2 overflow-x-auto overflow-y-auto">
                {data.descriptions}
              </span>
            </div>
            <div className="flex flex-row w-full py-2 m-2">
              <div className="flex mx-2 w-3/12">Repository: </div>
              <span className="flex mx-2 w-9/12 px-2 overflow-x-auto">
                {data?.repository}
              </span>
            </div>
            <div className="flex flex-row w-full py-2 m-2">
              <div className="flex mx-2 w-3/12">Create At: </div>
              <span className="flex mx-2 w-9/12 px-2 overflow-x-auto">
                {formatDate(data.created_at / 1000000)}
              </span>
            </div>
          </div>
          <div className="lg:w-2/12 pb-2 bg-transparent w-0"></div>
          <div className="md:w-4/12 lg:min-h-[300px] md:min-h-[310px] md:w-of items-center align-middle my-auto pb-2 w-full rounded bg-white md:ml-4 shadow-indigo-600 shadow-sm h-full">
            <div className="flex flex-row w-full py-2 m-2">
              <div className="flex mx-2 md:w-4/12 w-2/12">Project Target: </div>
              <span className="flex mx-2 md:w-8/12 w-full px-2 overflow-x-auto">
                {data.pledgers + "/" + data.project_target} NEAR
              </span>
            </div>
            <div className="flex flex-row w-full py-2 m-2">
              <div className="flex mx-2 md:w-4/12 w-2/12">Total backers: </div>
              <span className="flex mx-2 md:w-8/12 w-full px-2 overflow-x-auto">
                {data.watchers}
              </span>
            </div>
            <div className="grid grid-flow-row-dense grid-cols-2 grid-rows-2 gap-4 p-2 m-2">
              {renderButton()}
            </div>
          </div>
        </div>
        <div className="w-full md:my-8 my-4">
          <hr className="w-full md:mx-4  md:max-w-[80%] border-slate-400 mb-8" />
          <div className="flex flex-row justify-between md:p-4 p-2 text-primary">
            <span className="">Select your offer</span>
            <span className="">Milestone Review: {formatDate(milestone)}</span>
          </div>
          <div className="w-full md:p-4 p-2">{renderOffers()}</div>
        </div>
      </div>
    </>
  );
});

BackedProject.displayName = "backed_project";

export default BackedProject;
