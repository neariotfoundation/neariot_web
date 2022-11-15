import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CustomButton from "../../../components/CustomButton";
import Explore from "../../../components/Explore";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { sha256 } from "crypto-hash";
import { formatDate } from "../../../helpers/Utils";
import Notify from "../../../components/Notify";

const DetailScreen = memo(() => {
  const [storageId, setStorageId] = useState<any>("");
  const [data, setData] = useState<any>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [apiKey, setApiKey] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [secrectKey, setSecrectKey] = useState("");
  const [updateData, setUpdateData] = useState<any[]>();
  const [isEditing, setIsEditing] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [snackMsg, setSnackMsg] = useState("");
  const param = useRef<any>({ name: "", description: "" });
  const wallet = useSelector((state: any) => state.wallet);
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    (async () => {
      await getDetail();
    })();
  }, []);

  useEffect(() => {
    if (router.query.id) {
      setStorageId(router.query.id);
    }
  }, [router]);

  const getDetail = async () => {
    const { id } = query;
    let content = "";
    if (id === null || id === "" || id === undefined) {
      content = "Could not found any object have that id!";
      router.back();
      return;
    }
    const { contract } = wallet;
    setOpenLoading(true);
    await contract
      ?.get_cluster_data(
        {
          id: id,
        },
        50000000000000
      )
      .then((res: any) => {
        if (res) {
          setData({
            id: res.id,
            name: res.name,
            description: res.description,
            apikey_hash: res.apikey_hash,
            data: res.data,
            create_at: formatDate(res.create_at / 1000000),
            update_at: formatDate(res.update_at / 1000000),
          });
          param.current = { name: res.name, description: res.description };
          setName(res.name);
          setDescription(res.description);
          setOpenLoading(false);
        } else {
          console.log(res);
          router.back();
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
    const sampleDate = [
      {
        time: "5/18/2022 17:00:00",
        value: "Value 1",
      },
      {
        time: "5/18/2022 16:00:00",
        value: "Value 2",
      },
      {
        time: "5/18/2022 15:00:00",
        value: "Value 3",
      },
      {
        time: "5/18/2022 14:00:00",
        value: "Value 4",
      },
      {
        time: "5/18/2022 13:00:00",
        value: "Value 5",
      },
    ];
    setUpdateData(sampleDate);
  };

  const handleEdit = useCallback(
    async (e: any) => {
      e.preventDefault();
      const { id } = query;
      const { contract } = wallet;
      setOpenLoading(true);
      await contract
        ?.set_cluster(
          {
            id: id,
            name: param.current.name,
            description: param.current.description,
          },
          50000000000000
        )
        .then((res: any) => {
          if (res) {
            setData({
              id: res.id,
              name: res.name,
              description: res.description,
              apikey_hash: res.apikey_hash,
              data: res.data,
              create_at: formatDate(res.create_at / 1000000),
              update_at: formatDate(res.update_at / 1000000),
            });
            setIsEditing(false);
            setOpenLoading(false);
          } else {
            console.log(res);
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    },
    [name, description]
  );

  const handleGetAPIKey = useCallback(async () => {
    const { contract, walletConnection } = wallet;
    const userId = walletConnection.getAccountId();
    let raw_api_key = secrectKey + userId + storageId + Date.now().toString();
    let generatedApikey = await sha256(raw_api_key);
    let apiKeyHash = await sha256(generatedApikey);
    setOpenLoading(true);
    await contract
      ?.set_apikey_hash({
        id: storageId,
        apikey_hash: apiKeyHash,
      })
      .then((res: any) => {
        if (res) {
          navigator.clipboard.writeText(generatedApikey);
          setApiKey(generatedApikey);
          onShowResult({
            type: "success",
            msg: "Your API has been copied to your clipboard!",
          });
        } else {
          console.log(res);
        }
      })
      .catch((error: any) => {
        onShowResult({
          type: "error",
          msg: String(error),
        });
      });
  }, [secrectKey]);

  const handleDeleteStorage = async () => {
    const { id } = query;
    const { contract } = wallet;
    setOpenLoading(true);
    await contract
      ?.remove_cluster(
        {
          id: id,
        },
        50000000000000
      )
      .then((res: any) => {
        if (res) {
          router.push("/storage");
        } else {
          console.log(res);
        }
      })
      .catch((error: any) => {
        console.log(error);
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

  const Storage = useCallback(() => {
    if (!isEditing) {
      return (
        <div className="lg:w-6/12 w-full h-auto bg-white md:mx-4 rounded-xl my-4 p-2 flex lg:flex-nowrap flex-col">
          {/* <div className="grid grid-cols-2 gap-y-4 overflow-auto"> */}
          <div className="flex flex-row w-full py-2">
            <div className="flex mx-2 w-3/12">Storage Name:</div>
            <div className="flex mx-2 w-8/12">{data?.name || ""}</div>
          </div>
          <div className="flex flex-row w-full py-2">
            <div className="flex mx-2 w-3/12">Decription:</div>
            <div className="flex mx-2 w-8/12">
              <span className="flex-start flex w-full">
                {data?.description || ""}
              </span>
            </div>
            <div
              className="flex px-2  my-auto cursor-pointer hover:ring hover:outline-none items-center h-full align-middle"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              <EditIcon className="item-center" />
            </div>
          </div>
          <div className="flex flex-row w-full py-2">
            <div className="flex mx-2 w-3/12">Create At:</div>
            <div className="flex mx-2 w-8/12">{data?.create_at}</div>
          </div>
          <div className="flex flex-row w-full py-2">
            <div className="flex mx-2 w-3/12">Update At</div>
            <div className="flex mx-2 w-8/12">{data?.update_at}</div>
          </div>
          {/* </div> */}
        </div>
      );
    }
    return (
      <div className="lg:w-6/12 w-full h-auto bg-white md:mx-4 rounded-xl my-4 p-2 flex lg:flex-nowrap flex-col">
        {/* <div className="grid grid-cols-2 gap-y-4 overflow-auto"> */}
        <div className="flex flex-row w-full py-2">
          <div className="flex mx-2 w-3/12">Storage Name:</div>
          <input
            type="text"
            className="flex mx-2 w-8/12 bg-slate-300 px-2"
            name=""
            id=""
            autoFocus
            defaultValue={name}
            onChange={(e) => {
              setName(e.target.value);
              param.current = { ...param.current, name: e.target.value };
            }}
          />
        </div>
        <div className="flex flex-row w-full py-2">
          <div className="flex mx-2 w-3/12">Decription:</div>
          <div className="flex mx-2 w-8/12">
            <input
              type="text"
              className="flex-start flex w-full bg-slate-300 px-2"
              name=""
              id=""
              defaultValue={description}
              onChange={(e) => {
                setDescription(e.target.value);
                param.current = {
                  ...param.current,
                  description: e.target.value,
                };
              }}
            />
          </div>
          <div
            className="flex my-auto cursor-pointer hover:ring hover:outline-none items-center h-full align-middle"
            onClick={handleEdit}
          >
            <SaveIcon className="item-center" />
          </div>
        </div>
        <div className="flex flex-row w-full py-2">
          <div className="flex mx-2 w-3/12">Create At:</div>
          <div className="flex mx-2 w-8/12">{data?.create_at}</div>
        </div>
        <div className="flex flex-row w-full py-2">
          <div className="flex mx-2 w-3/12">Update At</div>
          <div className="flex mx-2 w-8/12">{data?.update_at}</div>
        </div>
        {/* </div> */}
      </div>
    );
  }, [data, isEditing]);

  return (
    <>
      <Notify
        openLoading={openLoading}
        openSnack={openSnack}
        alertType={alertType}
        snackMsg={snackMsg}
        onClose={onCloseSnack}
      />
      {showModal && (
        <>
          <div
            className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-40 outline-none focus:outline-none bg-gray-500 bg-opacity-70 rounded"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="fixed w-auto my-auto items-center inset-0 mx-auto  max-w-3xl max-h-fit shadow-2xl shadow-black sm:w-4/12 z-50 rounded">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full h-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-center p-5 border-b border-solid border-gray-300 rounded ">
                <h3 className="text-3xl font=semibold">
                  Generate your API Key
                </h3>
              </div>
              <div className="relative p-6 flex">
                <form className="bg-gray-200 shadow-md rounded  pt-6 pb-8 w-full">
                  <label className="text-black text-sm font-bold mb-1 w-3/12 mx-4">
                    Secret Key
                  </label>
                  <input
                    className="shadow appearance-none border-slate-700 border rounded py-2 px-2 text-black w-9/12"
                    onChange={(e) => {
                      setSecrectKey(e.target.value);
                    }}
                  />
                </form>
              </div>
              <div className="flex items-center justify-center p-6 border-t border-solid border-blueGray-200 rounded-b">
                <CustomButton
                  label="Generate your API Key"
                  className_box="my-auto md:py-4 py-2 "
                  className_button="p-2"
                  onClickButton={handleGetAPIKey}
                />
              </div>
            </div>
          </div>
        </>
      )}
      <div className="pt-52 items-center flex flex-wrap md:flex-row flex-col h-full md:w-full mx-auto lg:px-16 md:px-12 px-8">
        <div className="flex lg:flex-nowrap flex-wrap w-full pb-12">
          {Storage()}
          <div className="lg:w-6/12 w-full h-auto bg-transparent md:mx-4 rounded-xl my-4 p-2 flex lg:flex-nowrap flex-row">
            <div className="flex md:flex-nowrap md:flex-row flex-col w-full h-auto items-center align-middle my-auto py-2">
              <div className="flex md:w-6/12 w-full md:justify-end md:mx-4 mx-2 align-middle items-center md:py-4 py-2">
                <CustomButton
                  label="Get API Key"
                  className_box="my-auto md:py-4 py-2 "
                  className_button="p-2"
                  onClickButton={() => {
                    setShowModal(true);
                  }}
                />
              </div>
              <div className="flex md:w-6/12 w-full md:justify-start md:mx-4 mx-2 align-middle items-center md:py-4 py-2">
                <CustomButton
                  label="Delete This Storage"
                  className_box="my-auto md:py-4 py-2 "
                  className_button="p-2"
                  onClickButton={handleDeleteStorage}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex lg:flex-nowrap flex-wrap w-full pb-8">
          <div className="lg:w-8/12 md:w-10/12 w-full h-auto bg-white rounded-xl my-4 p-4 flex lg:flex-nowrap flex-col mx-auto">
            <div className="flex flex-row w-full py-2 ">
              <div className="text-center align-middle mx-auto items-center w-full text-xl font-semibold border-b border-black pb-4">
                Your Last Update
              </div>
            </div>
            <div className="flex flex-row w-full py-2 overflow-x-auto">
              <div className="flex text-lg w-1/12">STT</div>
              <div className="flex text-lg w-8/12">Value</div>
              <div className="flex text-lg w-3/12">Update Time</div>
            </div>
            {updateData?.map((item, index) => {
              return (
                <div
                  className="flex flex-row w-full py-2 overflow-x-auto "
                  key={index}
                >
                  <div className="flex w-1/12 pl-2">{index}</div>
                  <div className="flex w-8/12 ">{item.value}</div>
                  <div className="flex w-3/12 flex-wrap overflow-x-hidden">
                    <div className="">doaklsndoisadjosalndsalkndalksndalks</div>
                    {item.time}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Explore />
      </div>
    </>
  );
});

DetailScreen.displayName = "detail_screen";

export default DetailScreen;
