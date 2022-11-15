import { memo } from "react";
import AddIcon from '@mui/icons-material/Add';

type Props = {
  label: string;
  welcome: string;
  _className?: string;
  onCreate: () => void;
};

const CreateCard = memo(({ label, _className, onCreate, welcome }: Props) => {
  return (
    <>
      <div className="mb-8 md:mx-4 w-full">
        <div className="pb-4">
          <label className="text-lg text-slate-800 ">
            Welcome to your {welcome}
          </label>
        </div>
        <div
          className="bg-white flex flex-wrap flex-col border shadow-indigo-500 shadow-lg rounded-xl mx-auto my-2 py-2 cursor-pointer lg:w-3/12 md:w-4/12 sm:w-6/12 items-center w-full"
          onClick={onCreate}
        >
          <AddIcon className="items-center mx-auto mt-4" fontSize="large" />
          <div className=" mx-auto items-center align-middle justify-center px-2 pb-4">
            <button className="mx-auto justify-center items-center">
              {label}
            </button>
          </div>
        </div>
      </div>
      <hr className="w-full md:mx-4  md:max-w-[40%] border-slate-400 mb-8" />
    </>
  );
});

CreateCard.displayName = "create_card"

export default CreateCard;
