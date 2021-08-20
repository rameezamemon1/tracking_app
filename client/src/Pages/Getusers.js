import React, { useState, useEffect } from "react";
import { Text, Box, HStack, Button } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { MdSettings } from "react-icons/md";
import useSound from "use-sound";
import beep from "./../assets/short_notification.mp3";
import right from "./../assets/right.svg";
import wrong from "./../assets/wrong.svg";
import firebase from "../utill/firebase";
import Header from "../components/header";

const GetAllUsers = () => {
  const [openModel, setCloseModel] = useState(false);
  const [openModelSetting, setCloseSettingModel] = useState(false);
  const [data, setData] = useState([]);
  const [play] = useSound(beep, { interrupt: true });

  async function deleteAllData() {
    var adaRef = firebase.database().ref("Users");
    adaRef.remove();
    closeModelSetting();
  }
  const closeModelSetting = () => {
    setCloseSettingModel(false);
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
    });
  }, []);

  useEffect(() => {
    const notify = firebase
      .database()
      .ref("notify")
      .child("-MhZ0r76qZn9Ty_Eg76F");
    notify.on("value", (snapshot) => {
      const notifys = snapshot.val();
      if (notifys.play == true) play();
      setTimeout(() => {
        notify.update({
          play: false,
        });
      }, 10000);
    });
  }, [data]);

  const getTable = () => {
    // let s_number = 1;
    if (data.length > 0) {
      return data.map((item, key) => {
        return (
          <Tr key={key}>
            <Td>{item.username}</Td>
            <Td>{item.user_type}</Td>
            <Td>
              {item.isValid ? (
                <span>
                  <img
                    src={right}
                    width="20px"
                    height="20px"
                    alt="right"
                    style={{ margin: "auto" }}
                  />
                </span>
              ) : (
                <span>
                  <img
                    src={wrong}
                    width="20px"
                    height="20px"
                    alt="wrong"

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
                    alt="right"
                    style={{ margin: "auto" }}
                  />
                </span>
              ) : (
                <span>
                  <img
                    src={wrong}
                    width="20px"
                    alt="wrong"

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
                    alt="right"

                    height="20px"
                    style={{ margin: "auto" }}
                  />
                </span>
              ) : (
                <span>
                  <img
                    src={wrong}
                    width="20px"
                    alt="wrong"

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
      return (
        <Tr style={{ textAlign: "center",width:100 }}>
          <Td colspan="10">No data found</Td>
        </Tr>
      );
    }
  };

  return (
    <React.Fragment>
      <Header
        setCloseModel={setCloseModel}
        setCloseSettingModel={setCloseSettingModel}
      />

      <Box className="boxTable">
        <Table
          variant="striped"
          colorScheme="teal"
          style={{ textAlign: "center" }}
        >
          <Thead>
            <Tr style={{ textAlign: "center" }}>
              {/* <Th>S#</Th> */}
              <Th>Username</Th>
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

      {/* SETTINGS MODEL */}
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
              <Box textAlign="center">
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
