import React, { useState, useEffect } from "react";
import { MdSettings } from "react-icons/md";
import {
  Flex,
  SimpleGrid,
  Text,
  Spacer,
  Box,
  HStack,
  Divider,
  Button,
} from "@chakra-ui/react";
import moment from "moment";
import useSound from "use-sound";
import beep from "./../assets/short_notification.mp3";
import Header from "../components/header";
import firebase from "../utill/firebase";
import { AiOutlineUserAdd } from "react-icons/ai";
import axios from "axios";

import {
  Input,
  FormLabel,
  ModalFooter,
  FormControl,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalOverlay,
  ModalContent,
  Select,
  Modal,
} from "@chakra-ui/react";

import QrReader from "react-qr-reader";
import { greenpassDecode } from "./helper";
const QrCodeReader = () => {
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
  const hour = moment().format("hh:mm:ss A");
  const date = moment().format("dddd, Do MMMM YYYY");
  const [data, setData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [play] = useSound(beep, { interrupt: true });
  const [firsttime, setfirsttime] = useState(false);
  const [result, setResult] = useState(
    "HC1: 6BFOXM% TS3DHPVO13J /G-/2YKVA.R/K86PP2FC1J9M$DI9C3 [....] CS62GMVR + B1YM K5MJ1K: K: 2JZLT6KM + DTVKPDUG $ E7F06FA3O6I-VA126Y0"
  );
  const get = () => {
    console.log("asd");
    axios
      .post("http://localhost:6000/decode", {
        data: result,
        headers: {
          "Content-Type": "application/json; charset=UTF=8",
          'Accept-Encoding': 'zlib'
        },
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
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
    var adaRef = firebase.database().ref("Users");
    adaRef
      .remove()
      .then(function () {
        console.log("Remove succeeded.");
      })
      .catch(function (error) {
        console.log("Remove failed: " + error.message);
      });
  }
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
  const handleScan = (data) => {
    if (data) {
      setResult(data);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };
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

  return (
    <>
      <Header
        setisNewNotification={setisNewNotification}
        getNotifications={getNotifications}
        setCloseModel={setCloseModel}
        setCloseSettingModel={setCloseSettingModel}
        isNewNotification={isNewNotification}
      />

      <div>
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "100%" }}
        />
        <p>{result}</p>
      </div>
      <Button onClick={() => get()}>click</Button>
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
    </>
  );
};
export default QrCodeReader;
