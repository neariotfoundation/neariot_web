import { Fragment, memo } from "react";

const listField = [
  { label: "All", value: "all" },
  { label: "Art", value: "Art" },
  { label: "Art", value: "Art" },
  { label: "Game", value: "Game" },
  { label: "Fashion", value: "Fashion" },
  { label: "Music", value: "Music" },
];

const FilterItem = ({label, key}: any) => {
  return (
    <>
      <div className="bg-purple text-white text-center rounded-lg p-1">
        {label}
      </div>
    </>
  );
};

const Filter = memo(() => {
  return (
    <>
      <div className="grid grid-cols-12 gap-5">
        <div className="grid grid-cols-6 gap-6 col-span-11">
          <>
            {listField.map((item, index) => {
              return (
                <Fragment key={index}>
                  <FilterItem  label={item.label} />
                </Fragment>
              );
            })}
          </>
        </div>
        <button className="bg-purple text-white text-center rounded-lg p-1">
          <img src="/filter-icon.png" alt="" className="m-auto h-4" />
        </button>
      </div>
    </>
  );
});

Filter.displayName = "Filter";

export default Filter;
