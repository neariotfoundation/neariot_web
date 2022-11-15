import { memo, useEffect, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useSelector } from "react-redux";

type Props = {
  id: string;
  title: string;
  description: string;
  type: string;
  image_base64: any;
  embedded_url?: string;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
};

const Section = memo(
  ({
    id,
    title,
    description,
    type,
    image_base64,
    embedded_url,
    onDelete,
    onEdit,
  }: Props) => {
    const web3storage = useSelector((statex: any) => statex.w3storage);
    const [image, setImage] = useState<any>("");

    const getImage = async (cid: any) => {
      if (cid) {
        const file = await web3storage.web3Connector.getImage(cid);
        return file;
      }
      return "https://img.freepik.com/premium-photo/astronaut-outer-open-space-planet-earth-stars-provide-background-erforming-space-planet-earth-sunrise-sunset-our-home-iss-elements-this-image-furnished-by-nasa_150455-16829.jpg?w=1380";
    };
    useEffect(() => {
      if (!image_base64) return;
      (async () => {
        if (image_base64) {
          const _image = await getImage(image_base64);
          setImage(_image);
        }
      })();
    });

    const renderMedia = () => {
      if (type === "image") {
        return (
          <img
            src={
              image ||
              "https://img.freepik.com/premium-photo/astronaut-outer-open-space-planet-earth-stars-provide-background-erforming-space-planet-earth-sunrise-sunset-our-home-iss-elements-this-image-furnished-by-nasa_150455-16829.jpg?w=1380"
            }
            className="w-full md:h-96 h-80 object-cover rounded-lg"
          />
        );
      } else if (type === "video") {
        return (
          <iframe
            width="640"
            height="360"
            src={embedded_url}
            allowFullScreen={true}
            className="object-cover rounded-lg"
          ></iframe>
        );
      }

      return (
        <>
          <div className="bg-white w-full h-48 md:h-64 rounded-lg">
            No Media
          </div>
        </>
      );
    };

    const handleEdit = (e: any) => {
      onEdit?.(id);
    };

    const handelDelete = (e: any) => {
      e.preventDefault();
      onDelete?.(id);
    };

    return (
      <>
        <div className="flex justify-between items-center pb-2">
          <div className="w-full items-center align-middle h-full text-lg text-slate-800">
            {title} (Custom Section)
          </div>
          <div className="flex flex-row">
            <div
              className="hover:cursor-pointer ml-2 hover:text-indigo-800"
              onClick={(e: any) => handleEdit(e)}
            >
              <EditOutlinedIcon className="" fontSize="large" />
            </div>
            <div
              className="hover:cursor-pointer ml-2 hover:text-indigo-800"
              onClick={(e: any) => handelDelete(e)}
            >
              <DeleteOutlineIcon className="" fontSize="large" />
            </div>
          </div>
        </div>
        <hr className="w-full md:mx-4 md:max-w-[40%] border-slate-400 mb-8" />
        <div className="flex justify-center pb-4">
          <div className="items-center">{renderMedia()}</div>
        </div>
        <div className="flex  bg-white m-2  shadow-indigo-600 shadow-sm rounded">
          <span className="w-full overflow-x-auto m-4">{description}</span>
        </div>
      </>
    );
  }
);

Section.displayName = "Section";

export default Section;
