import React from "react";
import { Box } from "@mui/system";
import {
  Button,
  Card,
  Grid,
  Typography,
  CardMedia,
  CardContent,
} from "@mui/material";

const style = {
  team: {
    avatarBox: "bg-[url('/landing/team-img-box.png')]",
    teamBox: "w-2/3",
    memberName: {
      color: "#1b1a2d",
      fontSize: "17.5px",
      fontFamily: "Arial",
      fontWeight: "bold",
    },
    memberPosition: {
      color: "#1b1a2d",
      fontSize: "12px",
      fontFamily: "RobotoSlab",
    },
  },
  title: {
    color: "#6e3cbc",
    fontSize: {
      xs: "1.5rem",
      sm: "3rem",
      md: "3.5rem",
      lg: "4rem",
      xl: "4.5rem",
    },
    fontFamily: "Arial",
    fontWeight: "bold",
    width: { xs: "17rem", md: "auto" },
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "normal",
    letterSpacing: "normal",
  },
  subtitle: {
    color: "#1b1a2d",
    fontSize: { xs: "1rem", md: "25.5px" },
    fontFamily: "RobotoSlab",
    fontWeight: "bold",
    width: { xs: "20rem", md: "45rem" },
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "normal",
    letterSpacing: "normal",
  },
};

interface MemberInfo {
  name: string;
  position: string;
  image: string;
}

const Team = () => {
  const generateMemberBox = (member: MemberInfo) => {
    return (
      <Grid
        item
        sx={{
          height: "auto",
          width: "auto",
        }}
      >
        <Card
          sx={{
            height: "auto",
            width: "auto",
            backgroundColor: "transparent",
            boxShadow: "none",
            borderRadius: "none",
            position: "absolute",
          }}
          className="object-fit: contain"
        >
          <CardMedia component="img" image="/landing/team-img-box.png" />
          <CardContent sx={{
            marginTop: "-5rem",
          }}>
            <Typography
              className="text-[#1b1a2d]"
              align="center"
              alignItems="center"
              sx={style.team.memberName}
            >
              {member.name}
            </Typography>
            <Typography
              className="text-[#1b1a2d]"
              align="center"
              alignItems="center"
              sx={style.team.memberPosition}
            >
              {member.position}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Box
      className={style.team.teamBox}
      sx={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid
        container
        direction={"column"}
        marginLeft={{
          xs: "4rem",
          md: "5rem",
        }}
        justifyContent="center"
        paddingTop={{ xs: 5, md: 10 }}
        spacing={{
          xs: 5,
          md: 12,
        }}
      >
        <Grid item>
          <Grid
            container
            spacing={{ xs: 38, md: 15 }}
            direction={{ xs: "column", md: "row" }}
            justifyContent={{ xs: "center", md: "space-between" }}
          >
            {memberList.map((member) => generateMemberBox(member))}
          </Grid>
        </Grid>
        <Grid item>
          <Grid
            container
            sx={{
              paddingTop: { xs: 45, md: 35 },
            }}
            alignItems="center"
            justifyContent="center"
            marginLeft={{ xs: "4rem", md: "10rem" }}
          >
            <Grid item>
              <Typography
                sx={style.title}
              >
                Team Work Company
              </Typography>
              <Typography
                align="center"
                sx={style.subtitle}
                marginTop={{
                  xs: 0,
                  md: 3,
                }}
              >
                Teamwork has the incredible power to increase productivity, job
                satisfaction, and even each person&#39;s individual performance.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

const memberList: MemberInfo[] = [
  {
    name: "Thuong Nguyen",
    position: "Chief Executive Officer",
    image: "/landing/team-img-box.png",
  },
  {
    name: "Hieu Pham",
    position: "Chief Technology Officer",
    image: "/landing/team-img-box.png",
  },
  {
    name: "Quan Le",
    position: "Full-stack Developer",
    image: "/landing/team-img-box.png",
  },
  {
    name: "Minh Hoang",
    position: "Designer",
    image: "/landing/team-img-box.png",
  },
  {
    name: "Lien Pham",
    position: "Product Marketing",
    image: "/landing/team-img-box.png",
  },
];

export default Team;
