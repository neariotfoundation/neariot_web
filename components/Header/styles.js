const styles = {
  nav: "top-0 z-20 bg-transparent w-full p-4 items-center flex md:flex-nowrap md:justify-start md:flex-row md:left-0 md:top-0 md:overflow-y-auto md:overflow-hidden ",
  content: {
    manual: {
      logoWrapper: "w-full mx-auto items-center flex md:flex-nowrap md:px-4 h-full",
      childStart:
        "flex justify-start md:w-auto md:h-14 items-center align-middle",
      childCenter: {
        wrapper: "flex justify-center md:w-auto md:flex-nowrap mr-[87px]",
        content:
          "md:flex justify-start md:w-auto items-center md:visible hidden",
        link: "px-4 py-auto text-lg whitespace-nowrap text-primary font-[400] text-[29.5px] mr-11 font-[Arial]",
      },
      img: "max-h-12 h-8 w-full visible object-fill my-auto",
      menuIcon: "flex md:hidden visible my-auto ml-2 cursor-pointer",
    },
    mobile: {
      wrapper:
        "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-50 bg-white px-2 overflow-y-auto overflow-x-auto h-auto items-center flex-1 rounded  ",
      link: "md:block text-left md:pb-2 mr-0 inline-block whitespace-nowrap p-4 px-0",
      img: "max-h-12 h-8 w-full visible object-fill my-auto",
    },
  },
};

export default styles;
