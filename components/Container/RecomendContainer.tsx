import ProjectCard from "../Card/ProjectCard";
import { memo } from "react";

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
    img: "https://img.freepik.com/premium-photo/astronaut-outer-open-space-planet-earth-stars-provide-background-erforming-space-planet-earth-sunrise-sunset-our-home-iss-elements-this-image-furnished-by-nasa_150455-16829.jpg?w=1380",
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
    img: "https://img.freepik.com/premium-photo/astronaut-outer-open-space-planet-earth-stars-provide-background-erforming-space-planet-earth-sunrise-sunset-our-home-iss-elements-this-image-furnished-by-nasa_150455-16829.jpg?w=1380",
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
    img: "https://img.freepik.com/premium-photo/astronaut-outer-open-space-planet-earth-stars-provide-background-erforming-space-planet-earth-sunrise-sunset-our-home-iss-elements-this-image-furnished-by-nasa_150455-16829.jpg?w=1380",
    type: "0",
    descriptions: "billingual-english-vietnamese-picture-book-thet-retells-the",
    pledgers: 2903,
    backers: 2,
    avg_rate: 3,
  },
];

interface Props {
  listRecommend: any[];
}

const RecomendContainer = memo((props: Props) => {
  const { listRecommend } = props;
  return (
    <>
      <div className="container lg:my-11 my-9  bg-transparent px-12">
        <div className="grid gap-10 grid-rows-4">
          {/* {listProject.map((item,index)=>{ */}
          {listRecommend.map((item, index) => {
            return <ProjectCard key={index} {...item} />;
          })}
        </div>
      </div>
    </>
  );
});

RecomendContainer.displayName = "RecomendContainer";

export default RecomendContainer;
