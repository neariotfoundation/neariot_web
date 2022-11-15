import { useRouter } from "next/router";
import StorageIcon from "@mui/icons-material/Storage";
import { DeveloperBoard } from "@mui/icons-material";
import CustomButton from "../../components/CustomButton";
import Carousel from "../../components/Carousel";
import SearchField from "../../components/Filter/SearchField";
import Filter from "../../components/Filter";
import ProjectContainer from "../../components/Container/ProjectContainer";
import RecomendContainer from "../../components/Container/RecomendContainer";
import NewsContainer from "../../components/Container/NewsContainer";
import { useCallback, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Notify from "../../components/Notify";

const DEFAULT_IMAGE =
  "https://img.freepik.com/premium-photo/astronaut-outer-open-space-planet-earth-stars-provide-background-erforming-space-planet-earth-sunrise-sunset-our-home-iss-elements-this-image-furnished-by-nasa_150455-16829.jpg?w=1380";

const Home = () => {
  const router = useRouter();
  const wallet = useSelector((state: any) => state.wallet);
  const web3storage = useSelector((statex: any) => statex.w3storage);
  const [openLoading, setOpenLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [snackMsg, setSnackMsg] = useState("");
  const [listRecommend, setListRecommend] = useState<any[]>([]);
  const [listNews, setListNews] = useState<any[]>([]);
  const [listProjects, setListProject] = useState<any[]>([]);
  const [listRecommendBox, setListRecommendBox] = useState<any[]>([]);

  const onRequestConnectWallet = () => {
    const { nearConfig, walletConnection } = wallet;
    walletConnection?.requestSignIn?.(nearConfig?.contractName);
  };

  const onCloseSnack = () => {
    setOpenSnack(false);
  };

  useEffect(() => {
    let tmpList = listProjects;
    tmpList.forEach((element: any) => {
      console.log(element.id);
      if (tmpList.filter((x) => x.id === element.id).length > 1) {
        tmpList.splice(tmpList.indexOf(element), 1);
      }
    });
    setListProject(tmpList);
  }, [listProjects]);

  const onShowResult = ({ type, msg }: any) => {
    setOpenSnack(true);
    setOpenLoading(false);
    setAlertType(type);
    setSnackMsg(msg);
  };

  useEffect(() => {
    const { walletConnection, contract } = wallet;
    const userId = walletConnection.getAccountId();
    if (userId === "") {
      onRequestConnectWallet();
      return;
    }
    setOpenLoading(true);
    onLoadRecommend();
  }, []);

  const onLoadRecommend = async () => {
    const { contract } = wallet;
    const { web3Connector } = web3storage;
    await contract
      ?.get_rcm_projects()
      .then(async (res: any[]) => {
        res.forEach(async (item: any) => {
          const cid = item.metadata;
          await web3Connector?.getData(cid).then((metadata: any) => {
            let descriptions = null;
            let name = null;
            let img = null;
            if (metadata) {
              descriptions = metadata.metadata.description;
              name = metadata.metadata.name;
              img = metadata.metadata.image;
            }
            const output = {
              id: item.id,
              owner: item.owner,
              name: name || "There is no name for this project",
              img: img || DEFAULT_IMAGE,
              type: "0",
              descriptions:
                descriptions || "There is no description for this project",
              pledgers: item.total_pledge,
              backers: item.pledgers.length,
              avg_rate: item.avg_rate,
            };
            if (!listRecommend.includes(output)) {
              setListRecommend((listRecommend) => [...listRecommend, output]);
            }
          });
        });
        setOpenLoading(false);
      })
      .catch((error: any) => {
        onShowResult({
          type: "error",
          msg: String(error),
        });
      });
  };

  useEffect(() => {
    let tmpNews: any[] = [];
    let tmpProject = listRecommend;
    let tmpRecommendBox: any[] = [];
    listRecommend.forEach((item) => {
      if (listRecommend.indexOf(item) < 4 && !tmpRecommendBox.includes(item)) {
        tmpRecommendBox.push(item);
      }
      if (listRecommend.indexOf(item) < 6 && !tmpNews.includes(item)) {
        tmpNews.push(item);
      }
    });
    setListProject(tmpProject);
    if (tmpNews.length > 0) {
      setListNews(tmpNews);
    }
    if (tmpRecommendBox.length > 0) {
      setListRecommendBox(tmpRecommendBox);
    }
  }, [listRecommend]);

  const handleCreateProject = useCallback(async (e: any) => {
    e.preventDefault();
    const { walletConnection, contract } = wallet;
    const userId = walletConnection.getAccountId();
    if (userId === "") {
      onRequestConnectWallet();
      return;
    }
    setOpenLoading(true);
    const project = await contract
      ?.get_user_projects_created(
        {
          id: userId,
        },
        50000000000000
      )
      .catch((error: any) => {
        onShowResult({
          type: "error",
          msg: String(error),
        });
      });

    if (project?.id) {
      router.push(`/sandbox/project/${project.id}`);
      return;
    }
    router.push("/sandbox/create");
  }, []);

  return (
    // <div className="lg:py-16 md:py-12 py-8 items-center flex flex-wrap md:flex-row flex-col h-full md:w-full mx-auto lg:px-16 md:px-12 px-8 ">
    <>
      <Notify
        openLoading={openLoading}
        openSnack={openSnack}
        alertType={alertType}
        snackMsg={snackMsg}
        onClose={onCloseSnack}
      />
      <div className="pt-52 py-8 flex lg:px-16 flex-nowrap md:flex-row flex-col md:w-full md:px-12 px-8">
        <div className="md:w-8/12 md:mx-4 w-full pb-4">
          <Carousel
            btnText="Start a Project"
            btnOnclick={handleCreateProject}
          />
          <SearchField />
          <Filter />
          <ProjectContainer listProjects={listProjects}/>
        </div>
        <div className="md:w-4/12 bg-lightpurple h-full md:mx-4 w-full items-center rounded pb-4 md:block hidden">
          <div className="bg-purple rounded items-center w-full text-center h-16 flex">
            <label className="text-white align-middle font-semibold items-center text-xl mx-auto">
              Recommend
            </label>
          </div>
          <RecomendContainer listRecommend={listRecommendBox} />
        </div>
      </div>
      <div className="w-full flex pb-20 lg:px-16 md:px-12 px-8">
        <div className="md:mx-4 w-full">
          <NewsContainer listProjects={listNews}/>
        </div>
      </div>
    </>
  );
};

export default Home;
