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
import { MdSettings } from "react-icons/md";
import axios from "axios";
import moment from "moment";
import useSound from "use-sound";
import beep from "./../assets/short_notification.mp3";
import right from "./../assets/right.svg";
import wrong from "./../assets/wrong.svg";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useHistory } from "react-router-dom";
import firebase from "../utill/firebase";
import Header from "../components/header";

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
  const [page, setPage] = useState(0);
  const [firsttime, setfirsttime] = useState(false);
  let history = useHistory();

  async function deleteData() {
    const deleteData = {
      datefrom: new Date(datefrom).getTime(),
      dateto: new Date(dateto).getTime(),
    };
    console.log(deleteData);
    var usersRef = firebase.database().ref("Users");
    usersRef.once("value").then(function (snapshot) {
      const users_ref = snapshot.val();
      for (var key in users_ref) {
        console.log(users_ref[key].server_timestamp);
        if (
          users_ref[key]["server_timestamp"] > deleteData.datefrom &&
          users_ref[key]["server_timestamp"] < deleteData.dateto
        ) {
          delete users_ref[key];
          console.log(users_ref);
        }
      }
    });
  }

  async function deleteAllData() {
    var adaRef = firebase.database().ref("Users");
    adaRef.remove();
  }
  const closeModel = () => {
    setCloseModel(false);
  };
  const closeModelSetting = () => {
    setCloseSettingModel(false);
  };
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
        server_timestamp: {
          ".sv": "timestamp",
        },
      };
      user.push(data);
      const ref = firebase
        .database()
        .ref("pushnotificaion")
        .child("-MgqgiJGrRkJNgvviupP");
      ref.update({
        play: true,
      });
      setCloseModel(false);
      setisNewNotification(true);
      console.log("firsttime in saveUser", firsttime);
      isUserSaved(true);
      setfirsttime(true);
      console.log("firsttime in saveUser", firsttime);
      setUsername("");

      setFiscale("");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const user = firebase.database().ref("Users");
    user.on("value", (snapshot) => {
      const users = snapshot.val();
      const userList = [];
      for (let id in users) {
        userList.push({ id, ...users[id] });
      }
      setData(userList);
      if (firsttime) {
        play();
        setisNewNotification(true);
      } else {
      }
    });
  }, [firsttime]);

  const getTable = () => {
    // let s_number = 1;
    if (data.length > 0) {
      return data.map((item, key) => {
        return (
          <Tr key={key}>
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
      <Header
        setisNewNotification={setisNewNotification}
        getNotifications={getNotifications}
        setCloseModel={setCloseModel}
        setCloseSettingModel={setCloseSettingModel}
        isNewNotification={isNewNotification}
      />

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
              <Th>Hour</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody style={{ textAlign: "center", fontSize: "14px" }}>
            {getTable()}
          </Tbody>
        </Table>
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
