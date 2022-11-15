import { Fragment, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProfileProject from "../../../components/Card/ProfileProject";
import Notify from "../../../components/Notify";
import { utils } from "near-api-js";
import { useRouter } from "next/router";
import Warning from "../../../components/Warning";
import { ProjectData } from "../../../helpers/types";

const ProfileScreen = () => {
  const fiveStar = 5;
  const CANCEL_WARNING = 0;
  const REMOVE_WARNING = 1;
  const RATE_WARNING = 2;
  const REWARD_WARNING = 3;
  const DISBURSE_WARNING = 4;
  const wallet = useSelector((state: any) => state.wallet);
  const web3storage = useSelector((statex: any) => statex.w3storage);
  const [tab, setTab] = useState(0);
  const [openLoading, setOpenLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [snackMsg, setSnackMsg] = useState("");
  const [listPledgeProjects, setListPledgeProjects] = useState<any[]>([]);
  const [listSaveProjects, setListSaveProjects] = useState<any[]>([]);
  const [listCompletedProjects, setListCompletedProjects] = useState<any[]>([]);
  const [projectId, setProjectId] = useState("");
  const [openWarning, setOpenWarning] = useState(false);
  const [actionState, setActionState] = useState(0);
  const [warningTitle, setWarningTitle] = useState("");
  const [rate, setRate] = useState(0);
  const [filename, setFilename] = useState<string>("");
  const [data, setData] = useState<ProjectData>();
  const router = useRouter();

  const onRequestConnectWallet = () => {
    const { nearConfig, walletConnection } = wallet;
    walletConnection?.requestSignIn?.(nearConfig?.contractName);
  };

  useEffect(() => {
    const { walletConnection, contract } = wallet;
    const userId = walletConnection.getAccountId();
    if (userId === "") {
      onRequestConnectWallet();
      return;
    }
    (async () => {
      // get user data
      setOpenLoading(false);
    })();
    // setOpenLoading(true);
  }, []);

  const onCloseSnack = () => {
    setOpenSnack(false);
  };

  const onShowResult = ({ type, msg }: any) => {
    setOpenSnack(true);
    setOpenLoading(false);
    setAlertType(type);
    setSnackMsg(msg);
  };

  const handleOpenCancelPledge = (id: string) => {
    setProjectId(id);
    setWarningTitle("Cancel");
    setActionState(CANCEL_WARNING);
    setOpenWarning(true);
  };

  const handleRemove = async (id: string) => {
    const { walletConnection, contract } = wallet;
    setOpenLoading(true);
    await contract
      .remove_from_watchlist({
        id: id,
      })
      .then((res: any) => {
        setOpenLoading(false);
        router.reload();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const handleOpenRate = (id: string) => {
    setProjectId(id);
    setWarningTitle("Rate Project");
    setActionState(RATE_WARNING);
    setOpenWarning(true);
  };

  const handleOpenReward = (id: string) => {
    setProjectId(id);
    setWarningTitle("Reward Recieved");
    setActionState(REWARD_WARNING);
    setOpenWarning(true);
  };

  const handleOpenDisburse = (id: string) => {
    setProjectId(id);
    setWarningTitle("Disburse");
    setActionState(DISBURSE_WARNING);
    setOpenWarning(true);
  };

  useEffect(() => {
    const { walletConnection, contract } = wallet;
    const userId = walletConnection.getAccountId();
    if (userId === "") {
      onRequestConnectWallet();
      return;
    }
    setOpenLoading(true);
    onLoadPledgedProject();
    onLoadSavedProject();
  }, []);

  const onLoadSavedProject = async () => {
    const { walletConnection, contract } = wallet;
    const userId = walletConnection.getAccountId();
    const { web3Connector } = web3storage;
    if (userId === "") {
      onRequestConnectWallet();
      return;
    }
    setOpenLoading(true);
    await contract
      .get_projects_watched()
      .then((res: any) => {
        res.map(async (item: any) => {
          const cid = item.metadata;
          let projectTitle = "There is no Title";
          let projectDescription = "There is no Description";
          await web3Connector?.getData(cid).then((res: any) => {
            if (res) {
              projectTitle = res.name;
              projectDescription = res.metadata.descriptions;
            }
          });
          // Get Milestone
          let milestone = "There is no Milestone was set";
          await contract
            .get_milestone({
              id: item.id,
            })
            .then((res: any) => {
              if (res !== "") {
                milestone = new Date(parseFloat(res)).toLocaleDateString();
              }
            });
          const project = {
            id: item.id,
            title: projectTitle,
            owner: item.owner,
            description: projectDescription,
            pledge: parseFloat(
              `${utils.format.formatNearAmount(
                item.total_pledge_locked.toLocaleString("fullwide", {
                  useGrouping: false,
                })
              )}`
            ),
            total_pledge: parseFloat(
              `${utils.format.formatNearAmount(
                item.total_pledge.toLocaleString("fullwide", {
                  useGrouping: false,
                })
              )}`
            ),
            milestone: milestone,
          };
          setListSaveProjects((listSaveProjects) => [
            ...listSaveProjects,
            project,
          ]);
          setOpenLoading(false);
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const onLoadPledgedProject = async () => {
    const { walletConnection, contract } = wallet;
    const userId = walletConnection.getAccountId();
    const { web3Connector } = web3storage;
    if (userId === "") {
      onRequestConnectWallet();
      return;
    }
    setOpenLoading(true);
    await contract
      .get_projects_funded()
      .then((res: any) => {
        console.log("get_projects_funded => ", res);
        res.map(async (item: any) => {
          let isCompleted = false;
          item.bought_offers.map((offer: any) => {
            if (offer.buyer === userId && offer.rate > 0) {
              isCompleted = true;
            }
          });
          const cid = item.metadata;
          let projectTitle = "There is no Title";
          let projectDescription = "There is no Description";
          await web3Connector?.getData(cid).then((res: any) => {
            if (res) {
              projectTitle = res.name;
              projectDescription = res.metadata.descriptions;
            }
          });
          // Get Milestone
          let milestone = "There is no Milestone was set";
          await contract
            .get_milestone({
              id: item.id,
            })
            .then((res: any) => {
              if (res !== "") {
                milestone = new Date(parseFloat(res)).toLocaleDateString();
              }
            });
          const project = {
            id: item.id,
            title: projectTitle,
            owner: item.owner,
            description: projectDescription,
            pledge: parseFloat(
              `${utils.format.formatNearAmount(
                item.total_pledge_locked.toLocaleString("fullwide", {
                  useGrouping: false,
                })
              )}`
            ),
            total_pledge: parseFloat(
              `${utils.format.formatNearAmount(
                item.total_pledge.toLocaleString("fullwide", {
                  useGrouping: false,
                })
              )}`
            ),
            milestone: milestone,
          };
          if (isCompleted) {
            setListCompletedProjects((listCompletedProjects) => [
              ...listCompletedProjects,
              project,
            ]);
          } else {
            setListPledgeProjects((listPledgeProjects) => [
              ...listPledgeProjects,
              project,
            ]);
          }
          setOpenLoading(false);
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  useEffect(() => {
    let tmpList = listSaveProjects;
    tmpList.forEach((element: any) => {
      if (tmpList.filter((x) => x.id === element.id).length > 1) {
        tmpList.splice(tmpList.indexOf(element), 1);
      }
    });
    setListSaveProjects(tmpList);
  }, [listSaveProjects]);

  useEffect(() => {
    let tmpList = listPledgeProjects;
    tmpList.forEach((element: any) => {
      if (tmpList.filter((x) => x.id === element.id).length > 1) {
        tmpList.splice(tmpList.indexOf(element), 1);
      }
    });
    setListPledgeProjects(tmpList);
  }, [listPledgeProjects]);

  useEffect(() => {
    let tmpList = listCompletedProjects;
    tmpList.forEach((element: any) => {
      if (tmpList.filter((x) => x.id === element.id).length > 1) {
        tmpList.splice(tmpList.indexOf(element), 1);
      }
    });
    setListPledgeProjects(tmpList);
  }, [listCompletedProjects]);

  //render content depend on tab
  const renderContent = () => {
    switch (tab) {
      case 0:
        return (
          <>
            {listSaveProjects.map((item, index) => {
              return (
                <Fragment key={index}>
                  <ProfileProject
                    id={item.id}
                    title={item.title}
                    owner={item.owner}
                    description={item.description}
                    pledge={item.pledge}
                    total_pledge={item.total_pledge}
                    milestone={item.milestone}
                    saved={true}
                    handleRemove={(id: any) => handleRemove(id)}
                  />
                </Fragment>
              );
            })}
          </>
        );
      case 1:
        return (
          <>
            {listPledgeProjects.map((item, index) => {
              return (
                <Fragment key={index}>
                  <ProfileProject
                    id={item.id}
                    title={item.title}
                    owner={item.owner}
                    description={item.description}
                    pledge={item.pledge}
                    total_pledge={item.total_pledge}
                    milestone={item.milestone}
                    saved={false}
                    handleCancelPledge={(id: any) => handleOpenCancelPledge(id)}
                    handleDisburse={(id: any) => handleOpenDisburse(id)}
                    handleRate={(id: any) => handleOpenRate(id)}
                    handleReward={(id: any) => handleOpenReward(id)}
                  />
                </Fragment>
              );
            })}
          </>
        );
      case 2:
        return (
          <>
            {listCompletedProjects.map((item, index) => {
              return (
                <Fragment key={index}>
                  <ProfileProject
                    id={item.id}
                    title={item.title}
                    owner={item.owner}
                    description={item.description}
                    pledge={item.pledge}
                    total_pledge={item.total_pledge}
                    milestone={item.milestone}
                    saved={false}
                    handleCancelPledge={(id: any) => handleOpenCancelPledge(id)}
                    handleDisburse={(id: any) => handleOpenDisburse(id)}
                    handleRate={(id: any) => handleOpenRate(id)}
                    handleReward={(id: any) => handleOpenReward(id)}
                  />
                </Fragment>
              );
            })}
          </>
        );
      default:
        setTab(0);
        return;
    }
  };

  const renderRate = useCallback(() => {
    const cols = [];
    for (let i = 0; i < fiveStar; i++) {
      if (i < rate) {
        cols.push(
          <div
            className="cursor-pointer"
            key={i + new Date().getDate()}
            onClick={() => setRate(i + 1)}
          >
            <img
              src="/golden-star.png"
              alt="star"
              className="object-fill h-16"
            />
          </div>
        );
        continue;
      }
      cols.push(
        <div
          className="cursor-pointer"
          key={i + new Date().getDate()}
          onClick={() => setRate(i + 1)}
        >
          <img src="/silver-star.png" alt="star" className="object-fill h-16" />
        </div>
      );
    }
    return cols;
  }, [rate]);

  const renderContentWarning = () => {
    switch (actionState) {
      case REMOVE_WARNING:
        return null;
      case CANCEL_WARNING:
        return (
          <>
            <div className="text-left">
              <img
                src="/happy.png"
                alt="icon"
                className="mx-auto my-2 p-4 h-32"
              />
              <div className="flex flex-rows">
                <input
                  required
                  type="checkbox"
                  className=" align-middle my-auto lg:w-4 md:w-8 mr-4 w-1/12"
                  id="checkRemove"
                  onInvalid={(e) =>
                    (e.target as HTMLInputElement).setCustomValidity(
                      "Please check this box to continue"
                    )
                  }
                  onInput={(e) =>
                    (e.target as HTMLInputElement).setCustomValidity("")
                  }
                />
                <div className="w-full">
                  <label className="" htmlFor="checkRemove">
                    {`We are so sorry if this project is disqualified. By clicking submit button, 80% of your money will be return to your wallet soon.`}
                  </label>
                  <br />
                  <span className="underline italic font-bold">
                    This action can not be undo.
                  </span>
                </div>
              </div>
              <div className="w-full grid grid-cols-5 py-8 px-32 gap-4">
                {renderRate()}
              </div>
            </div>
          </>
        );
      // case RATE_WARNING:
      //   return (
      //     <>
      //       <div className="w-full grid grid-cols-5 py-16 px-32 gap-4">
      //         {renderRate()}
      //       </div>
      //     </>
      //   );
      // case REWARD_WARNING:
      //   return (
      //     <>
      //       <div className="text-left">
      //         <img
      //           src="/happy.png"
      //           alt="icon"
      //           className="mx-auto my-2 p-4 h-32"
      //         />
      //         <div className="flex flex-rows">
      //           <input
      //             required
      //             type="checkbox"
      //             className=" align-middle my-auto lg:w-4 md:w-8 mr-4 w-1/12"
      //             id="checkReward"
      //             onInvalid={(e) =>
      //               (e.target as HTMLInputElement).setCustomValidity(
      //                 "Please check this box to continue"
      //               )
      //             }
      //             onInput={(e) =>
      //               (e.target as HTMLInputElement).setCustomValidity("")
      //             }
      //           />
      //           <div className="w-full">
      //             <label className="" htmlFor="checkReward">
      //               {`Did you receive the reward from the project's founder team? By clicking the submit button, you confirmed that you have received the reward.`}
      //             </label>
      //             <br />
      //             <span className="underline italic font-bold">
      //               This action can not be undo.
      //             </span>
      //           </div>
      //         </div>
      //       </div>
      //     </>
      //   );
      case DISBURSE_WARNING:
        return (
          <>
            <div className="text-left">
              <img
                src="/happy.png"
                alt="icon"
                className="mx-auto my-2 p-4 h-32"
              />
              <div className="flex flex-rows">
                <input
                  required
                  type="checkbox"
                  className=" align-middle my-auto lg:w-4 md:w-8 mr-4 w-1/12"
                  id="checkDisburse"
                  onInvalid={(e) =>
                    (e.target as HTMLInputElement).setCustomValidity(
                      "Please check this box to continue"
                    )
                  }
                  onInput={(e) =>
                    (e.target as HTMLInputElement).setCustomValidity("")
                  }
                />
                <div className="w-full">
                  <label className="" htmlFor="checkDisburse">
                    {`We are very happy to know that you are feeling good about this project. By clicking submit button, you agree to unlock all your money for this project, and all of the money will send directly to them soon.`}
                  </label>
                  <br />
                  <span className="underline italic font-bold">
                    This action can not be undo.
                  </span>
                </div>
              </div>
              <div className="w-full grid grid-cols-5 py-8 px-32 gap-4">
                {renderRate()}
              </div>
            </div>
          </>
        );
      default:
        return;
    }
  };

  const handleAction = async () => {
    const { walletConnection, contract } = wallet;
    const { web3Connector } = web3storage;
    switch (actionState) {
      case REMOVE_WARNING:
        break;
      case CANCEL_WARNING:
        setOpenLoading(true);
        await contract
          .reject_project({
            id: projectId,
            rate: rate,
            metadata: "",
          })
          .then((res: any) => {
            console.log(res);
            setOpenLoading(false);
            setTimeout(() => {
              setRate(0);
              router.reload();
            }, 2000);
          });
        break;
      case RATE_WARNING:
        break;
      case REWARD_WARNING:
        break;
      case DISBURSE_WARNING:
        console.log("disburse", projectId);
        setOpenLoading(true);
        await contract
          .approve_project({
            id: projectId,
            rate: rate,
            metadata: "",
          })
          .then((res: any) => {
            console.log(res);
            setOpenLoading(false);
            setTimeout(() => {
              setRate(0);
              router.reload();
            }, 2000);
          });
        break;
      default:
        return;
    }
  };

  return (
    <>
      <Warning
        onShow={openWarning}
        onClose={() => {
          setRate(0);
          setOpenWarning(false);
        }}
        onConfirm={() => {
          handleAction();
        }}
        title={warningTitle}
        content={renderContentWarning()}
        SubmitButtonText="Submit"
      />
      <Notify
        openLoading={openLoading}
        openSnack={openSnack}
        alertType={alertType}
        snackMsg={snackMsg}
        onClose={onCloseSnack}
      />
      <div className="pt-52 py-8 flex lg:px-16 flex-wrap md:flex-row flex-col md:w-full md:px-12 px-8 ">
        <ul className="flex flex-wrap text-sm font-medium text-center w-full rounded-t-lg border-t border-l border-r border-purple md:pl-8 pl-4">
          <li className="mr-2">
            <a
              href="#"
              className={
                "inline-block p-4 rounded-t-lg " +
                (tab == 0
                  ? "border-b border-primary text-purple"
                  : "text-slate-600")
              }
              onClick={() => setTab(0)}
            >
              Saved Projects
            </a>
          </li>
          <li className="mr-2">
            <a
              href="#"
              className={
                "inline-block p-4 rounded-t-lg " +
                (tab == 1
                  ? "border-b border-primary text-purple"
                  : "text-slate-600")
              }
              onClick={() => setTab(1)}
            >
              Backed Projects
            </a>
          </li>
          <li className="mr-2">
            <a
              href="#"
              className={
                "inline-block p-4 rounded-t-lg " +
                (tab == 2
                  ? "border-b border-primary text-purple"
                  : "text-slate-600")
              }
              onClick={() => setTab(2)}
            >
              Completed Projects
            </a>
          </li>
        </ul>
        <div className="h-auto w-full border border-purple rounded-b-lg">
          <div className="md:p-8 p-4">{renderContent()}</div>
        </div>
      </div>
    </>
  );
};

export default ProfileScreen;

const listSavedProject = [
  {
    id: "1",
    title: "Awesome project 1",
    owner: "ciuz.testnet",
    description: "Something here ...",
    pledge: 100,
    total_pledge: 200,
    milestone: new Date(),
  },
  {
    id: "2",
    title: "Awesome project 2",
    owner: "ciuz.testnet",
    description: "Something here ...",
    pledge: 200,
    total_pledge: 300,
    milestone: new Date(),
  },
  {
    id: "3",
    title: "Awesome project 3",
    owner: "ciuz.testnet",
    description: "Something here ...",
    pledge: 100,
    total_pledge: 2000,
    milestone: new Date(),
  },
];
const listOwnProject = [
  {
    id: "4",
    title: "Awesome project 4",
    owner: "ciuz.testnet",
    description: "Something here ...",
    pledge: 100,
    total_pledge: 200,
    milestone: new Date(),
  },
  {
    id: "5",
    title: "Awesome project 5",
    owner: "ciuz.testnet",
    description: "Something here ...",
    pledge: 200,
    total_pledge: 300,
    milestone: new Date(),
  },
  {
    id: "6",
    title: "Awesome project 6",
    owner: "ciuz.testnet",
    description: "Something here ...",
    pledge: 100,
    total_pledge: 2000,
    milestone: new Date(),
  },
];
