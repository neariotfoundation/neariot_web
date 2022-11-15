import { useCallback } from "react";
import { useState } from "react";

const listImage = [
  {
    id: 1,
    imgSrc:
      "https://img.freepik.com/premium-photo/astronaut-outer-open-space-planet-earth-stars-provide-background-erforming-space-planet-earth-sunrise-sunset-our-home-iss-elements-this-image-furnished-by-nasa_150455-16829.jpg?w=1380",
  },
  {
    id: 2,
    imgSrc: "https://www.w3schools.com/w3css/img_lights.jpg",
  },
  {
    id: 3,
    imgSrc:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG76vGDk6FRTub8opBWzNMLFYZmvMjwYoABFIvaHPqlVCrOtHiO3ol2VyDAUnweQY9WpI&usqp=CAU",
  },
];

const Carousel = ({ btnText, btnOnclick }: any) => {
  const [index, setIndex] = useState(0);

  const handleNext = useCallback(() => {
    if (index == listImage.length - 1) {
      setIndex(0);
      return;
    }
    setIndex(index + 1);
  }, [index]);

  const handlePrev = useCallback(() => {
    if (index == 0) {
      setIndex(listImage.length - 1);
      return;
    }
    setIndex(index - 1);
  }, [index]);

  const CarouselItem = useCallback(
    ({ display, imgSrc }: any) => {
      return (
        <>
          <div className="duration-700 ease-in-out ">
            <img
              className={
                "h-56 rounded-lg sm:h-[413px] w-full object-cover block " +
                (display ? "static" : "hidden")
              }
              src={imgSrc}
              alt=" ... "
            />
          </div>
        </>
      );
    },
    [index]
  );

  const renderCarouse = useCallback(() => {
    return listImage.map((item, idx) => {
      return (
        <CarouselItem
          key={item.id}
          display={index == idx}
          imgSrc={item.imgSrc}
        />
      );
    });
  }, [index]);

  return (
    <>
      <div className="relative w-full">
        <div className="overflow-hidden relative ">
          <div className="h-56 rounded-lg sm:h-[413px] w-full">
            <>{renderCarouse()}</>
          </div>
          <button
            type="button"
            className="flex absolute top-0 left-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none"
            onClick={handlePrev}
          >
            <span className="inline-flex justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg
                className="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              <span className="hidden">Previous</span>
            </span>
          </button>
          <button
            type="button"
            className="flex absolute top-0 right-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none"
            onClick={handleNext}
          >
            <span className="inline-flex justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg
                className="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
              <span className="hidden">Next</span>
            </span>
          </button>
          {btnText && (
            <button
              type="button"
              className="flex absolute bottom-16 left-20 z-30 justify-center items-center px-4 cursor-pointer group focus:outline-none bg-purple-lighter text-darkpurple rounded-2xl text-2xl font-bold w-[271px] p-2 shadow-inner"
              onClick={btnOnclick}
            >
              {btnText}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Carousel;
