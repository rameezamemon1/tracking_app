import React, { useState, useEffect } from "react";
import {
  Flex,
  SimpleGrid,
  Text,
  Spacer,
  Box,
  Heading,
  Input,
  Circle,
  HStack,
  Button,
  Select,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  FormControl,
  FormLabel,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Divider,
} from "@chakra-ui/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import { MdNotificationsNone, MdSettings, MdAdd } from "react-icons/md";
import axios from "axios";
import moment from "moment";
import useSound from "use-sound";
import beep from "./../assets/short_notification.mp3";
import logo from "./../assets/logo.png";
import wrong from "./../assets/wrong.svg";
import {
  AiFillStepForward,
  AiFillStepBackward,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { BiBarcodeReader } from "react-icons/bi";
import { useHistory } from "react-router-dom";
import firebase from "../utill/firebase";

const Header = ({
  setisNewNotification,
  getNotifications,
  setCloseModel,
  setCloseSettingModel,
  isNewNotification,
}) => {
  let history = useHistory();

  return (
    <React.Fragment>
      <Flex p="5">
        <Box p="2">
          <img
            onClick={() => history.push("/")}
            src={logo}
            width="150"
            height="150"
          />
        </Box>
        <Spacer />
        <Box>
          <HStack>
            <Popover className="popover__">
              <PopoverTrigger>
                <Circle
                  size="40px"
                  color="white"
                  style={{ backgroundColor: "#B2F5EA", cursor: "pointer" }}
                >
                  {isNewNotification ? (
                    <div class="icon">
                      <MdNotificationsNone
                        size="30px"
                        onClick={() => setisNewNotification(false)}
                        style={{ color: "black" }}
                      />
                      <div class="txt"></div>
                    </div>
                  ) : (
                    <MdNotificationsNone
                      style={{ color: "black" }}
                      size="30px"
                    />
                  )}
                </Circle>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader fontWeight="semibold">
                  Notifications
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>{getNotifications()}</PopoverBody>
              </PopoverContent>
            </Popover>
            <Circle
              size="40px"
              color="white"
              style={{ backgroundColor: "#B2F5EA", cursor: "pointer" }}
              onClick={() => setCloseModel(true)}
            >
              <MdAdd size="30px" style={{ color: "black" }} />
            </Circle>
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
