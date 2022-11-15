import { useRouter } from "next/router";
import { Fragment, memo, useCallback, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useSelector } from "react-redux";
import { ProjectData } from "../../../../../helpers/types";
import Notify from "../../../../../components/Notify";
import Confirm from "../../../../../components/Confirm";
import CustomButton from "../../../../../components/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import OfferCard from "../../../../../components/Card/OfferCard";
import NewOffer from "../../../../../components/Card/NewOffer";
const RaiseFundScreen = memo(() => {
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
  const [milestoneDate, setMilestoneDate] = useState<Dayjs | null>(
    dayjs(new Date())
  );
  const [openLoading, setOpenLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [snackMsg, setSnackMsg] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openNewOffer, setOpenNewOffer] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  const wallet = useSelector((state: any) => state.wallet);
  const web3storage = useSelector((statex: any) => statex.w3storage);
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
      // check owner of project
      if (project.owner !== userId) {
        router.push(`/sandbox/project/${id}`);
        return;
      }
      const _data = await getDataWeb3(project.metadata);
      if (_data?.milestone) {
        setMilestoneDate(dayjs(_data?.milestone));
      }
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
      setOpenLoading(false);
    })();
  }, []);

  const getDataWeb3 = async (cid: any) => {
    const { web3Connector } = web3storage;
    return await web3Connector
      .getData(cid)
      .then((res: any) => {
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

  const handleFundingSummary = () => {
    console.log("funding summary");
  };

  const renderButton = useCallback(() => {
    return (
      <>
        <CustomButton
          className_box=" py-2  w-full mx-auto my-4"
          className_button="py-2"
          label="Funding Summary"
          onClickButton={handleFundingSummary}
        />
      </>
    );
  }, [data]);

  const handleChangeMilestoneDate = (date: Dayjs | null) => {
    setMilestoneDate(date);
    handleUpdateMilestone(date);
  };
  const handleUpdateMilestone = useCallback(
    async (date: any) => {
      setOpenLoading(true);
      const { walletConnection, contract } = wallet;
      const userId = walletConnection.getAccountId();
      const milestone = new Date(dayjs(date).format("YYYY-MM-DD")).getTime();
      const metadata = {
        ...data,
        milestone: milestone,
        // section: [],
      };
      const filename = userId + "_" + Date.now();
      const cid = await web3storage.web3Connector.setData(
        userId,
        filename,
        metadata
      );
      await contract
        .set_milestone(
          {
            id: id,
            milestones: new Date(date).getTime().toString(),
          },
          50000000000000
        )
        .then((res: any) => {
          setData(metadata);
          onShowResult({
            type: "success",
            msg: "Update milestone date successfully",
          });
          // router.push(`/sandbox/project/${id}`);
        })
        .catch((error: any) => {
          onShowResult({
            type: "error",
            msg: String(error),
          });
        });
    },
    [milestoneDate]
  );

  const onKeyDown = (e: any) => {
    e.preventDefault();
  };

  const handleConfirmNewOffew = async (data: any) => {
    if (!data.minPledge || data.minPledge == 0) {
      onShowResult({
        type: "error",
        msg: "Please fill Min. Pledge Amount",
      });
      return;
    }
    if (!data.description) {
      onShowResult({
        type: "error",
        msg: "Please fill Description",
      });
      return;
    }
    if (!data.rewardDetail && data.reward) {
      onShowResult({
        type: "error",
        msg: "Please fill Reward Details",
      });
      return;
    }
    if (!data.rewardDeadline && data.reward) {
      onShowResult({
        type: "error",
        msg: "Please fill Reward Deadline",
      });
      return;
    }
    const { walletConnection, contract } = wallet;
    setOpenLoading(true);
    const filename = id + "_" + Date.now();
    const cid = await web3storage.web3Connector.setData(
      Date.now(),
      filename,
      data
    );
    console.log(cid);
    await contract
      .add_project_offer({
        id: id,
        price: Number(data.minPledge),
        expires_at: data.reward ? data.rewardDeadline : 0,
        metadata: cid,
      })
      .then((res: any) => {
        onShowResult({
          type: "success",
          msg: "Add new offer successfully",
        });
        setData({ ...data, offers: res });
      })
      .catch((error: any) => {
        onShowResult({
          type: "error",
          msg: String(error),
        });
      });
    setOpenNewOffer(false);
  };

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

  const renderOffers = useCallback(() => {
    return offers.map((offer: any, index: any) => {
      return (
        <Fragment key={index}>
          <OfferCard
            id={offer.id}
            description={offer.description}
            minPledge={offer.minPledge}
            reward={offer.reward}
            rewardDetail={offer.rewardDetail}
            rewardDeadline={offer.rewardDeadline}
            informationForm={offer.informationForm}
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
      <NewOffer
        onShow={openNewOffer}
        onClose={() => {
          setOpenNewOffer(false);
        }}
        onConfirm={(data: any) => {
          handleConfirmNewOffew(data);
        }}
      />

      <div className="w-full mb-12 pt-36"></div>
      <div className="w-full lg:px-16 sm:px-8">
        <div className="flex md:flex-row flex-col p-4 justify-between">
          <div className="md:w-6/12 lg:min-h-[150px] md:min-h-[160px] items-center align-middle my-auto pb-2 w-full rounded bg-white mr-4 shadow-indigo-600 shadow-sm  h-full flex-grow">
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
          </div>
          <div className="lg:w-2/12 pb-2 bg-transparent w-0"></div>
          <div className="md:w-4/12 lg:min-h-[150px] md:min-h-[160px] md:w-of items-center align-middle my-auto pb-2 w-full rounded bg-white h-full">
            {renderButton()}
          </div>
        </div>
        <div className="flex w-full">
          <div className="w-3/4 md:mx-4">
            <hr className="my-4 md:min-w-full border-slate-400 mb-8" />
            <span className="text-lg font-semibold">
              Configure your fundraising mission.
            </span>
            <br />
            <span>
              Note that you need to create suggestions that are compatible with
              your project&apos;s capabilities and that you need to commit to
              completing them. Also, Don&apos;t miss the Milestone Review date.
              You can only get 19% of the investment amount before this time,
              the rest will be transferred after this point when your investors
              agree that the results you have committed before are suitable.
              with what they expect from the project. For investors who are not
              satisfied with this result, the remaining 80% will be refunded to
              the investor. Remember that you also need to send rewards to the
              backers who have supported you throughout the development of the
              project. With each investment, you need to set and complete the
              reward items before the deadline committed with the backers. After
              this commitment period, backers can participate in the public
              evaluation of your project, so paying rewards on time is also a
              way to ensure the credibility of the project. Milestone should be
              later than the Reward Deadline, it&apos;ll be saved for your
              project.
            </span>
            <hr className="my-4 md:min-w-full border-slate-400 mb-8" />
          </div>
        </div>
        <div className="flex w-full items-center">
          <div className="md:w-1/5 md:mx-4">Milestone Review Date</div>
          <div className="md:w-3/5 md:mx-4">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                disablePast
                openTo="day"
                value={milestoneDate}
                className="w-3/4"
                onChange={handleChangeMilestoneDate}
                renderInput={(params) => (
                  <TextField onKeyDown={onKeyDown} {...params} />
                )}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="flex flex-col mx-4 md:my-8 my-4">{renderOffers()}</div>
        <div className="flex justify-center p-4 pb-8">
          <CustomButton
            _icon={AddIcon}
            className_icon=""
            icon_size="large"
            className_box=" py-2 w-auto mx-auto my-4"
            className_button="py-2 px-4"
            label="Add new Offer"
            onClickButton={() => setOpenNewOffer(true)}
          />
        </div>
      </div>
    </>
  );
});

RaiseFundScreen.displayName = "RaiseFundScreen";

export default RaiseFundScreen;
