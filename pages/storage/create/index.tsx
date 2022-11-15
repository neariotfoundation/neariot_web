import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomButton from "../../../components/CustomButton";
import Explore from "../../../components/Explore";
import Notify from "../../../components/Notify";

const CreateScreen = memo((props: any) => {
  const wallet = useSelector((state: any) => state.wallet);
  const [name, setName] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [nameError, setNameError] = useState(false);
  const [desError, setDesError] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [snackMsg, setSnackMsg] = useState("");
  const router = useRouter();
  const [user, setUser] = useState(null);

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

  const handleCreateStorage = useCallback(
    async (e: any) => {
      e.preventDefault();
      const { walletConnection } = wallet;
      const userId = walletConnection.getAccountId();
      if (userId === "") {
        onRequestConnectWallet();
        return;
      }

      // if (user == null) {
      //   return onShowResult({
      //     type: "error",
      //     msg: "System busy! try again later",
      //   });
      // }
      if (name === "" || name === null || typeof name === "undefined") {
        setNameError(true);
        return onShowResult({
          type: "error",
          msg: "Name could not be empty",
        });
      }
      if (
        descriptions === "" ||
        descriptions === null ||
        typeof descriptions === "undefined"
      ) {
        setDesError(true);
        return onShowResult({
          type: "error",
          msg: "Description could not be empty",
        });
      }

      setOpenLoading(true);
      const { contract } = wallet;
      // console.log(contract)
      await contract
        ?.new_cluster?.(
          {
            name: name,
            description: descriptions,
          },
          50000000000000
        )
        .then((res: any) => {
          if (res) {
            router.push("/storage/detail?id=" + res);
          } else {
            onShowResult({
              type: "error",
              msg: "Creat form failure",
            });
          }
        })
        .catch((error: any) => {
          onShowResult({
            type: "error",
            msg: String(error),
          });
        });
    },
    [name, descriptions]
  );

  return (
    <>
      <Notify
        openLoading={openLoading}
        openSnack={openSnack}
        alertType={alertType}
        snackMsg={snackMsg}
        onClose={onCloseSnack}
      />
      <div className="pt-52 items-center flex flex-wrap md:flex-row flex-col h-full md:w-full mx-auto lg:px-16 md:px-12 px-8">
        <div className="mb-8 md:mx-4 w-full">
          <div className="pb-4">
            <label className="text-lg text-slate-800 ">
              Create new Storage
            </label>
          </div>
        </div>
        <hr className="w-full md:mx-4  md:max-w-[40%] border-slate-400 mb-8" />
        <div className="w-full lg:px-48 md:px-32 sm:px-16">
          <form className="" onSubmit={handleCreateStorage}>
            <div className="flex md:flex-row flex-col">
              <div className="md:w-4/12 lg:w-2/12 item-center align-middle mr-5 whitespace-nowrap my-auto pb-2 w-full">
                <label htmlFor="inpName">Name </label>
                <span className="text-red-700">*</span>
              </div>
              <div className="md:w-8/12 lg:w-10/12 item-center align-middle  my-auto pb-2 w-full">
                <input
                  type="text"
                  name="inpName"
                  className={
                    "placeholder-slate-400 text-slate-600 border-0 px-3 py-3 bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring w-full overflow-x-hidden "
                  }
                  placeholder="Type something here"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex md:flex-row flex-col mb-2">
              <div className="md:w-4/12 lg:w-2/12 item-center align-middle mr-5 whitespace-nowrap my-auto pb-2 w-full">
                <label htmlFor="inpDes">Decriptions </label>
                <span className="text-red-700">*</span>
              </div>
              <div className="md:w-8/12 lg:w-10/12 item-center align-middle  my-auto pb-2 w-full">
                <textarea
                  name="inpDes"
                  placeholder="Type something here"
                  className="border-0 px-3 py-3 placeholder-slate-400 text-slate-600 bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring w-full my-auto overflow-x-hidden"
                  onChange={(e) => {
                    setDescriptions(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-nowrap flex-row mb-2">
              <div className="lg:w-2/12 ml-auto lg:mr-2 md:w-4/12 h-4 md:mx-2 my-auto "></div>
              <div className="overflow-x-auto md:w-8/12 lg:w-10/12 flex">
                <input
                  required
                  type="checkbox"
                  className=" align-middle my-auto lg:w-4 md:w-8 mx-2 "
                  id="check1"
                  onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Please check this box to continue')}
                  onInput={e=>(e.target as HTMLInputElement).setCustomValidity('')}
                />
                <label className="" htmlFor="check1">
                  {`By clicking the submit button below, I hereby agree to and accept the following terms and conditions`}
                </label>
              </div>
            </div>
            <div className="flex flex-nowrap flex-row mb-2">
              <div className="lg:w-2/12 ml-auto lg:mr-2 md:w-4/12 h-4 md:mx-2 my-auto "></div>
              <div className="overflow-x-auto md:w-8/12 lg:w-10/12 flex">
                <input
                  required
                  type="checkbox"
                  className=" align-middle my-auto lg:w-4 md:w-8 mx-2 "
                  id="check2"
                  onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Please check this box to continue')}
                  onInput={e=>(e.target as HTMLInputElement).setCustomValidity('')}
                />
                <label className="" htmlFor="check2" >
                  {`By clicking the submit button below, you will spend 0.1 NEAR as a fee for this storage`}
                </label>
              </div>
            </div>
            <div className="flex flex-row mb-2">
              <CustomButton
                className_box="px-2 py-2 lg:w-6/12 md:w-4/12 w-full mx-auto my-4"
                className_button="py-2"
                // onClickButton={handleCreateStorage}
              />
            </div>
          </form>
        </div>
        <Explore />
      </div>
    </>
  );
});

CreateScreen.displayName = "create_screen";

export default CreateScreen;
