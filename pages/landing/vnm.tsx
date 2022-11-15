import React from "react";
import { Box, Container } from "@mui/system";
import {
  Button,
  Card,
  CardMedia,
  Grid,
  Typography,
  CardContent,
} from "@mui/material";

const style = {
  general: {
    gridContainer: "",
  },
  vnm: {
    vnmBox: "mr-auto mb-20 w-full",
    textBox: "bg-[url('/landing/vm-img.png')]",
    customGrid:
      "w-1/2 justify-center display-grid grid-cols-2 grid-rows-2 gap-10",
    largeImage: "object-fill h-[534px] w-[534px]",
    title: {
      color: "#6e3cbc",
      fontSize: {
        xs: "2rem",
        sm: "3rem",
        md: "3.5rem",
        lg: "4rem",
        xl: "4.5rem",
      },
      fontFamily: "Arial",
      fontWeight: "bold",
    },
    subtitle: {
      color: "#372660",
      fontSize: { xs: "1rem", md: "25.5px" },
      fontFamily: "RobotoSlab",
      width: { xs: "20rem", md: "25rem" },
      paddingLeft: { xs: 1, md: 10 },
      paddingTop: { md: "100px" },
      fontWeight: "normal",
      fontStretch: "normal",
      fontStyle: "normal",
      lineHeight: "normal",
      letterSpacing: "normal",
    },
    imageText: {
      fontSize: { xs: "1rem", md: "29.5px" },
      fontFamily: "Roboto",
      fontWeight: "normal",
      fontStretch: "normal",
      fontStyle: "normal",
      lineHeight: "normal",
      letterSpacing: "normal",
    },
  },
};

const VisonAndMission = () => {
  return (
    <Box className={style.vnm.vnmBox}>
      <Grid
        container
        spacing={2}
        className={style.vnm.customGrid}
        sx={{
          paddingTop: { xs: 5, md: 20 },
          marginBottom: { xs: 0, md: 20 },
        }}
      >
        <Typography
          justifyContent="center"
          alignItems="center"
          sx={style.vnm.title}
        >
          VISION AND MISSION
        </Typography>
      </Grid>
      <Grid
        container
        spacing={2}
        direction={{ xs: "column", md: "row" }}
        sx={{
          paddingLeft: { xs: 3 },
        }}
      >
        <Grid item xs={6} md={4}>
          <Grid container direction={"column"} spacing={{ md: 8 }}>
            <Grid item>
              <Typography
                align="left"
                alignItems="center"
                sx={style.vnm.subtitle}
              >
                Starup can share infomation about their project to impress
                investors
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                align="left"
                alignItems="center"
                sx={style.vnm.subtitle}
              >
                Pledge to the project and get the benefit by buying an Offer
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} md={4}>
          <Card
            sx={{
              position: "absolute",
              backgroundColor: "transparent",
              boxShadow: "none",
              borderRadius: "none",
              width: { xs: "75%", md: "534px" },
              paddingLeft: { xs: 1, md: 0 },
            }}
            className="object-fit: contain"
          >
            <CardMedia component="img" image="/landing/vm-img.png" />
            <CardContent>
              <Grid
                container
                sx={{ marginTop: { xs: -31, md: -55 }, justifyItems: "center" }}
              >
                <Grid item xs={4}>
                  <Typography
                    // variant="h4"
                    className="text-[#e6e4ed]"
                    align="center"
                    alignItems="center"
                    sx={style.vnm.imageText}
                    marginLeft={{ xs: 2, md: 6 }}
                  >
                    Share the Idea
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    // variant="h4"
                    className="text-[#6e3cbc]"
                    align="center"
                    alignItems="center"
                    sx={style.vnm.imageText}
                    marginLeft={{ xs: 9, md: 19 }}
                    width={{ xs: "100%", md: "112px" }}
                  >
                    Easy to Analysis
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{ marginTop: { xs: 11, md: 21 }, justifyItems: "center" }}
              >
                <Grid item xs={4}>
                  <Typography
                    // variant="h4"
                    className="text-[#6e3cbc]"
                    align="center"
                    alignItems="center"
                    marginTop={{ xs: 3, md: 4 }}
                    sx={style.vnm.imageText}
                    marginLeft={{ xs: 1, md: 4 }}
                  >
                    Crownfunding
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    // variant="h4"
                    className="text-[#e6e4ed]"
                    align="center"
                    alignItems="center"
                    sx={style.vnm.imageText}
                    marginLeft={{ xs: 11, md: 21 }}
                  >
                    Build Measure Learn
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={4}>
          <Grid
            container
            direction={"column"}
            spacing={{ md: 8 }}
            paddingTop={{ xs: 37, md: 0 }}
          >
            <Grid item>
              <Typography
                align="left"
                alignItems="center"
                sx={style.vnm.subtitle}
              >
                Help investors easier to find the best fit project with
                transparent data
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                align="left"
                alignItems="center"
                sx={style.vnm.subtitle}
              >
                Approach with the lean startup methodology with Test and Voting
                features
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VisonAndMission;
