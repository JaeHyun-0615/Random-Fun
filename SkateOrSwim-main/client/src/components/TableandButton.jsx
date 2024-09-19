import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';
import ServerApi from '../services/serverApi';
import AddMeasurementPopup from './popUpManual';

const DataTable = () => {
  const [entries, setEntries] = useState([]);
  const comingSoon = true; // TODO: CHANGE THIS TO ENABLE TABLE

  const overlayBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(0, 0, 0, 0.8)');
  const overlayColor = useColorModeValue('black', 'white');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ServerApi.getEntries();
        setEntries(response);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setEntries([]);
      }
    };

    fetchData();
  }, []);

  return (
    <VStack spacing={4} alignItems="center">
      <Box position="relative" width="100%" padding="10px" borderRadius="15px">
        {comingSoon && (
          <Box position="absolute" top="0" left="0" right="0" bottom="0" bg={overlayBg} display="flex" alignItems="center" justifyContent="center" borderRadius="15px">
            <Text fontSize="xl" color={overlayColor} fontWeight="bold">Coming Soon!</Text>
          </Box>
        )}
        <Box style={{ maxHeight: "200px", overflowY: "scroll", width: "100%" }}>
          {entries.length > 0 && (
            <TableContainer>
              <Table variant='simple'>
                <Thead>
                  <Tr>
                    <Th>Address</Th>
                    <Th isNumeric>Measurements (inch)</Th>
                    <Th>Notes</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {entries.map((entry, index) => (
                    <Tr key={index}>
                      <Td>{entry.address}</Td>
                      <Td isNumeric>{entry.measurements}</Td>
                      <Td>{entry.notes}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
          <AddMeasurementPopup disabled={comingSoon} />
        </Box>
        {entries.length === 0 && !comingSoon && <Text>No entries yet.</Text>}
      </Box>
    </VStack>
  );
};

export default DataTable;
