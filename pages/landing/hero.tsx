import React from "react";
import { Box } from "@mui/system";
import { Button, Container, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";

const style = {
  hero: {
    heroBox: "w-full", // w-1/2 ml-auto mr-20
    title: "text-[#6e3cbc] text-[74.5px] font-[Arial]",
    buttonText: "text-[#e2daf2] text-[29.5px] font-[Arial]",
  },
  subtitle: {
    color: "#1b1a2d",
    fontSize: {xs: "1rem", md: "25.5px"},
    fontFamily: "RobotoSlab",
    width: {xs: "auto", md: "656px"},
    fontWeight: "normal",
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "normal",
    letterSpacing: "normal",
  },
  buttonText: {
  }
};

const Hero = () => {
  const router = useRouter();
  return (
    <Box
      className={style.hero.heroBox}
    >
      <Box className="w-1/2 ml-auto mr-20">
      <Container className="pt-40">
        <Typography
          sx={{
            color: "#6e3cbc",
            fontSize: {
              xs: "2rem",
              sm: "3rem",
              md: "74.5px",
            },
            fontFamily: "Arial",
            marginTop: {xs: "5rem", md: "8rem"},
            fontWeight: "normal",
            fontStretch: "normal",
            fontStyle: "normal",
            lineHeight: "normal",
            letterSpacing: "normal",
          }}
        >
          Ideas are easy
          <br />
          Implementation is hard
        </Typography>
        <Typography paddingTop={2} sx={style.subtitle}>
          Don&#39;t worry about failure you only have to be right one
        </Typography>
        <br />
        <br />
        <Button
          variant="contained"
          color="primary"
          sx={{
            textTransform: "none",
            backgroundColor: "#5825f4",
            borderRadius: "50px",
            borderColor: "transparent",
          }}
        >
          <Typography
            // variant="h6"
            sx={{
              color: "#e2daf2",
              fontSize: {md: "29.5px"},
              fontFamily: "Arial",
            }}
            onClick={() => {
              router.push("/home");
            }}
          >
            Explore Now
          </Typography>
        </Button>
      </Container>
      </Box>
    </Box>
  );
};

export default Hero;
