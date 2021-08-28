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
import { getAllUsers, getPlay, updatePlay } from "../redux/action";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import useSound from "use-sound";
import beep from "./../assets/short_notification.mp3";
import right from "./../assets/right.svg";
import wrong from "./../assets/wrong.svg";
import Header from "../components/header";

const GetUsers = (props) => {
  const [openModel, setCloseModel] = useState(false);
  const [openModelSetting, setCloseSettingModel] = useState(false);
  const [data, setData] = useState([]);
  const [play] = useSound(beep, { interrupt: true });

  async function deleteAllData() {
    closeModelSetting();
  }
  const closeModelSetting = () => {
    setCloseSettingModel(false);
  };
  async function apiCall() {
    await props.getAllUsers();
    await props.getPlay();
  }
  useEffect(() => {
    apiCall();
    setData(props.user.users);
  }, [props.user.users]);

  useEffect(() => {
    if (props.user?.play?.play == true) {
      play();
    }
    setTimeout(async () => {
      await props.updatePlay();
    }, 60000);
  }, [props.user]);

  const getTable = () => {
    // let s_number = 1;
    if (!data || data == undefined) {
      return (
        <Tr style={{ textAlign: "center", width: 100 }}>
          <Td colspan="10">No data found</Td>
        </Tr>
      );
    }
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
          <ModalCloseButton onClick={() => closeModelSetting()} />
          <ModalBody>
            <form>
              <Box textAlign="center">
                <Button
                  bg="red.500"
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

GetUsers.propTypes = {
  getAllUsers: PropTypes.func.isRequired,
  getPlay: PropTypes.func.isRequired,
  updatePlay: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state,
  };
};
export default connect(mapStateToProps, {
  getAllUsers,
  getPlay,
  updatePlay
})(GetUsers);
