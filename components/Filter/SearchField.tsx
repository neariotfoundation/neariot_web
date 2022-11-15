import { memo } from "react";

const SearchField = memo(() => {
  return (
    <>
      <div className="w-full flex md:my-8 my-4 md:flex-row flex-col">
        <label className="text-2xl font-semibold text-primary md:w-1/2 w-full mb-2">
          Invest in startup projects
        </label>
        <div className="relative md:w-1/2 w-full mb-2 ">
          <input
            type="text"
            placeholder="Search"
            className="w-full border-purple border-2 rounded-xl px-2 py-1 overflow-x-hidden hover:border-purple-dark focus:ring-purple-dark  focus:outline-purple-dark"
          />
          <div className="absolute right-0 top-0 rounded-lg bg-purple items-center align-middle p-1">
            <img src="/search.png" className="object-fill w-8" />
          </div>
        </div>
      </div>
    </>
  );
});

SearchField.displayName = "SearchField";

export default SearchField;
