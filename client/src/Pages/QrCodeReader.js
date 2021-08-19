import React, { useState, useEffect } from "react";
import { MdSettings } from "react-icons/md";
import {
  Flex,
  Center,
  SimpleGrid,
  Text,
  Spacer,
  Box,
  HStack,
  Divider,
  Button,
} from "@chakra-ui/react";
import validator from "validator";
import moment from "moment";
import useSound from "use-sound";
import beep from "./../assets/short_notification.mp3";
import Header from "../components/header";
import firebase from "../utill/firebase";
import { AiOutlineUserAdd } from "react-icons/ai";
import axios from "axios";
import { createStandaloneToast } from "@chakra-ui/react";

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
import { getQr } from "./helper";
const QrCodeReader = () => {
  const [openModel, setCloseModel] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [email, setemail] = useState("");
  const [dob, setdob] = useState("");
  const [validFrom, setvalidFrom] = useState(""); //df
  const [validUntil, setvalidUntil] = useState(""); //dt
  const [vacinationDate, setvacinationDate] = useState("");
  const [firstvacinationDate, setfirstvacinationDate] = useState(""); //fr
  const [scannedData, setscannedData] = useState();
  const [accepted, setaccepted] = useState(false);
  const [rejected, setrejected] = useState(false);
  const [showSubmit, setshowSubmit] = useState(false);
  const hour = moment().format("hh:mm:ss A");
  const date = moment().format("dddd, Do MMMM YYYY");
  const [play] = useSound(beep, { interrupt: true });
  const [result, setResult] = useState();
  const toast = createStandaloneToast();

  const closeModel = () => {
    setCloseModel(false);
    setaccepted(false);
    setrejected(false);
    setshowSubmit(false);
  };
  async function saveUser() {
    if (!validator.isEmail(email) || email == "") {
      toast({
        title: "An error occurred.",
        description: "Invalid Email.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    if (!validator.isMobilePhone(phoneNumber) || phoneNumber == "") {
      toast({
        title: "An error occurred.",
        description: "Invalid Phone Number.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    const user = firebase.database().ref("Users");

    try {
      const data = {
        username: firstName + " " + lastName,
        user_type: "Green Pass",
        isValid: true,
        hour: hour,
        date: date,
        phone: phoneNumber,
        email: email,
        server_timestamp: {
          ".sv": "timestamp",
        },
      };
      user.push(data);
      setCloseModel(false);
      toast({
        title: "Success",
        description: "User registred.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }

  const handleScan = (_data) => {
    if (_data) {
      const _result = getQr(_data);
      const data = JSON.parse(_result);
      setTimeout(() => {
        setFirstName(data["nam"].fn);
        setLastName(data["nam"].gn);
        setdob(moment(data["dob"]).format("MMMM do, YYYY"));
        {
          data["r"] &&
            setvalidFrom(moment(data["r"][0].df).format("MMMM d, YYYY"));
        }
        {
          data["r"] &&
            setvalidUntil(moment(data["r"][0].du).format("MMMM do, YYYY"));
        }
        {
          data["v"] &&
            setvacinationDate(moment(data["v"][0].dt).format("MMMM do, YYYY"));
        }
        {
          data["r"] &&
            setfirstvacinationDate(
              moment(data["r"][0].fr).format("MMMM do, YYYY")
            );
        }
        setCloseModel(true);
      }, 2000);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };

  const buttonHandle = (value) => {
    if (value == "accepted") {
      setaccepted(true);
      setshowSubmit(true);
    }
    if (value == "rejected") {
      setrejected(true);
      setaccepted(false);
      setshowSubmit(true);
    }
  };

  return (
    <>
      <div>
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "100%" }}
        />
      </div>
      <Modal isOpen={openModel} onClose={closeModel} size="md">
        <ModalOverlay />
        <ModalContent
          border={"5px solid"}
          borderColor={accepted ? "green.500" : rejected ? "red.500" : "black"}
        >
          <ModalHeader>
            <Center mt={2}>User Information</Center>
          </ModalHeader>
          <ModalCloseButton onClick={() => closeModel()} />
          <ModalBody>
            <form>
              <SimpleGrid columns={1} spacing={10}>
                <table>
                  <tbody>
                    <tr>
                      <td>First Name</td>
                      <td>{firstName}</td>
                    </tr>
                    <tr>
                      <td>Last Name</td>
                      <td>{lastName}</td>
                    </tr>
                    <tr>
                      <td>Date of Birth</td>
                      <td>{dob}</td>
                    </tr>
                    {vacinationDate && (
                      <tr>
                        <td>Date of vacination</td>
                        <td>{vacinationDate}</td>
                      </tr>
                    )}
                    {firstvacinationDate && (
                      <tr>
                        <td>First Vacination Date</td>
                        <td>{firstvacinationDate}</td>
                      </tr>
                    )}

                    {validFrom && (
                      <tr>
                        <td>Valid from</td>
                        <td>{validFrom}</td>
                      </tr>
                    )}
                    {validUntil && (
                      <tr>
                        <td>Valid until</td>
                        <td>{validUntil}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {accepted && (
                  <>
                    <Center>
                      <Text color={"green.500"} fontWeight="bold" fontSize="lg">
                        Insert Contact Information
                      </Text>
                    </Center>
                    <Input
                      placeholder="Phone"
                      borderRadius="4rem"
                      onChange={(e) => setphoneNumber(e.target.value)}
                    />
                    <Input
                      borderRadius="4rem"
                      mt="-5"
                      placeholder="Email"
                      onChange={(e) => setemail(e.target.value)}
                    />
                  </>
                )}
                {!showSubmit && (
                  <>
                    <Center>
                      {" "}
                      <Button
                        bg="green.500"
                        width="100px"
                        _focus={{ backgroundColor: "green.500" }}
                        _hover={{ backgroundColor: "green.500" }}
                        onClick={() => buttonHandle("accepted")}
                        mx="2"
                      >
                        Accept
                      </Button>
                      <Button
                        width="100px"
                        bg="red.500"
                        _focus={{ backgroundColor: "red.500" }}
                        _hover={{ backgroundColor: "red.500" }}
                        mx="2"
                        onClick={() => buttonHandle("rejected")}
                      >
                        Reject
                      </Button>
                    </Center>{" "}
                  </>
                )}
                {showSubmit && (
                  <Center>
                    {" "}
                    {accepted && (
                      <Button
                        bg="green.500"
                        width="100px"
                        _focus={{ backgroundColor: "green.500" }}
                        _hover={{ backgroundColor: "green.500" }}
                        onClick={() => saveUser()}
                        mx="2"
                      >
                        Submit
                      </Button>
                    )}
                    {rejected && (
                      <Button
                        width="100px"
                        bg="red.500"
                        _focus={{ backgroundColor: "red.500" }}
                        _hover={{ backgroundColor: "red.500" }}
                        mx="2"
                        onClick={() => closeModel()}
                      >
                        Close
                      </Button>
                    )}
                  </Center>
                )}
              </SimpleGrid>
            </form>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default QrCodeReader;
