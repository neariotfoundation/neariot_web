import { memo, useCallback, useEffect, useState } from "react";
import CustomButton from "../../../../components/CustomButton";

type Props = {
    id:string;
    data?:any;
}

const EditSection = memo(({id,data}:Props) => {
  const [title, setTitle] = useState<any>("abc");
  const [descriptions, setDescriptions] = useState<any>("abc");
  const [embeddedURL, setEmbeddedURL] = useState<any>("abc");
  const [imageState, setImageState] = useState<any>("abc");
  const [type, setType] = useState<any>();

  useEffect(() => {
    setType("image");
  }, []);

  useEffect(() => {
    console.log(type);
  }, [type]);

  const handleChangeFileValue = (e: any) => {
    const [file] = e.target.files;
    let reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: any) => {
      setImageState(e.target.result);
    };
    console.log(file);
  };

  const handelCreateNewSection = () => {};

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
                "placeholder-slate-400 text-slate-600 border-0 px-3 py-3 bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring w-full overflow-x-hidden shadow-indigo-500/80"
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
              "placeholder-slate-400 text-slate-600 border-0 px-3 py-3 bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring w-full overflow-x-hidden shadow-indigo-500/80"
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
                  value={title}
                  className={
                    "placeholder-slate-400 text-slate-600 border-0 px-3 py-3 bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring w-full overflow-x-hidden shadow-indigo-500/80"
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
                  value={descriptions}
                  className="border-0 px-3 py-3 placeholder-slate-400 text-slate-600 bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring w-full my-auto overflow-x-hidden shadow-indigo-500/80"
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

EditSection.displayName = "EditSection";

export default EditSection;
