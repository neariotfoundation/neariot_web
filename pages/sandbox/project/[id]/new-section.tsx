import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import CustomButton from "../../../../components/CustomButton";
import Notify from "../../../../components/Notify";
import { ProjectData } from "../../../../helpers/types";

const NewSectionScreen = memo(() => {
  const [openLoading, setOpenLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [snackMsg, setSnackMsg] = useState("");
  const [title, setTitle] = useState<any>();
  const [descriptions, setDescriptions] = useState<any>();
  const [embeddedURL, setEmbeddedURL] = useState<any>();
  const [type, setType] = useState<any>();
  const wallet = useSelector((state: any) => state.wallet);
  const web3storage = useSelector((statex: any) => statex.w3storage);
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<ProjectData>();
  const [filename, setFilename] = useState<string>("");
  const fileInput = useRef();

  useEffect(() => {
    setType("image");
  }, []);

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
      // check user is owner of project
      if (userId !== project.owner) {
        router.push(`/project/${id}`);
        return;
      }
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
        section: _data.section || [],
        pledgers: project.total_pledge + "",
        project_target: _data.project_target + "",
        avg_rate: project.avg_rate + "",
        project_rate: _data.project_rate + "",
        chart: _data.chart || "table",
        apiKey: _data.apiKey || "",
        fee: _data.fee || "",
      });
      setOpenLoading(false);
    })();
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

  const onRequestConnectWallet = () => {
    const { nearConfig, walletConnection } = wallet;
    walletConnection?.requestSignIn?.(nearConfig?.contractName);
  };

  const getDataWeb3 = async (cid: any) => {
    const { web3Connector } = web3storage;
    return await web3Connector
      .getData(cid)
      .then((res: any) => {
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

  const handleChangeFileValue = (e: any) => {
    const [file] = e.target.files;
    fileInput.current = e.target.files[0];
  };

  const handelCreateNewSection = (e: any) => {
    e.preventDefault();
    setOpenLoading(true);
    const { walletConnection, contract } = wallet;
    const userId = walletConnection.getAccountId();
    if (userId === "") {
      onRequestConnectWallet();
      return;
    }
    (async () => {
      const project = await getProject(id);
      const _data = await getDataWeb3(project.metadata);
      const section = _data.section || [];
      let media_cid = "";
      if (type === "image") {
        media_cid = await web3storage.web3Connector.setFile(
          userId,
          fileInput
          // imageState,
        );
        console.log(media_cid);
      }
      section.push({
        id: Date.now() + "",
        title: title,
        descriptions: descriptions,
        embeddedURL: embeddedURL || "",
        image: media_cid || "",
        type: type,
      });
      const metadata = {
        ..._data,
        section: section,
        // section: [],
      };
      const cid = await web3storage.web3Connector.setData(
        userId,
        filename,
        metadata
      );
      const result = await contract
        .update_project(
          {
            id: id,
            metadata: cid,
          },
          50000000000000
        )
        .then((res: any) => {
          onShowResult({
            type: "success",
            msg: "Create new section successfully",
          });
          router.push(`/sandbox/project/${id}`);
        })
        .catch((error: any) => {
          onShowResult({
            type: "error",
            msg: String(error),
          });
        });
    })();
  };

  const renderMediaPicker = useCallback(() => {
    if (type === "image") {
      return (
        <div className="flex md:flex-row flex-col">
          <div className="md:w-4/12 lg:w-2/12 item-center align-middle mr-5 whitespace-nowrap my-auto pb-2 w-full">
            <label></label>
          </div>
          <div className="md:w-8/12 lg:w-10/12 items-center align-middle my-auto pb-2 w-full">
            <input
              id="inpFile"
              type="file"
              name="inpFile"
              className={
                "placeholder-slate-400 text-slate-600 border-0 px-3 py-3 bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring w-full overflow-x-hidden"
              }
              placeholder="Type something here"
              onChange={handleChangeFileValue}
            />
          </div>
        </div>
      );
    }
    return (
      <div className="flex md:flex-row flex-col">
        <div className="md:w-4/12 lg:w-2/12 item-center align-middle mr-5 whitespace-nowrap my-auto pb-2 w-full">
          <label htmlFor="inpURL">Embedded URL</label>
        </div>
        <div className="md:w-8/12 lg:w-10/12 items-center align-middle my-auto pb-2 w-full">
          <input
            id="inpURL"
            type="text"
            name="inpURL"
            className={
              "placeholder-slate-400 text-slate-600 border-0 px-3 py-3 bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring w-full overflow-x-hidden "
            }
            placeholder="Type something here"
            onChange={(e) => {
              setEmbeddedURL(e.target.value);
            }}
          />
        </div>
      </div>
    );
  }, [type]);
  return (
    <>
      <Notify
        openLoading={openLoading}
        openSnack={openSnack}
        alertType={alertType}
        snackMsg={snackMsg}
        onClose={onCloseSnack}
      />
      <div className="pt-52 y-8 items-center flex flex-wrap md:flex-row flex-col h-full md:w-full mx-auto lg:px-16 md:px-12 px-8">
        <div className="mb-8 md:mx-4 w-full">
          <div className="pb-4">
            <label htmlFor="" className="text-lg text-slate-800">
              Add new Section
            </label>
          </div>
        </div>
        <hr className="w-full md:mx-4  md:max-w-[40%] border-slate-400 mb-8" />
        <div className="w-full lg:px-32 md:px-24 sm:px-8">
          <form onSubmit={handelCreateNewSection}>
            <div className="flex md:flex-row flex-col">
              <div className="md:w-4/12 lg:w-2/12 items-center align-middle mr-5 whitespace-nowrap my-auto pb-2 w-full">
                <label htmlFor="inpTitle">Title</label>
              </div>
              <div className="md:w-8/12 lg:w-10/12 items-center align-middle my-auto pb-2 w-full">
                <input
                  id="inpTitle"
                  type="text"
                  name="inpTitle"
                  className={
                    "placeholder-slate-400 text-slate-600 border-0 px-3 py-3 bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring w-full overflow-x-hidden "
                  }
                  placeholder="Type something here"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex md:flex-row flex-col">
              <div className="md:w-4/12 lg:w-2/12 item-center align-middle mr-5 whitespace-nowrap my-auto pb-2 w-full">
                <label htmlFor="inpDes">Decriptions </label>
              </div>
              <div className="md:w-8/12 lg:w-10/12 item-center align-middle  my-auto pb-2 w-full">
                <textarea
                  id="inpDes"
                  name="inpDes"
                  placeholder="Type something here"
                  className="border-0 px-3 py-3 placeholder-slate-400 text-slate-600 bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring w-full my-auto overflow-x-hidden"
                  onChange={(e) => {
                    setDescriptions(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex md:flex-row flex-col">
              <div className="md:w-4/12 lg:w-2/12 item-center align-middle mr-5 whitespace-nowrap my-auto pb-2 w-full">
                <label>Media </label>
              </div>
              <div className="md:w-8/12 lg:w-10/12 item-center align-middle  my-auto pb-2 w-full">
                <input
                  type="radio"
                  name="type"
                  id="rdImage"
                  className="mr-2"
                  value={"image"}
                  defaultChecked
                  onClick={() => {
                    setType("image");
                  }}
                />
                <label className="ml-2 text-slate-800" htmlFor="rdImage">
                  Image
                </label>
                <input
                  type="radio"
                  name="type"
                  id="rdVideo"
                  className="mr-2 ml-4"
                  value={"video"}
                  onClick={() => {
                    setType("video");
                  }}
                />
                <label className="ml-2 text-slate-800" htmlFor="rdVideo">
                  Video
                </label>
              </div>
            </div>
            {renderMediaPicker()}
            <div className="flex flex-row mb-2">
              <CustomButton
                className_box=" py-2 lg:w-6/12 md:w-4/12 w-full mx-auto my-4"
                className_button="py-2"
                // onClickButton={handleCreateProject}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
});

NewSectionScreen.displayName = "NewSectionScreen";

export default NewSectionScreen;
