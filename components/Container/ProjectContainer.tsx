import { Pagination, PaginationItem, Stack } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProjectCard from "../Card/ProjectCard";

interface Props {
  listProjects: any[];
}

const ProjectContainer = memo((props: Props) => {
  const { listProjects } = props;
  return (
    <>
      <div className="container my-6 md:mx-auto">
        <div className="grid gap-10 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
          {listProjects.map((item, index) => {
            return <ProjectCard key={index} {...item} />;
          })}
        </div>
        <div className="flex justify-end my-8">
          <Stack
            spacing={2}
          >
            <Pagination
              count={10}
              sx={{
                ".MuiPaginationItem-text": {
                  color: "#4f46e5",
                  ":hover": {
                    backgroundColor: "#703eb8",
                    color: "#fff",
                  },
                },
                ".Mui-selected": {
                  color: "#703eb8",
                  backgroundColor: "#c0acde",
                },
              }}
            />
          </Stack>
        </div>
      </div>
    </>
  );
});


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
  {
    id: "7",
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
    id: "8",
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
    id: "9",
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

ProjectContainer.displayName = "ProjectContainer";

export default ProjectContainer;
