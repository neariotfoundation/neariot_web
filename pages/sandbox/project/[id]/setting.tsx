import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CustomButton from "../../../../components/CustomButton";
import Notify from "../../../../components/Notify";
import { ProjectData } from "../../../../helpers/types";

const SettingScreen = memo(() => {
  const [openLoading, setOpenLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [snackMsg, setSnackMsg] = useState("");
  const [currentChart, setCurrentChart] = useState<any>("");
  const [data, setData] = useState<ProjectData>({
    id: "",
    owner: "",
    name: "",
    descriptions: "",
    repository: "",
    created_at: "",
    data: [],
    noSetting: false,
    section: [],
    pledgers: 0,
    project_target: 0,
    avg_rate: 0,
    project_rate: 0,
    fee: "",
    apiKey: "",
  });
  const [newData, setNewData] = useState<any>();
  const [updateDataPage, setUpdateDataPage] = useState(false);
  const [filename, setFilename] = useState<string>("");
  const wallet = useSelector((state: any) => state.wallet);
  const web3storage = useSelector((statex: any) => statex.w3storage);
  const router = useRouter();
  const { id } = router.query;

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
      // check user is owner of project
      if (project.owner !== userId) {
        router.push(`/sandbox/project/${id}`);
        return;
      }
      const _data = await getDataWeb3(project.metadata);
      setData({
        id: project.id,
        owner: userId,
        name: _data.name,
        // type: _data.type,
        descriptions: _data.descriptions,
        repository: _data.repository,
        created_at: project.created_at,
        noSetting: _data.noSetting,
        data: _data.data,
        section: _data.section || [],
        pledgers: project.total_pledge + "",
        project_target: _data.project_target + "",
        avg_rate: project.avg_rate + "",
        project_rate: _data.project_rate + "",
        chart: _data.chart || "table",
        apiKey: _data.apiKey || "",
        fee: _data.fee || "",
      });
      setCurrentChart(_data.chart || "table");
      setOpenLoading(false);
    })();
  }, []);

  const getDataWeb3 = async (cid: any) => {
    const { web3Connector } = web3storage;
    return await web3Connector
      .getData(cid)
      .then((res: any) => {
        // setFilename(res.name);
        // return JSON.parse(res.content);
        setFilename(res.filename);
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

  const handleChangeSetting = useCallback(
    async (e: any) => {
      e.preventDefault();
      const { walletConnection } = wallet;
      const userId = walletConnection.getAccountId();
      if (userId === "") {
        onRequestConnectWallet();
        return;
      }
      if (
        data.name === "" ||
        data.name === null ||
        typeof data.name === "undefined"
      ) {
        return onShowResult({
          type: "error",
          msg: "Name could not be empty",
        });
      }
      if (
        data.descriptions === "" ||
        data.descriptions === null ||
        typeof data.descriptions === "undefined"
      ) {
        return onShowResult({
          type: "error",
          msg: "Description could not be empty",
        });
      }
      // if (
      //   data.type === "" ||
      //   data.type === null ||
      //   typeof data.type === "undefined"
      // ) {
      //   return onShowResult({
      //     type: "error",
      //     msg: "Type could not be empty",
      //   });
      // }

      setOpenLoading(true);
      const { web3Connector } = web3storage;
      const cid = await web3Connector.setData(userId, filename, data);
      updateProject(cid);
    },
    [data, filename]
  );

  const updateProject = useCallback(async (cid: any) => {
    const { contract } = wallet;
    await contract
      ?.update_project(
        {
          id: id,
          metadata: cid,
        },
        50000000000000
      )
      .then((res: any) => {
        onShowResult({
          type: "success",
          msg: String("Suscess"),
        });
        router.push("/sandbox/project/" + id);
      })
      .catch((error: any) => {
        onShowResult({
          type: "error",
          msg: String(error),
        });
      });
  }, []);

  useEffect(() => {
    setData({ ...data, chart: currentChart });
  }, [currentChart]);

  const renderPage = () => {
    if (
      updateDataPage &&
      (data.chart == "line-chart" || data.chart == "column-chart")
    ) {
      return (
        <>
          <div className="mb-8 md:mx-4 w-full flex justify-between">
            <div className="my-auto">
              <label className="text-lg text-slate-800 ">
                Update your data
              </label>
            </div>
          </div>
          <hr className="w-full md:mx-4  md:max-w-[40%] border-slate-400 mb-8" />
          <div className="w-full lg:px-48 md:px-32 sm:px-16">
            <form method="post" onSubmit={handleChangeSetting}>
              <div className="flex md:flex-row flex-col">
                <div className="md:w-4/12 lg:w-2/12 item-center align-middle mr-5 whitespace-nowrap my-auto pb-2 w-full">
                  <label htmlFor="inpName">X Data </label>
                </div>
                <div className="md:w-8/12 lg:w-10/12 item-center align-middle  my-auto pb-2 w-full">
                  <input
                    id="inpName"
                    type="text"
                    name="inpName"
                    className={
                      "placeholder-slate-400 text-slate-600 border-0 px-3 py-3 bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring w-full overflow-x-hidden  shadow-indigo-500/50"
                    }
                    placeholder="Type something here"
                    value={""}
                    onChange={(e) => {
                      setData({ ...data, name: e.target.value });
                    }}
                  />
                </div>
              </div>
              <div className="flex md:flex-row flex-col">
                <div className="md:w-4/12 lg:w-2/12 item-center align-middle mr-5 whitespace-nowrap my-auto pb-2 w-full">
                  <label htmlFor="inpName">Y Data </label>
                </div>
                <div className="md:w-8/12 lg:w-10/12 item-center align-middle  my-auto pb-2 w-full">
                  <input
                    id="inpName"
                    type="text"
                    name="inpName"
                    className={
                      "placeholder-slate-400 text-slate-600 border-0 px-3 py-3 bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring w-full overflow-x-hidden  shadow-indigo-500/50"
                    }
                    placeholder="Type something here"
                    value={data.name}
                    onChange={(e) => {
                      setData({ ...data, name: e.target.value });
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-row mb-2">
                <CustomButton
                  label="Add"
                  className_box="px-2 py-2 lg:w-6/12 md:w-4/12 w-full mx-auto my-4"
                  className_button="py-2"
                />
              </div>
            </form>
          </div>
        </>
      );
    } else if (updateDataPage && data.chart == "table") {
      return (
        <>
          <div className="mb-8 md:mx-4 w-full flex justify-between">
            <div className="my-auto">
              <label className="text-lg text-slate-800 ">
                Update your data
              </label>
            </div>
          </div>
          <hr className="w-full md:mx-4  md:max-w-[40%] border-slate-400 mb-8" />
          <div className="w-full lg:px-48 md:px-32 sm:px-16">
            <form method="post" onSubmit={handleChangeSetting}>
              <div className="flex md:flex-row flex-col">
                <div className="md:w-4/12 lg:w-2/12 item-center align-middle mr-5 whitespace-nowrap my-auto pb-2 w-full">
                  <label htmlFor="inpName">Your Data </label>
                </div>
                <div className="md:w-8/12 lg:w-10/12 item-center align-middle  my-auto pb-2 w-full">
                  <input
                    id="inpName"
                    type="text"
                    name="inpName"
                    className={
                      "placeholder-slate-400 text-slate-600 border-0 px-3 py-3 bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring w-full overflow-x-hidden  shadow-indigo-500/50"
                    }
                    placeholder="Type something here"
                    value={""}
                    onChange={(e) => {
                      setData({ ...data, name: e.target.value });
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-row mb-2">
                <CustomButton
                  label="Add"
                  className_box="px-2 py-2 lg:w-6/12 md:w-4/12 w-full mx-auto my-4"
                  className_button="py-2"
                />
              </div>
            </form>
          </div>
        </>
      );
    }
    return (
      <>
        <div className="pt-52 mb-8 md:mx-4 w-full flex justify-between">
          <div className="my-auto">
            <label className="text-lg text-slate-800 ">
              Change your project setting
            </label>
          </div>
          <div className="">
            <CustomButton
              label="Update your data"
              className_box="px-2 py-2 mx-auto "
              className_button="py-2"
            />
          </div>
        </div>
        <hr className="w-full md:mx-4  md:max-w-[40%] border-slate-400 mb-8" />
        <div className="w-full lg:px-48 md:px-32 sm:px-16">
          <form method="post" onSubmit={handleChangeSetting}>
            <div className="flex md:flex-row flex-col">
              <div className="md:w-4/12 lg:w-2/12 item-center align-middle mr-5 whitespace-nowrap my-auto pb-2 w-full">
                <label htmlFor="inpName">Name </label>
                <span className="text-red-700">*</span>
              </div>
              <div className="md:w-8/12 lg:w-10/12 item-center align-middle  my-auto pb-2 w-full">
                <input
                  id="inpName"
                  type="text"
                  name="inpName"
                  className={
                    "placeholder-slate-400 text-slate-600 border-0 px-3 py-3 bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring w-full overflow-x-hidden  shadow-indigo-500/50"
                  }
                  placeholder="Type something here"
                  value={data.name}
                  onChange={(e) => {
                    setData({ ...data, name: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className="flex md:flex-row flex-col">
              <div className="md:w-4/12 lg:w-2/12 item-center align-middle mr-5 whitespace-nowrap my-auto pb-2 w-full">
                <label htmlFor="inpDes">Decriptions </label>
                <span className="text-red-700">*</span>
              </div>
              <div className="md:w-8/12 lg:w-10/12 item-center align-middle  my-auto pb-2 w-full">
                <textarea
                  id="inpDes"
                  name="inpDes"
                  placeholder="Type something here"
                  value={data.descriptions}
                  className="border-0 px-3 py-3 placeholder-slate-400 text-slate-600 bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring w-full my-auto overflow-x-hidden shadow-indigo-500/50"
                  onChange={(e) => {
                    setData({ ...data, descriptions: e.target.value });
                  }}
                />
              </div>
            </div>
            {/* <div className="flex md:flex-row flex-col">
              <div className="md:w-4/12 lg:w-2/12 item-center align-middle mr-5 whitespace-nowrap my-auto pb-2 w-full">
                <label>Type </label>
                <span className="text-red-700">*</span>
              </div>
              <div className="md:w-8/12 lg:w-10/12 item-center align-middle  my-auto pb-2 w-full">
                <select
                  className={
                    "placeholder-slate-400 text-slate-600 border-0 px-3 py-3 bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring w-full overflow-x-hidden shadow-indigo-500/50"
                  }
                  placeholder="Type something here"
                  value={data.type}
                  onChange={(e) => {
                    setData({ ...data, type: e.target.value });
                  }}
                >
                  <option value="0" className="">
                    Public
                  </option>
                  <option value="1" className="">
                    Private
                  </option>
                </select>
              </div>
            </div> */}
            <div className="flex md:flex-row flex-col">
              <div className="md:w-4/12 lg:w-2/12 item-center align-middle mr-5 whitespace-nowrap my-auto pb-2 w-full">
                <label htmlFor="inpRepository">Repository </label>
              </div>
              <div className="md:w-8/12 lg:w-10/12 item-center align-middle  my-auto pb-2 w-full">
                <input
                  id="inpRepository"
                  type="text"
                  name="inpRepository"
                  className={
                    "placeholder-slate-400 text-slate-600 border-0 px-3 py-3 bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring w-full overflow-x-hidden  shadow-indigo-500/50"
                  }
                  placeholder="Type something here"
                  value={data.repository}
                  onChange={(e) => {
                    setData({ ...data, repository: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className="flex md:flex-row flex-col mb-2">
              <div className="md:w-4/12 lg:w-2/12 item-center align-middle mr-5 whitespace-nowrap my-auto pb-2 w-full">
                <label htmlFor="inpFee">Subcribe Fee </label>
              </div>
              <div className="md:w-8/12 lg:w-10/12 item-center align-middle  my-auto pb-2 w-full">
                <input
                  id="inpFee"
                  type="text"
                  name="inpFee"
                  value={data.fee}
                  className={
                    "placeholder-slate-400 text-slate-600 border-0 px-3 py-3 bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring w-full overflow-x-hidden  shadow-indigo-500/50"
                  }
                  placeholder="Type something here"
                  onChange={(e) => {
                    setData({ ...data, fee: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className="flex md:flex-row flex-col mb-2">
              <div className="md:w-4/12 lg:w-2/12 item-center align-middle mr-5 whitespace-nowrap my-auto pb-2 w-full">
                <label htmlFor="">
                  Select how your data display( Default is table)
                </label>
              </div>
            </div>
            <div className="flex md:flex-row flex-col mb-2  md:mx-auto">
              <div
                className={
                  "hover:cursor-pointer hover:border hover:border-indigo-600 rounded-lg p-2 mx-2 " +
                  (currentChart == "table" ? "border border-indigo-600" : "")
                }
                onClick={() => {
                  setCurrentChart("table");
                }}
              >
                <img
                  src="/table.svg"
                  alt=""
                  className="w-6/12 object-contain items-center mx-auto mb-4"
                />
                <div className="flex justify-center">Table</div>
              </div>
              <div
                className={
                  "hover:cursor-pointer hover:border hover:border-indigo-600 rounded-lg p-2 mx-2 " +
                  (currentChart == "line-chart"
                    ? "border border-indigo-600"
                    : "")
                }
                onClick={() => {
                  setCurrentChart("line-chart");
                }}
              >
                <img
                  src="/line-chart.svg"
                  alt=""
                  className="w-6/12 object-contain items-center mx-auto mb-4"
                />
                <div className="flex justify-center">Line Chart</div>
              </div>
              <div
                className={
                  "hover:cursor-pointer hover:border hover:border-indigo-600 rounded-lg p-2 mx-2 " +
                  (currentChart == "column-chart"
                    ? "border border-indigo-600"
                    : "")
                }
                onClick={() => {
                  setCurrentChart("column-chart");
                }}
              >
                <img
                  src="/col-chart.svg"
                  alt=""
                  className="w-6/12 object-contain items-center mx-auto mb-4"
                />
                <div className="flex justify-center">Column Chart</div>
              </div>
              <div
                className={
                  "hover:cursor-pointer hover:border hover:border-indigo-600 rounded-lg p-2 mx-2 " +
                  (currentChart == "pie-chart"
                    ? "border border-indigo-600"
                    : "")
                }
                onClick={() => {
                  setCurrentChart("pie-chart");
                }}
              >
                <img
                  src="/pie-chart.svg"
                  alt=""
                  className="w-6/12 object-contain items-center mx-auto mb-4"
                />
                <div className="flex justify-center">Pie Chart</div>
              </div>
            </div>
            <div className="flex md:flex-row flex-col mb-2">
              <div className="md:w-4/12 lg:w-2/12 item-center align-middle mr-5 whitespace-nowrap my-auto pb-2 w-full">
                <label htmlFor="inpAPIKey">Your API Key </label>
              </div>
              <div className="md:w-8/12 lg:w-10/12 item-center align-middle  my-auto pb-2 w-full">
                <input
                  id="inpAPIKey"
                  type="text"
                  name="inpAPIKey"
                  value={data.apiKey}
                  className={
                    "placeholder-slate-400 text-slate-600 border-0 px-3 py-3 bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring w-full overflow-x-hidden  shadow-indigo-500/50"
                  }
                  placeholder="Type something here"
                  onChange={(e) => {
                    setData({ ...data, apiKey: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className="flex flex-row mb-2">
              <CustomButton
                label="Save Changes"
                className_box="px-2 py-2 lg:w-6/12 md:w-4/12 w-full mx-auto my-4"
                className_button="py-2"
              />
            </div>
          </form>
        </div>
      </>
    );
  };

  return (
    <>
      <Notify
        openLoading={openLoading}
        openSnack={openSnack}
        alertType={alertType}
        snackMsg={snackMsg}
        onClose={onCloseSnack}
      />
      <div className="lg:py-16 md:py-12 py-8 items-center flex flex-wrap md:flex-row flex-col h-full md:w-full mx-auto lg:px-16 md:px-12 px-8">
        {renderPage()}
      </div>
    </>
  );
});

SettingScreen.displayName = "Setting screen";

export default SettingScreen;
