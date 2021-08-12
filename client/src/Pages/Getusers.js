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
import right from "./../assets/right.svg";
import wrong from "./../assets/wrong.svg";
import {
  AiFillStepForward,
  AiFillStepBackward,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { BiBarcodeReader } from "react-icons/bi";
import { useHistory } from "react-router-dom";
import firebase from "../utill/firebase";

const GetAllUsers = () => {
  const [openModel, setCloseModel] = useState(false);
  const [openModelSetting, setCloseSettingModel] = useState(false);
  const [username, setUsername] = useState("");
  const [fiscale, setFiscale] = useState("");
  const [type, setType] = useState("Greenpass");
  const [datefrom, setDatefrom] = useState();
  const [dateto, setDateto] = useState();
  const [userSaved, isUserSaved] = useState(false);
  const [isValid, setisValid] = useState(false);
  const [isNewNotification, setisNewNotification] = useState(false);
  const [hourSort, setHourSort] = useState(-1);
  const hour = moment().format("hh:mm:ss A");
  const date = moment().format("dddd, Do MMMM YYYY");
  const [data, setData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [play] = useSound(beep, { interrupt: true });
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [firsttime, setfirsttime] = useState(true);
  let history = useHistory();

  const closeModel = () => {
    setCloseModel(false);
  };
  const closeModelSetting = () => {
    setCloseSettingModel(false);
  };
  const nextPage = () => {
    setPage(page + 1);
  };
  const hourSortFunction = () => {
    if (hourSort == 1) {
      setHourSort(-1);
    }
    if (hourSort == -1) {
      setHourSort(1);
    }
  };

  const previousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  async function deleteData() {
    const deleteData = {
      datefrom: datefrom,
      dateto: dateto,
    };
    await axios({
      method: "delete",
      url: `/api/users/deletedata`,
      data: deleteData,
    });
  }

  async function deleteAllData() {
    await axios({
      method: "delete",
      url: `/api/users/deletedata/all`,
    });
  }
  async function saveUser() {
    const user = firebase.database().ref("Users");

    try {
      const data = {
        username: username,
        codice_fiscale: fiscale,
        user_type: type,
        isValid: isValid,
        hour: hour,
        date: date,
      };
      user.push(data);
      const ref = firebase
        .database()
        .ref("pushnotificaion")
        .child("-MgqgiJGrRkJNgvviupP");
      ref.update({
        play: true,
      });

      //   await axios({
      //     method: "post",
      //     url: "/api/users/add",
      //     data: data,
      //   });
      setCloseModel(false);
      setisNewNotification(true);
      isUserSaved(true);
      setUsername("");
      setFiscale("");
      //   play();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const user = firebase.database().ref("Users");
    user.on("value", (snapshot) => {
      console.log("here::");
      const users = snapshot.val();
      const userList = [];
      for (let id in users) {
        userList.push({ id, ...users[id] });
      }
      setData(userList);
      console.log(firsttime)
      if (firsttime) {
        setfirsttime(false);
      } else {
        play();
      }
      // setTimeout(() => {
      //   localStorage.setItem("length", userList.length);
      // }, 100);
    });
  }, []);

  useEffect(() => {
    // setTimeout(() => {
    //   const _itm = localStorage.getItem("length");
    //   console.log(_itm);
    // }, 120);

    // console.log(data.length);

    // setTimeout(() => {
    var _ref = firebase
      .database()
      .ref("pushnotificaion/" + "-MgqgiJGrRkJNgvviupP")
      .child("play");
    _ref.once("value").then(function (snapshot) {
      if (snapshot.val() == true) {
        console.log(data.length);
        // if (data.length == 0) {
        //   return false;
        // }
        // if (userSaved) console.log("triggered");
        play();
        const ref = firebase
          .database()
          .ref("pushnotificaion")
          .child("-MgqgiJGrRkJNgvviupP");
        ref.update({
          play: false,
        });
      }
    });
    // },1000);
  }, [data.length]);

  const getTable = () => {
    // let s_number = 1;
    if (data.length > 0) {
      return data.map((item, key) => {
        return (
          <Tr key={key}>
            {/* <Td>{s_number++}</Td> */}
            <Td>{item.username}</Td>
            <Td>{item.codice_fiscale}</Td>
            <Td>{item.user_type}</Td>
            <Td>
              {item.isValid ? (
                <span>
                  <img
                    src={right}
                    width="20px"
                    height="20px"
                    style={{ margin: "auto" }}
                  />
                </span>
              ) : (
                <span>
                  <img
                    src={wrong}
                    width="20px"
                    height="20px"
                    style={{ margin: "auto" }}
                  />
                </span>
              )}
            </Td>
            <Td>
              {item.isValid ? (
                <span>
                  <img
                    src={right}
                    width="20px"
                    height="20px"
                    style={{ margin: "auto" }}
                  />
                </span>
              ) : (
                <span>
                  <img
                    src={wrong}
                    width="20px"
                    height="20px"
                    style={{ margin: "auto" }}
                  />
                </span>
              )}
            </Td>
            <Td>
              {item.isValid ? (
                <span>
                  <img
                    src={right}
                    width="20px"
                    height="20px"
                    style={{ margin: "auto" }}
                  />
                </span>
              ) : (
                <span>
                  <img
                    src={wrong}
                    width="20px"
                    height="20px"
                    style={{ margin: "auto" }}
                  />
                </span>
              )}
            </Td>
            <Td>{item.hour}</Td>
            <Td>{item.date}</Td>
          </Tr>
        );
      });
    } else {
      return <Tr style={{ textAlign: "center" }}>No data found</Tr>;
    }
  };
  const getNotifications = () => {
    if (notifications.length > 0) {
      return notifications.map((item, key) => {
        return (
          <>
            <Box py={"2"} px={"1"}>
              <Text style={{ fontSize: "13px" }}>{item.message}</Text>
              <Flex>
                <Box style={{ fontSize: "10px" }}>{item.hour}</Box>
                <Spacer />
                <Box style={{ fontSize: "10px" }}>{item.date}</Box>
              </Flex>
            </Box>
            <Divider />
          </>
        );
      });
    } else {
      return <h1>No notifications found</h1>;
    }
  };
  return (
    <React.Fragment>
      <Flex p="5">
        <Box p="2">
          <Heading size="md">LOGO</Heading>
        </Box>
        <Spacer />
        <Box>
          <HStack>
            <Popover className="popover__">
              <PopoverTrigger>
                <Circle
                  size="40px"
                  color="white"
                  onClick={() => console.log("workign")}
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
      <Box className="boxTable">
        <Table
          variant="striped"
          colorScheme="teal"
          style={{ textAlign: "center" }}
        >
          <TableCaption>Page {page + 1}</TableCaption>
          <Thead>
            <Tr style={{ textAlign: "center" }}>
              {/* <Th>S#</Th> */}
              <Th>Username</Th>
              <Th>Codice Fiscale</Th>
              <Th>Type</Th>
              <Th>Validity</Th>
              <Th>Validity</Th>
              <Th>Validity</Th>
              <Th
              // style={{ cursor: "pointer" }}
              // onClick={() => hourSortFunction()}
              >
                Hour
              </Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody style={{ textAlign: "center", fontSize: "14px" }}>
            {getTable()}
          </Tbody>
        </Table>
        <Box>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div onClick={previousPage} style={{ cursor: "pointer" }}>
              {" "}
              <AiFillStepBackward fontSize="20px" />{" "}
            </div>
            <div onClick={nextPage} style={{ cursor: "pointer" }}>
              {" "}
              <AiFillStepForward fontSize="20px" />
            </div>
          </div>
        </Box>
      </Box>
      <Modal isOpen={openModel} onClose={closeModel} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <AiOutlineUserAdd />
              <Text>Add User</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton
            onClick={() => closeModel()}
            // _focus={{ boxShadow: "none" }}
          />
          <ModalBody>
            <form>
              <SimpleGrid columns={1} spacing={10}>
                <FormControl id="username">
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormControl>
                <FormControl id="fiscale">
                  <FormLabel>Codice Fiscale</FormLabel>
                  <Input
                    type="text"
                    value={fiscale}
                    onChange={(e) => setFiscale(e.target.value)}
                  />
                </FormControl>
                <FormControl id="type">
                  <FormLabel>Select type</FormLabel>
                  <Select
                    placeholder="Select type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="Greenpass">Greenpass</option>
                    <option value="Tampone">Tampone</option>
                  </Select>
                </FormControl>
                <Button
                  bg="green.500"
                  _focus={{ backgroundColor: "green.500" }}
                  _hover={{ backgroundColor: "green.500" }}
                  onClick={() => saveUser()}
                >
                  Save
                </Button>
              </SimpleGrid>
            </form>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={openModelSetting} onClose={closeModelSetting} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <MdSettings />
              <Text>Settings</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton
            onClick={() => closeModelSetting()}
            _focus={{ boxShadow: "none" }}
          />
          <ModalBody>
            <form>
              <SimpleGrid columns={2} spacing={10}>
                <FormControl id="">
                  <FormLabel>Enter Date From</FormLabel>
                  <Input
                    type="date"
                    value={datefrom}
                    onChange={(e) => setDatefrom(e.target.value)}
                  />
                </FormControl>
                <FormControl id="">
                  <FormLabel>Enter Date To</FormLabel>
                  <Input
                    type="date"
                    value={dateto}
                    onChange={(e) => setDateto(e.target.value)}
                  />
                </FormControl>
              </SimpleGrid>
              <Box textAlign="center">
                <Button
                  bg="red.500"
                  _focus={{ backgroundColor: "red.500" }}
                  _hover={{ backgroundColor: "red.500" }}
                  onClick={() => deleteData()}
                  mt={5}
                  mr={2}
                  width="135px"
                >
                  Delete data
                </Button>
                <Button
                  bg="red.500"
                  _focus={{ backgroundColor: "red.500" }}
                  _hover={{ backgroundColor: "red.500" }}
                  onClick={() => deleteAllData()}
                  mt={5}
                >
                  Delete all data
                </Button>
              </Box>
            </form>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};
export default GetAllUsers;
