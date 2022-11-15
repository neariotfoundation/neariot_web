import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import LineChart from "../../../../components/Chart/LineChart";
import Section from "../../../../components/Section";
import { formatDate } from "../../../../helpers/Utils";
import HelpIcon from "@mui/icons-material/Help";
import { Popover, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { ProjectData } from "../../../../helpers/types";
import Notify from "../../../../components/Notify";
import Confirm from "../../../../components/Confirm";

const DetailProcjet = memo(() => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [data, setData] = useState<ProjectData>({
    id: "",
    owner: "",
    name: "",
    // type: "",
    descriptions: "",
    repository: "",
    created_at: "",
    noSetting: true,
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
  const [openConfirm, setOpenConfirm] = useState(false);
  const [sectionId, setSectionId] = useState("");
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
      const _data = await getDataWeb3(project.metadata);
      setData({
        id: project.id,
        owner: _data.owner,
        name: _data.name,
        // type: _data.type,
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

  const handleNewSection = () => {
    router.push(`/sandbox/project/${router.query.id}/new-section`);
  };

  const renderAddSectionButton = () => {
    const owner = data.owner;
    const { walletConnection } = wallet;
    //check owner project
    if (owner === walletConnection.getAccountId()) {
      return (
        <button
          className="col-span-1 bg-purple shadow-lg shadow-indigo-500/50 hover:bg-indigo-800/90 hover:shadow-indigo-500/40 text-white rounded-lg border-0 h-12  items-center px-4"
          onClick={() => handleNewSection()}
        >
          Add new Section
        </button>
      );
    }
    return null;
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
    const owner = data.owner;
    const { walletConnection } = wallet;
    const userId = walletConnection.getAccountId();
    const noSetting = data.noSetting;
    if (owner == userId) {
      return (
        <>
          <button
            className="col-span-1 bg-purple shadow-lg shadow-indigo-500/50 hover:bg-indigo-800/90 hover:shadow-indigo-500/40 text-white rounded-lg border-0  w-full h-12  items-center"
            onClick={() => {
              router.push(`/sandbox/project/${router.query.id}/setting`);
            }}
          >
            Setting
          </button>
          <button className="col-span-1 bg-purple shadow-lg shadow-indigo-500/50 hover:bg-indigo-800/90 hover:shadow-indigo-500/40 text-white rounded-lg border-0  w-full h-12  items-center">
            Share
          </button>
          <button
            className="col-span-1 bg-purple shadow-lg shadow-indigo-500/50 hover:bg-indigo-800/90 hover:shadow-indigo-500/40 text-white rounded-lg border-0  w-full h-12  items-center"
            onClick={() => {
              router.push(`/sandbox/project/${id}/raise-fund`);
            }}
          >
            Raise Fund
          </button>
          <button className="col-span-1 bg-purple shadow-lg shadow-indigo-500/50 hover:bg-indigo-800/90 hover:shadow-indigo-500/40 text-white rounded-lg border-0  w-full h-12  items-center">
            Launch Test
          </button>
        </>
      );
    }
    if (!noSetting) {
      return (
        <>
          <button
            className="col-span-1 bg-purple shadow-lg shadow-indigo-500/50 hover:bg-indigo-800/90 hover:shadow-indigo-500/40 text-white rounded-lg border-0  w-full h-12  items-center"
            onClick={() => handleSubcribe()}
          >
            Subcribe
          </button>
          <button className="col-span-1 bg-purple shadow-lg shadow-indigo-500/50 hover:bg-indigo-800/90 hover:shadow-indigo-500/40 text-white rounded-lg border-0  w-full h-12  items-center">
            Share
          </button>
        </>
      );
    }
    return (
      <>
        <button
          onClick={() => handleSubcribe()}
          className="col-span-1 bg-purple shadow-lg shadow-indigo-500/50 hover:bg-indigo-800/90 hover:shadow-indigo-500/40 text-white rounded-lg border-0  w-full h-12  items-center"
        >
          Subcribe
        </button>
        <button className="col-span-1 bg-purple shadow-lg shadow-indigo-500/50 hover:bg-indigo-800/90 hover:shadow-indigo-500/40 text-white rounded-lg border-0  w-full h-12  items-center">
          Share
        </button>
        <button
          onClick={() => router.push(`/sandbox/project/${id}/backed`)}
          className="col-span-1 bg-purple shadow-lg shadow-indigo-500/50 hover:bg-indigo-800/90 hover:shadow-indigo-500/40 text-white rounded-lg border-0  w-full h-12  items-center"
        >
          Back This Project
        </button>
        <button className="col-span-1 bg-purple shadow-lg shadow-indigo-500/50 hover:bg-indigo-800/90 hover:shadow-indigo-500/40 text-white rounded-lg border-0  w-full h-12  items-center">
          Test Campaign
        </button>
      </>
    );
  }, [data]);

  const renderProjectData = () => {
    const data = true;
    if (data) {
      return (
        <div className="w-full bg-white shadow-purple shadow-sm rounded">
          <LineChart />
        </div>
      );
    }
    return (
      <>
        <div className="w-full md:h-48 h-32 bg-white shadow-purple shadow-sm rounded flex">
          <span className="align-middle items-center inline-block m-auto text-lg">
            This project has no data to shown
          </span>
        </div>
      </>
    );
  };

  const onDeleteSection = async () => {
    setOpenLoading(true);
    const { walletConnection, contract } = wallet;
    const userId = walletConnection.getAccountId();
    const section = data.section || [];
    const index = section.findIndex((item: any) => item.id == sectionId);
    section.splice(index, 1);
    data.section = section;
    const metadata = {
      ...data,
      section: section,
      // section: [],
    };
    const filename = userId + "_" + Date.now();
    const cid = await web3storage.web3Connector.setData(
      userId,
      filename,
      metadata
    );
    await contract
      .update_project(
        {
          id: id,
          metadata: cid,
        },
        50000000000000
      )
      .then((res: any) => {
        setData(metadata);
        onShowResult({
          type: "success",
          msg: "Delete section successfully",
        });
        // router.push(`/sandbox/project/${id}`);
      })
      .catch((error: any) => {
        onShowResult({
          type: "error",
          msg: String(error),
        });
      });
  };

  const onEditSection = (_id: any) => {};

  const renderSection = () => {
    const section = data.section || [];
    if (section.length > 0) {
      return (
        <>
          {section.map((item: any, index: any) => {
            //get image
            return (
              <div className="flex flex-col p-4 pb-8" key={index}>
                <Section
                  id={item.id}
                  title={item.title}
                  description={item.descriptions}
                  image_base64={item.image}
                  embedded_url={item.embeddedURL}
                  type={item.type}
                  onDelete={() => {
                    setOpenConfirm(true);
                    setSectionId(item.id);
                  }}
                  onEdit={onEditSection}
                />
              </div>
            );
          })}
        </>
      );
    }
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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
        onConfirm={(data: any) => {
          onDeleteSection();
        }}
      />
      <div className="w-full mb-12 pt-36"></div>
      <div className="w-full lg:px-16 sm:px-8">
        <div className="flex md:flex-row flex-col p-4 justify-between">
          <div className="md:w-6/12 lg:min-h-[300px] md:min-h-[310px] items-center align-middle my-auto pb-2 w-full rounded bg-white mr-4 shadow-purple shadow-sm  h-full flex-grow">
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
            {/* <div className="flex flex-row w-full py-2 m-2">
              <div className="flex mx-2 w-3/12">Type: </div>
              <span className="flex mx-2 w-9/12 px-2 overflow-x-auto">
                {data.type == "0" ? "Public" : "Private"}
              </span>
            </div> */}
            <div className="flex flex-row w-full py-2 m-2">
              <div className="flex mx-2 w-3/12">Create At: </div>
              <span className="flex mx-2 w-9/12 px-2 overflow-x-auto">
                {formatDate(data.created_at / 1000000)}
              </span>
            </div>
          </div>
          <div className="lg:w-2/12 pb-2 bg-transparent w-0"></div>
          <div className="md:w-4/12 lg:min-h-[300px] md:min-h-[310px] md:w-of items-center align-middle my-auto md:pb-2 w-full rounded bg-white ml-4 shadow-purple shadow-sm h-full">
            <div className="grid grid-flow-row-dense grid-cols-2 grid-rows-2 gap-4 p-2 m-2">
              {renderButton()}
            </div>
            <div className="flex flex-row w-full py-2 m-2">
              <div className="flex mx-2 md:w-4/12 w-2/12">Project Target: </div>
              <span className="flex mx-2 md:w-8/12 w-full px-2 overflow-x-auto">
                {data.pledgers + "/" + data.project_target} NEAR
              </span>
            </div>
            <div className="flex flex-row w-full py-2 m-2">
              <div className="flex mx-2 md:w-4/12 w-2/12">Project Rate: </div>
              <span className="flex mx-2 md:w-8/12 w-full px-2 overflow-x-auto">
                {data.avg_rate + "/" + data.project_rate}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col p-4 pb-8">
          <div className="flex justify-between items-center pb-2">
            <div className=" items-center align-middle h-full text-lg text-slate-800">
              <Typography
                component={"span"}
                aria-owns={open ? "mouse-over-popover" : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
              >
                Project Data
                <div
                  className="inline-block items-center align-baseline  h-full hover:cursor-pointer md:ml-2 hover:text-indigo-800"
                  // onClick={() => handleEdit()}
                >
                  <HelpIcon className="my-auto" fontSize="small" />
                </div>
              </Typography>
              <Popover
                id="mouse-over-popover"
                sx={{
                  pointerEvents: "none",
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
              >
                <Typography component={"div"} sx={{ p: 1 }} className="w-64">
                  Share your realtime update about your project to help
                  investors can learn more.
                </Typography>
              </Popover>
            </div>
            <button className="col-span-1 bg-purple shadow-lg shadow-indigo-500/50 hover:bg-indigo-800/90 hover:shadow-indigo-500/40 text-white rounded-lg border-0 h-12  items-center px-4">
              Explore
            </button>
          </div>
          <hr className="w-full md:mx-4  md:max-w-[40%] border-slate-400 mb-8" />
          {renderProjectData()}
        </div>
        {renderSection()}
        <div className="flex justify-center p-4 pb-8">
          {renderAddSectionButton()}
        </div>
      </div>
    </>
  );
});

DetailProcjet.displayName = "detail_project";

export default DetailProcjet;
