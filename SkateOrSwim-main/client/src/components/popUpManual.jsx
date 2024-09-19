import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Box,
  Text,
  useToast
} from '@chakra-ui/react';
import ServerApi from '../services/serverApi';

export default function AddMeasurementPopup({ disabled }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [address, setAddress] = useState('');
  const [measurements, setMeasurements] = useState('');
  const [notes, setNotes] = useState('');
  const [measurementError, setMeasurementError] = useState('');

  const handleMeasurementsChange = (e) => {
    const value = e.target.value;
    // Allow numbers including decimals or an empty string to clear the field
    if (/^\d*\.?\d*$/.test(value)) {
      setMeasurements(value);
      setMeasurementError(''); // Clear error when input is valid
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Ensure measurements is a valid number and not just a decimal point
    if (measurements && Number(measurements) < 0) {
      setMeasurementError('Measurement cannot be negative');
      return;
    }
    try {
      await ServerApi.addEntry(address, measurements, notes);
      toast({
        title: "Report submitted",
        description: "Your ice thickness report has been successfully submitted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      setAddress('');
      setMeasurements('');
      setNotes('');
    } catch (error) {
      console.error('Error submitting the form', error);
      toast({
        title: "Error",
        description: "An error occurred while submitting your report.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  console.log(disabled);

  return (
    <>
      <Box display="flex" justifyContent="center" mt={4}>
        <Button onClick={!disabled ? onOpen : () => { }} >Add Manual Measurement</Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent width="100%">
          <ModalHeader>Add New Ice Thickness Measurement</ModalHeader>
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          <ModalBody pb={6} mx={"25px"}>
            <FormControl id="address" isRequired>
              <FormLabel>Address</FormLabel>
              <Input
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormControl>

            <FormControl id="measurements" mt={4} isRequired>
              <FormLabel>Measurements (inches)</FormLabel>
              <Input
                type="text"
                placeholder="Enter measurements (2.0, 5.5, etc.)"
                value={measurements}
                onChange={handleMeasurementsChange}
              />
              {measurementError && <Text color='red.500' mt={2}>{measurementError}</Text>}
            </FormControl>

            <FormControl id="notes" mt={4}>
              <FormLabel>Notes</FormLabel>
              <Input
                placeholder="Additional notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Submit
            </Button>
            <Button onClick={onClose} ml={3}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
