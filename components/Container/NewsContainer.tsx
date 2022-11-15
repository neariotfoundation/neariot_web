import { memo } from "react";
import NewProjectCard from "../Card/NewCard";
const listProject = [
  {
    id: "1",
    owner: "anhquan02",
    name: "Neariot",
    img: "https://img.freepik.com/premium-photo/astronaut-outer-open-space-planet-earth-stars-provide-background-erforming-space-planet-earth-sunrise-sunset-our-home-iss-elements-this-image-furnished-by-nasa_150455-16829.jpg?w=1380",
    type: "0",
    descriptions: "billingual-english-vietnamese-picture-book-thet-retells-the",
    pledgers: 2903,
    backers: 2,
    avg_rate: 3,
  },
  {
    id: "2",
    owner: "anhquan02",
    name: "Neariot",
    img: "https://www.w3schools.com/w3css/img_lights.jpg",
    type: "0",
    descriptions: "billingual-english-vietnamese-picture-book-thet-retells-the",
    pledgers: 2903,
    backers: 2,
    avg_rate: 3,
  },
  {
    id: "3",
    owner: "anhquan02",
    name: "Neariot",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG76vGDk6FRTub8opBWzNMLFYZmvMjwYoABFIvaHPqlVCrOtHiO3ol2VyDAUnweQY9WpI&usqp=CAU",
    type: "0",
    descriptions: "billingual-english-vietnamese-picture-book-thet-retells-the",
    pledgers: 2903,
    backers: 2,
    avg_rate: 3,
  },
  {
    id: "4",
    owner: "anhquan02",
    name: "Neariot",
    img: "https://www.w3schools.com/w3css/img_lights.jpg",
    type: "0",
    descriptions: "billingual-english-vietnamese-picture-book-thet-retells-the",
    pledgers: 2903,
    backers: 2,
    avg_rate: 3,
  },
  {
    id: "5",
    owner: "anhquan02",
    name: "Neariot",
    img: "https://img.freepik.com/premium-photo/astronaut-outer-open-space-planet-earth-stars-provide-background-erforming-space-planet-earth-sunrise-sunset-our-home-iss-elements-this-image-furnished-by-nasa_150455-16829.jpg?w=1380",
    type: "0",
    descriptions: "billingual-english-vietnamese-picture-book-thet-retells-the",
    pledgers: 2903,
    backers: 2,
    avg_rate: 3,
  },
  {
    id: "6",
    owner: "anhquan02",
    name: "Neariot",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG76vGDk6FRTub8opBWzNMLFYZmvMjwYoABFIvaHPqlVCrOtHiO3ol2VyDAUnweQY9WpI&usqp=CAU",
    type: "0",
    descriptions: "billingual-english-vietnamese-picture-book-thet-retells-the",
    pledgers: 2903,
    backers: 2,
    avg_rate: 3,
  },
];

interface Props {
  listProjects: any[];
}

const NewsContainer = memo((props: Props) => {
  const { listProjects } = props;
  return (
    <>
      <div className="mb-6 md:block hidden">
        <label className="text-2xl font-semibold text-primary md:w-1/2 w-full mb-6">
          News
        </label>
      </div>
      <div className="container w-full md:grid gap-12 lg:grid-cols-6 md:grid-cols-3 hidden ">
        {listProjects.map((item, index) => {
          return <NewProjectCard key={index} {...item} />;
        })}
      </div>
    </>
  );
});

NewsContainer.displayName = "NewsContainer";

export default NewsContainer;
