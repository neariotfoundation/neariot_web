import { memo } from "react";
import Card from "../Card";

const Explore = memo((props: any) => {
  const PublicSandBox = () => {
    const handleClickDetail = (id: any) => {};

    const sampleData = [
      {
        id: "project-1",
        name: "project-neariot-1",
        create_at: "2022",
        owner_id: "ciuz.testnet",
      },
      {
        id: "project-2",
        name: "project-neariot-2",
        create_at: "2022",
        owner_id: "ciuz.testnet",
      },
      {
        id: "project-3",
        name: "project-neariot-3",
        create_at: "2022",
        owner_id: "ciuz.testnet",
      },
    ];

    return (
      <>
        <div className="md:w-auto w-full grid md:grid-cols-3 sm:grid-cols-2 gap-8 grid-rows-1 mx-10 md:mx-auto">
          {sampleData?.map((item, index) => {
            return (
              <Card
                key={item.id}
                id={item.id}
                name={item.name}
                create_at={item.create_at}
                owner_id={item.owner_id}
                onClickCard={(id) => handleClickDetail(id)}
                _delete={false}
              />
            );
          })}
        </div>
      </>
    );
  };

  return (
    <>
      <hr className="w-full md:mx-4  md:max-w-[40%] border-slate-400 my-8" />
      <div className="mb-8 md:mx-4 w-full">
        <div className="pb-2 mb-4">
          <label className="text-lg text-slate-800 ">
            Explore projects on Sandbox{" "}
            <span className="font-thin text-inherit text-slate-500 text">
              (Public only)
            </span>
          </label>
        </div>
      </div>
      <div className="w-full flex items-center">{PublicSandBox()}</div>
    </>
  );
});

Explore.displayName = "explore"

export default Explore;
