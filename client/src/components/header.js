import React from "react";
import { Flex, Spacer, Box, Circle, HStack } from "@chakra-ui/react";
import { MdSettings } from "react-icons/md";
import logo from "./../assets/logo.png";
import { BiBarcodeReader } from "react-icons/bi";
import { useHistory } from "react-router-dom";

const Header = ({ setCloseSettingModel }) => {
  let history = useHistory();
  return (
    <React.Fragment>
      <Flex p="5">
        <Box p="2">
          <img
            onClick={() => history.push("/")}
            src={logo}
            alt="logo"
            width="150"
            height="150"
            style={{cursor:"pointer"}}
          />
        </Box>
        <Spacer />
        <Box>
          <HStack>
            <Circle
              size="40px"
              onClick={() => setCloseSettingModel(true)}
              color="white"
              style={{ backgroundColor: "#B2F5EA", cursor: "pointer" }}
            >
              <MdSettings size="30px" style={{ color: "black" }} />
            </Circle>
            <Circle
              size="40px"
              onClick={() => history.push("./QrCodeReader")}
              color="white"
              style={{ backgroundColor: "#B2F5EA", cursor: "pointer" }}
            >
              <BiBarcodeReader size="30px" style={{ color: "black" }} />
            </Circle>
          </HStack>
        </Box>
      </Flex>
    </React.Fragment>
  );
};

export default Header;
