import { useRouter } from "next/router";
import { Fragment, memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import StorageIcon from "@mui/icons-material/Storage";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import CustomButton from "../CustomButton";

const Account = memo((props: any) => {
  const wallet = useSelector((statex: any) => statex.wallet);
  const router = useRouter();
  const wrapperRef = useRef(null);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [state, setState] = useState({
    anchorEl: null,
    popoverOpen: false,
    popoverId: undefined,
  });
  const aMenu = [
    {
      id: "profile",
      label: "Profile",
      icon: StorageIcon,
      router: "/user/profile",
    },
  ];

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const handleClick = (event: any) => {
    const { target } = event;
    //@ts-ignore
    if (wrapperRef.current && !wrapperRef.current.contains(target)) {
      setPopoverVisible(false);
    }
  };

  const onNavItemClick = (route: any) => {
    setPopoverVisible(false);
    router.push(route);
  };

  const onRequestSignOut = () => {
    const { walletConnection } = wallet;
    walletConnection.signOut();
    router.push("/");
  };

  const onOpenAccountPopover = (e: any) => {
    setPopoverVisible(false);
    setPopoverVisible(!popoverVisible);
  };

  const onCloseAccountPopover = () => {
    setState({
      anchorEl: null,
      popoverOpen: false,
      popoverId: undefined,
    });
  };

  const onRenderSignInButton = () => {
    return (
      // <div className="border-0 rounded-xl bg-indigo-600 text-white py-3 px-4" onClick={onRequestConnectWallet}>
      //   <button>Connect the wallet</button>
      // </div>
      <CustomButton
        label="Connect the wallet"
        className_box="border-0 rounded-full bg-darkpurple text-white py-2 px-4 w-[292px]"
        className_button="whitespace-nowrap font-normal"
        onClickButton={onRequestConnectWallet}
      />
    );
  };

  const onRequestConnectWallet = () => {
    const { nearConfig, walletConnection } = wallet;
    walletConnection?.requestSignIn?.(nearConfig?.contractName);
  };

  const onRenderAccountDetail = () => {
    const { walletConnection } = wallet;

    const accountId = walletConnection?.getAccountId?.();

    return (
      //   <div className="border-0 rounded-xl bg-gradient-to-r from-teal-300 to-cyan-600 text-white py-2 px-2">
      <div className=" border-0 rounded-full bg-darkpurple text-white py-2 md:px-2">
        <button
          onClick={onOpenAccountPopover}
          className="flex md:justify-between mx-2 md:text-2xl sm:text-sm whitespace-nowrap"
        >
          <AccountCircleIcon className="mx-1 my-auto" />
          <div className="mx-1 my-auto">{accountId}</div>
          <ArrowDropDownIcon className="my-auto" />
        </button>
        {popoverVisible && (
          <>
            <div
              className="md:min-w-[200px] absolute mx-4 z-30 "
              onMouseLeave={() => onCloseAccountPopover}
            >
              <div className="w-[20px] h-[20px] rotate-45 bg-white shadow-slate-300 shadow-inner  mt-3 p-3 ml-[65%]  " />
            </div>
            <div className="absolute md:min-w-[200px] px-4 py-5 mt-5 text-slate-800 bg-white rounded-xl z-40 drop-shadow-xl shadow-xl ">
              {aMenu.map((item, index) => {
                return (
                  <Fragment key={index}>
                    <div
                      className="font-semibold"
                      onClick={() => onNavItemClick(item.router)}
                    >
                      <item.icon className="mx-2" />
                      {item.label}
                    </div>
                    <hr className="my-4 md:min-w-full" />
                  </Fragment>
                );
              })}
              <div className="font-semibold mx-2" onClick={onRequestSignOut}>
                <LogoutSharpIcon className="mr-2" />
                Log out
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const onRenderScene = () => {
    const { walletConnection } = wallet;
    const isSigned = walletConnection?.isSignedIn?.();
    if (isSigned) {
      return onRenderAccountDetail();
    }
    return onRenderSignInButton();
  };

  return <>{onRenderScene()}</>;
});

Account.displayName = "account";

export default Account;
