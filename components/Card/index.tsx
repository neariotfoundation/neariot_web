import { memo, useCallback } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

type Props = {
  id: string;
  name: string;
  create_at: string;
  owner_id?: string;
  status?: string;
  _delete?: boolean;
  onClickCard?: (id: any) => void;
  onClickDelete?: (id: any) => void;
};

const Card = memo(
  ({
    id,
    name,
    create_at,
    owner_id,
    status,
    _delete = true,
    onClickCard,
    onClickDelete,
  }: Props) => {
    const onClickDeleteStorage = useCallback(() => {
      onClickDelete?.(id);
    }, [onClickDelete]);

    const onClickDetailStorage = useCallback(() => {
      onClickCard?.(id);
    }, [onClickCard]);

    return (
      <>
        <div className="w-full h-full border rounded-xl drop-shadow-lg shadow-md  shadow-indigo-500 bg-white">
          <div
            className="cursor-pointer"
            onClick={() => onClickDetailStorage()}
          >
            <div className="mt-2 mx-2 overflow-x-hidden ">
              <label className="text-slate-800 font-semibold ">ID: </label>
              <span className="text-lg ">{id}</span>
            </div>
            <hr className="my-2 md:min-w-fit mx-2 border-slate-400" />
            <div className="mx-2 ">
              <div className="mx-2 my-2 flex flex-nowrap flex-row ">
                <label className="text-lg font-semibold text-slate-700 mr-8 w-4/12 whitespace-nowrap">
                  Name:{" "}
                </label>
                <span className="text-lg my-auto items-stretch w-8/12 whitespace-nowrap overflow-hidden ">
                  {name}
                </span>
              </div>
              <div className="mx-2 my-2 flex flex-nowrap flex-row">
                <label className="text-lg font-semibold text-slate-700 mr-8 w-4/12 whitespace-nowrap">
                  Create At:{" "}
                </label>
                <span className="text-lg my-auto items-stretch w-8/12 whitespace-nowrap overflow-hidden">
                  {create_at}
                </span>
              </div>
              {status && (
                <div className="mx-2 my-2 flex flex-nowrap flex-row">
                  <label className="text-lg font-semibold text-slate-700 mr-8 w-4/12 whitespace-nowrap">
                    status:{" "}
                  </label>
                  <span className="text-lg my-auto items-stretch w-8/12 whitespace-nowrap overflow-hidden">
                    {status}
                  </span>
                </div>
              )}
              {owner_id && (
                <div className="mx-2 my-2 flex flex-nowrap flex-row">
                  <label className="text-lg font-semibold text-slate-700 mr-8 w-4/12 whitespace-nowrap">
                    Owner:{" "}
                  </label>
                  <span className="text-lg my-auto items-stretch w-8/12 whitespace-nowrap overflow-hidden">
                    {owner_id}
                  </span>
                </div>
              )}
            </div>
            <hr className="mt-2 mb-1 md:min-w-fit mx-2" />
          </div>
          {_delete && (
            <div className="flex flex-wrap w-full items-center mr-2  cursor-pointer">
              <div
                className="ml-auto mr-3 p-1 mb-1"
                onClick={() => onClickDeleteStorage()}
              >
                <DeleteOutlineIcon className="" fontSize="large" />
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
);

Card.displayName = "card";

export default Card;
