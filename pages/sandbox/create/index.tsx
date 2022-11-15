import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomButton from "../../../components/CustomButton";
import Explore from "../../../components/Explore";
import InputForm from "../../../components/Form/InputForm";
import SelectForm from "../../../components/Form/SelectForm";
import TextAreaForm from "../../../components/Form/TextAreaForm";
import Notify from "../../../components/Notify";

const options = [
  { value: "0", label: "Public" },
  { value: "1", label: "Private" },
];

const CreateScreen = memo((props: any) => {
  const wallet = useSelector((state: any) => state.wallet);
  const web3storage = useSelector((statex: any) => statex.w3storage);
  const [name, setName] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [type, setType] = useState("0");
  const [repository, setRepository] = useState("");
  const [fee, setFee] = useState("");
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

  const handleCreateProject = useCallback(
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
      // if (type === "" || type === null || typeof type === "undefined") {
      //   return onShowResult({
      //     type: "error",
      //     msg: "Type could not be empty",
      //   });
      // }

      const data = {
        owner: userId,
        name,
        descriptions,
        // type,
        repository,
        fee,
        noSetting: false,
        project_target: 0,
        project_rate: 0,
      };

      setOpenLoading(true);
      const { web3Connector } = web3storage;
      const { contract, currentUser } = wallet;
      const filename = userId + "_" + Date.now();
      const cid = await web3Connector.setData(currentUser.accountId, filename, data);      
      await contract
        ?.create_project?.(
          {
            metadata: cid,
          },
          50000000000000
        )
        .then((res: any) => {
          if (res.id) {
            router.push("/sandbox/project/" + res.id);
          } else {
            onShowResult({
              type: "error",
              msg: "Create form failure",
            });
          }
        })
        .catch((error: any) => {
          updateProject(userId, cid);
          return;
        });
    },
    [name, descriptions, type, fee, repository]
  );

  const updateProject = useCallback(async (user_id: any, cid: any) => {
    const { contract } = wallet;
    const project = await contract
      ?.get_user_projects_created(
        {
          id: user_id,
        },
        50000000000000
      )
      .catch((error: any) => {
        onShowResult({
          type: "error",
          msg: String(error),
        });
      });

    await contract
      ?.update_project(
        {
          id: project.id,
          metadata: cid,
        },
        50000000000000
      )
      .then((res: any) => {
        onShowResult({
          type: "success",
          msg: String("Suscess"),
        });
        router.push("/sandbox/project/" + project.id);
      })
      .catch((error: any) => {
        onShowResult({
          type: "error",
          msg: String(error),
        });
      });
  }, []);

  return (
    <>
      <Notify
        openLoading={openLoading}
        openSnack={openSnack}
        alertType={alertType}
        snackMsg={snackMsg}
        onClose={onCloseSnack}
      />
      <div className="pt-52 py-8 flex lg:px-16 flex-wrap md:flex-row flex-col md:w-full md:px-12 px-8">
        <div className="mb-8 md:mx-4 w-full">
          <div className="pb-4 text-center">
            <label className="text-4xl text-primary font-extrabold">
              Create new Project
            </label>
          </div>
        </div>
        {/* <hr className="w-full md:mx-4  md:max-w-[40%] border-slate-400 mb-8" /> */}
        <div className="w-full lg:px-48 md:px-32 sm:px-16">
          <form className="mx-2" onSubmit={handleCreateProject} method="post">
            <InputForm
              label="Name"
              onchange={(value: any) => {
                setName(value);
              }}
              required
            />
            <TextAreaForm
              label="Descriptions"
              onchange={(value: any) => {
                setDescriptions(value);
              }}
              required
            />
            {/* <SelectForm
              label="Type"
              options={options}
              required
              onchange={(value: any) => {
                setType(value);
              }}
            /> */}
            <InputForm
              label="Repository"
              onchange={(value: any) => {
                setRepository(value);
              }}
            />
            <InputForm
              label="Target Fee"
              onchange={(value: any) => {
                setFee(value);
              }}
            />
            <div className="flex flex-nowrap flex-row mb-2 text-primary font-semibold">
              {/* <div className="lg:w-2/12 ml-auto lg:mr-2 md:w-4/12 h-4 md:mx-2 my-auto "></div> */}
              <div className="overflow-x-auto w-full flex">
                <input
                  required
                  type="checkbox"
                  className=" align-middle my-auto lg:w-4 md:w-8 mr-4 "
                  id="check1"
                  onInvalid={(e) =>
                    (e.target as HTMLInputElement).setCustomValidity(
                      "Please check this box to continue"
                    )
                  }
                  onInput={(e) =>
                    (e.target as HTMLInputElement).setCustomValidity("")
                  }
                />
                <label className="" htmlFor="check1">
                  {`By clicking the submit button below, I hereby agree to and accept the following terms and conditions`}
                </label>
              </div>
            </div>
            <div className="flex flex-nowrap flex-row mb-2 text-primary font-semibold">
              {/* <div className="lg:w-2/12 ml-auto lg:mr-2 md:w-4/12 h-4 md:mx-2 my-auto "></div> */}
              <div className="overflow-x-auto w-full flex">
                <input
                  required
                  type="checkbox"
                  className=" align-middle my-auto lg:w-4 md:w-8 mr-4 "
                  id="check2"
                  onInvalid={(e) =>
                    (e.target as HTMLInputElement).setCustomValidity(
                      "Please check this box to continue"
                    )
                  }
                  onInput={(e) =>
                    (e.target as HTMLInputElement).setCustomValidity("")
                  }
                />
                <label className="" htmlFor="check2">
                  {`By clicking the submit button below, you will spend 0.1 NEAR as a fee for this storage`}
                </label>
              </div>
            </div>
            <div className="flex flex-row mb-2">
              <CustomButton
                className_box="px-2 py-2 md:w-4/12 w-full mx-auto my-4"
                className_button="py-2"
                // onClickButton={handleCreateProject}
              />
            </div>
          </form>
        </div>
        {/* <Explore /> */}
      </div>
    </>
  );
});

CreateScreen.displayName = "create_screen";

export default CreateScreen;
