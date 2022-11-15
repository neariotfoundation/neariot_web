import { Box, Container, Grid, Link, Typography } from "@mui/material";
import Image from "next/image";
import { memo } from "react";

interface TextContainer {
  title: string;
  image: string;
  url: string;
}

const Footer = memo((props: any) => {
  const generateContainer = (title: string, content: TextContainer[]) => {
    return (
      <div>
        <Typography
          variant="h6"
          className="text-[#6e3cbc]"
          sx={{ fontWeight: "700", fontSize: "1.2vw", fontFamily: "Arial" }}
          marginBottom={0}
        >
          {title}
        </Typography>
        {content.map((item, index) => {
          return (
            <div key={index}>
              <Grid container>
                {item.image !== "" && (
                  <Grid item xs={2} marginTop="10px">
                    <Image width={"24px"} height={"20px"} src={item.image} />
                  </Grid>
                )}
                <Grid item xs={9}>
                  <Typography
                    sx={{
                      fontSize: "1.2vw",
                      fontFamily: "RobotoSlab",
                      textDecoration: "none",
                      fontWeight: "500",
                    }}
                    component={"div"}
                  >
                    <Link href={item.url} underline="none" color="#1b1a2d">
                      {item.title}
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <footer
        className={"bg-purple-lighter w-full h-[406px] absolute bottom-0 mt-20"}
      >
        <Grid
          container
          spacing={1}
          direction={{ xs: "column", md: "row" }}
          sx={{
            marginBottom: 3,
            height: { xs: "auto", md: "100%" },
          }}
        >
          <Grid item xs marginTop={{ xs: 5, md: 15 }}>
            <Box
              sx={{
                marginLeft: { xs: 10, md: 15 },
              }}
            >
              {generateContainer("DEVPOST", devpostContainer)}
            </Box>
          </Grid>
          <Grid item xs marginTop={{ xs: 5, md: 15 }}>
            <Box
              sx={{
                marginLeft: { xs: 10, md: 5 },
              }}
            >
              {generateContainer("PORTFOLIO", portfolioContainer)}
            </Box>
          </Grid>
          <Grid item xs marginTop={{ xs: 0, md: 15 }}>
            <Box
              sx={{
                marginLeft: { xs: 10, md: 0 },
              }}
            >
              {generateContainer("HACKATHON", hackathonContainer)}
            </Box>
          </Grid>
          <Grid item xs={4} marginTop={{ xs: 0, md: 15 }}>
            <Box
              sx={{
                marginLeft: { xs: 10, md: 20 },
              }}
            >
              {generateContainer("CONNECT", connectContainer)}
            </Box>
          </Grid>
        </Grid>
        {/* <span className="text-xl text-gray-500 sm:text-center dark:text-gray-400 ml-20 pt-20">
          © 2022{" "}
          <a href="#" className="hover:underline">
            Neariot
          </a>
          . All Rights Reserved.
        </span> */}
      </footer>
    </>
  );
});

const devpostContainer: TextContainer[] = [
  {
    title: "About",
    image: "",
    url: "https://google.com",
  },
  {
    title: "Careers",
    image: "",
    url: "#",
  },
  {
    title: "Contact",
    image: "",
    url: "#",
  },
  {
    title: "Help",
    image: "",
    url: "#",
  },
];

const portfolioContainer: TextContainer[] = [
  {
    title: "Your projects",
    image: "",
    url: "#",
  },
  {
    title: "Your hackathons",
    image: "",
    url: "#",
  },
  {
    title: "Settings",
    image: "",
    url: "#",
  },
];

const hackathonContainer: TextContainer[] = [
  {
    title: "Browse hackathons",
    image: "",
    url: "#",
  },
  {
    title: "Explore projects",
    image: "",
    url: "#",
  },
  {
    title: "Host a hackathon",
    image: "",
    url: "#",
  },
  {
    title: "Hackathon guides",
    image: "",
    url: "#",
  },
];

const connectContainer: TextContainer[] = [
  {
    title: "Discord",
    image: "/landing/discord-logo.png",
    url: "#",
  },
  {
    title: "Youtube",
    image: "/landing/youtube-logo.png",
    url: "#",
  },
  {
    title: "Telegram",
    image: "/landing/telegram-logo.png",
    url: "#",
  },
  {
    title: "Twitter",
    image: "/landing/twitter-logo.png",
    url: "#",
  },
];

Footer.displayName = "footer";

export default Footer;
