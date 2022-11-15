import React from "react";
import { Box } from "@mui/system";
import { Button, Grid, Typography } from "@mui/material";
import Image from "next/image";

const style = {
  general: {
    gridContainer: "",
  },
  about: {
    aboutBox: "w-full",
    largeImage: "object-fill h-50 w-50",
    title: "text-[#6e3cbc] text-[74.5px] font-[Arial] font-black",
  },
  subtitle: {
    color: "#1b1a2d",
    fontSize: { xs: "1rem", md: "25.5px" },
    fontFamily: "RobotoSlab",
    width: { xs: "20rem", md: 3 / 4 },
    fontWeight: "normal",
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "normal",
    letterSpacing: "normal",
  },
};

const About = () => {
  return (
    <Box
      className={style.about.aboutBox}
      sx={{
        paddingBottom: { xs: 40 },
        marginTop: { xs: "3rem", md: "92px" },
      }}
    >
      <Grid
        container
        spacing={{ xs: 5, md: 12 }}
        className={style.general.gridContainer}
        sx={{
          width: { xs: "100%", md: "100%" },
          paddingLeft: {xs: 5, md: 22}
        }}
      >
        <Grid
          item
          xs={6}
          md={5}
        >
          <Image
            height={"550px"}
            width={"578px"}
            src="/landing/about-img.png"
          />
        </Grid>
        <Grid item xs={8} md={7}>
          <Typography
            // variant="h2"
            sx={{
              color: "#6e3cbc",
              fontSize: {
                xs: "2rem",
                sm: "3rem",
                md: "74.5px",
              },
              fontFamily: "Arial",
              fontWeight: "bold",
              fontStretch: "normal",
              fontStyle: "normal",
              lineHeight: "normal",
              letterSpacing: "normal",
              width: { xs: "20rem", md: "30rem" },
            }}
          >
            ABOUT WEB
          </Typography>
          <br />
          <Typography
            // variant="h6"
            sx={style.subtitle}
            // className={style.subtitle}
          >
            Neariot campaigns make ideas into reality. It&#39;s where creators
            share new visions for creative work with the communities that will
            come together to fund them.
          </Typography>
          <br />
          <Typography
            // variant="h6"
            sx={style.subtitle}
            // className={style.subtitle}
          >
            No matter what, creators always control how the work comes
            together—no 100-page grant applications, no donors demanding you
            modify your message, no last-minute edits from investors. When
            backers chip in funding and help spread the word, they too become
            part of these independent works
          </Typography>
          <br />
          <br />
        </Grid>
      </Grid>
    </Box>
  );
};

export default About;
