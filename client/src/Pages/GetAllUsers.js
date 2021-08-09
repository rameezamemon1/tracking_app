import React, { useState, useEffect } from "react";
import {
  Flex,
  SimpleGrid,
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
} from "@chakra-ui/react";
import { MdNotificationsNone, MdSettings, MdAdd } from "react-icons/md";
import axios from "axios";
import moment from "moment";
import useSound from "use-sound";
import beep from "./../assets/short_notification.mp3";
import right from "./../assets/right.svg";
import wrong from "./../assets/wrong.svg";
import { AiFillStepForward, AiFillStepBackward } from "react-icons/ai";

const GetAllUsers = () => {
  const [openModel, setCloseModel] = useState(false);
  const [username, setUsername] = useState("");
  const [fiscale, setFiscale] = useState("");
  const [type, setType] = useState("Greenpass");
  const [isValid, setisValid] = useState(false);
  const [isNewNotification, setisNewNotification] = useState(false);
  const hour = moment().format("hh:mm:ss A");
  const date = moment().format("dddd, Do MMMM YYYY");
  const [data, setData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [play] = useSound(beep, { interrupt: true });
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const closeModel = () => {
    setCloseModel(false);
  };
  const nextPage = () => {
    setPage(page - 1);
  };

  const previousPage = () => {
    setPage(page + 1);
  };

  async function saveUser() {
    try {
      const data = {
        username: username,
        codice_fiscale: fiscale,
        user_type: type,
        isValid: isValid,
        hour: hour,
        date: date,
      };
      await axios({
        method: "post",
        url: "/api/users/add",
        data: data,
      });
      setCloseModel(false);
      setisNewNotification(true);
      play();
    } catch (error) {
      console.error(error);
    }
  }

  async function getUser() {
    await axios({
      method: "get",
      url: `/api/users?limit=${limit}&page=${page}`,
    }).then((res) => setData(res.data));
    await axios({
      method: "get",
      url: "/api/users/notification",
    }).then((res) => setNotifications(res.data));
  }
  useEffect(() => {
    getUser();
  }, [limit, page]);

  const getTable = () => {
    if (data.length > 0) {
      return data.map((item, key) => {
        return (
          <tr key={key}>
            <td>{item.username}</td>
            <td>{item.codice_fiscale}</td>
            <td>{item.user_type}</td>
            <td>
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
            </td>
            <td>
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
            </td>
            <td>
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
            </td>
            <td>{item.hour}</td>
            <td>{item.date}</td>
          </tr>
        );
      });
    } else {
      return <h1>No data found</h1>;
    }
  };
  const getNotifications = () => {
    if (notifications.length > 0) {
      return notifications.map((item, key) => {
        return (
          <>
            <Box py={"2"} px={"1"}>
              {item.message}
              <br />
              <Flex>
                <Box>{item.hour}</Box>
                <Spacer />
                <Box>{item.date}</Box>
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
          <Heading size="md">Chakra App</Heading>
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
                  style={{ backgroundColor: "#0000FF", cursor: "pointer" }}
                >
                  {isNewNotification ? (
                    <div class="icon">
                      <MdNotificationsNone
                        size="30px"
                        onClick={() => setisNewNotification(false)}
                      />
                      <div class="txt"></div>
                    </div>
                  ) : (
                    <MdNotificationsNone size="30px" />
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
              style={{ backgroundColor: "#0000FF", cursor: "pointer" }}
              onClick={() => setCloseModel(true)}
            >
              <MdAdd size="30px" />
            </Circle>
            <Circle
              size="40px"
              onClick={() => console.log("workign")}
              color="white"
              style={{ backgroundColor: "#0000FF", cursor: "pointer" }}
            >
              <MdSettings size="30px" />
            </Circle>
          </HStack>
        </Box>
      </Flex>
      <Box>
        <table style={{ textAlign: "center", border: "1px solid" }}>
          <thead>
            <td>Username</td>
            <td>Codice Fiscale</td>
            <td>Type</td>
            <td>Validity</td>
            <td>Validity</td>
            <td>Validity</td>
            <td>Hour</td>
            <td>Date</td>
          </thead>
          <tbody style={{ border: "1px solid" }}>{getTable()}</tbody>
        </table>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div onClick={previousPage} style={{ cursor: "pointer" }}>
            {" "}
            <AiFillStepBackward fontSize="20px"/>{" "}
          </div>
          <div onClick={nextPage} style={{ cursor: "pointer" }}>
            {" "}
            <AiFillStepForward fontSize="20px"/>
          </div>
        </div>
      </Box>
      <Modal isOpen={openModel} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add User</ModalHeader>
          <ModalCloseButton
            onClick={() => closeModel()}
            _focus={{ boxShadow: "none" }}
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
    </React.Fragment>
  );
};
export default GetAllUsers;
