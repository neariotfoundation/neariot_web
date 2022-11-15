import { memo, useState } from "react";
import Account from "../Account";
import DehazeIcon from "@mui/icons-material/Dehaze";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import styles from "./styles";
import { Typography } from "@mui/material";

const Header = memo((props: any) => {
  const [collapseShow, setCollapeShow] = useState("hidden");

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.content.manual.logoWrapper}>
          <div className={styles.content.manual.childStart}>
            <Link href={"/"}>
              <a href="#">
                <span className="sr-only">Workflow</span>
                <img
                  className={styles.content.manual.img}
                  src="/logo.png"
                  // src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                  alt=""
                />
              </a>
            </Link>
            <div
              className={styles.content.manual.menuIcon}
              onClick={() => setCollapeShow("visible")}
            >
              <DehazeIcon className="" fontSize="large" />
            </div>
          </div>
        </div>
        <div className={styles.content.mobile.wrapper + collapseShow}>
          <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-slate-200">
            <div className="flex flex-wrap">
              <div className="w-6/12 px-4">
                <Link href={"/"}>
                  <a href="#" className={styles.content.mobile.link}>
                    <span className="sr-only">Workflow</span>
                    <img
                      className={styles.content.mobile.img}
                      src="/logo.png"
                      // src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                      alt=""
                    />
                  </a>
                </Link>
              </div>
              <div className="w-6/12 flex justify-end">
                <CloseIcon
                  fontSize="large"
                  className="cursor-pointer whitespace-nowrap m-4 mx-0"
                  onClick={() => setCollapeShow("hidden")}
                />
              </div>
            </div>
            <ul className="flex-col list-none">
              <li className="mt-2">
                <Link href={"/home"}>
                  <a
                    href="#"
                    className="px-4 py-auto text-xl text-primary items-center "
                  >
                    Home
                  </a>
                </Link>
              </li>
              <li className="mt-2">
                <Link href={"/"}>
                  <a
                    href="#"
                    className="px-4 py-auto text-xl text-primary items-center "
                  >
                    Discovery
                  </a>
                </Link>
              </li>
              <li className="mt-2">
                <Link href={"/"}>
                  <a
                    href="#"
                    className="px-4 py-auto text-xl text-primary items-center "
                  >
                    Start a Project
                  </a>
                </Link>
              </li>
              <li className="mt-2">
                <Link href={"/"}>
                  <a
                    href="#"
                    className="px-4 py-auto text-xl text-primary items-center "
                  >
                    About Us
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.content.manual.childCenter.wrapper}>
          <div className={styles.content.manual.childCenter.content}>
            <Link href={"/home"}>
              <a href="#" className={styles.content.manual.childCenter.link}>
                Home
              </a>
            </Link>
            <Link href={"/"}>
              <a href="#" className={styles.content.manual.childCenter.link}>
                Discovery
              </a>
            </Link>
            <Link href={"/"}>
              <a href="#" className={styles.content.manual.childCenter.link}>
                Start a project
              </a>
            </Link>
            <Link href={"/"}>
              <a href="#" className={styles.content.manual.childCenter.link}>
                About us
              </a>
            </Link>
          </div>
        </div>
        <div className="flex justify-end md:w-auto md:flex-nowrap items-center">
          <div className="md:mx-auto items-center">
            <Account />
          </div>
        </div>
      </nav>
    </>
  );
});

Header.displayName = "header";

export default Header;
