import React, { useState } from 'react';
import { Button, Container, Flex, FormLabel, Heading, Input, Select } from '@chakra-ui/react'
import { startOfMonth, addDays, format, getMonth, addMonths } from 'date-fns';


function App() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dropdown1Value, setDropdown1Value] = useState('All');
  const [dropdown2Value, setDropdown2Value] = useState('Sunday');
  const [dropdown3Value, setDropdown3Value] = useState('Month');
  const [results, setResults] = useState([]);


  // handle start date change 
  const handleStartDateChange = (date) => {
    const nextYear = date.getFullYear() + 1;
    const nextYearDate = new Date(nextYear, date.getMonth(), date.getDate() + 1);
    setStartDate(date);
    setEndDate(nextYearDate);
  };

  // handle end date change
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  // handle occurance change
  const handleDropdown1Change = (event) => {
    setDropdown1Value(event.target.value);
  };

  // handle weekday change
  const handleDropdown2Change = (event) => {
    setDropdown2Value(event.target.value);
  };

  // handle specification change
  const handleDropdown3Change = (event) => {
    setDropdown3Value(event.target.value);
  };


  // return date of each month based on weekday and occurance provided
  function getSpecificDay(currentDate, weekday, occurrence) {

    console.log(occurrence, "occ");

    if (occurrence && occurrence < 1 || occurrence > 5) {
      throw new Error('Invalid occurrence. Please choose a value between 1 and 5.');
    }

    if (weekday < 0 || weekday > 6) {
      throw new Error('Invalid day of the week. Please choose a value between 0 (Sunday) and 6 (Saturday).');
    }

    if (currentDate.getDate() != 1) {
      currentDate.setDate(1)
    }

    if (occurrence == 'All') {
      const day = currentDate.toLocaleString('en-US', { weekday: 'long' });
      if (day === weekday) {
        console.log(day, "dateObjecr");
        return currentDate;
      }
    } else {
      // Initialize count to 0
      let count = 0;

      while (count < occurrence) {
        const day = currentDate.toLocaleString('en-US', { weekday: 'long' });
        if (day === weekday) {
          count++;
          if (count === occurrence) {
            return currentDate;
          }
        }

        // Move to the next day

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }


    return null;
  }


  function getAllMatchingDates(startDate, endDate, weekday) {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    if (!weekdays.includes(weekday)) {
      throw new Error('Invalid day of the week. Please provide a valid weekday string (e.g., "Sunday").');
    }

    const weekdayNumber = weekdays.indexOf(weekday); // Convert weekday string to number

    const matchingDates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const day = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)

      if (day === weekdayNumber) {
        matchingDates.push(new Date(currentDate).toDateString());
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return matchingDates;
  }



  // handle the submit click
  const handleSubmit = () => {

    let occurrence = dropdown1Value;
    let weekday = dropdown2Value;
    let specification = dropdown3Value;

    let results = [];

    // occurance needed only if specifcation is month
    if (specification == "Month") {

      fetchAllDaysOfUserSpecification(startDate, endDate, weekday, occurrence)
    } else {
      fetchAllDaysOfUserSpecification(startDate, endDate, weekday)
    }

  }

  // fetch all the dates within the rage provided by the user
  function fetchAllDaysOfUserSpecification(startDate, endDate, weekday, occurance = null) {

    let results = [];

    // weekday -- "string"
    // occurance -- number || All

    if (occurance !== 'All') {
      occurance = occurance && Number(occurance)
    }

    // if occurance then consider this as a month and get user specification days from every month 
    if (occurance) {

      if (occurance == 'All') {

        results = getAllMatchingDates(startDate, endDate, weekday)
      } else {
        while (startDate < endDate) {

          const specificDate = getSpecificDay(startDate, weekday, occurance);
          results.push(specificDate.toLocaleDateString());

          // Increase the month by 1 and reset the day to the 1st
          startDate = addMonths(startDate, 1);
          startDate.setDate(1);

        }
      }

    } else {
      // if specification is week 
      // fetch all the date that matches the day 
      results = getAllMatchingDates(startDate, endDate, weekday)

    }

    setResults(results)

  }

  return (
    <Flex justifyContent={"center"} flexDirection={"column"} alignItems={"center"}>
      <Container w={"60vw"}>
        <Heading border={"1px solid grey"} textAlign={"center"} fontSize={"2rem"}>Task Form</Heading>
        <Flex padding={"1rem"} border={"1px solid grey"} m={7} textAlign={"center"} justifyContent={"start"} alignItems={"center"}>
          <FormLabel fontSize={"1.5rem"} display={"inline-block"} mx={"1rem"} >Start Date :</FormLabel>
          <Input padding={"0.3rem"} value={startDate.toISOString().split('T')[0]} onBlur={(e) => e.preventDefault()} type="date" onChange={(e) => handleStartDateChange(new Date(e.target.value))} />
        </Flex>
        <Flex padding={"1rem"} border={"1px solid grey"} m={7} textAlign={"center"} justifyContent={"start"} alignItems={"center"}>
          <FormLabel fontSize={"1.5rem"} display={"inline-block"} mx={"1rem"} >End Date :</FormLabel>
          <Input padding={"0.3rem"} type="date" value={endDate.toISOString().split('T')[0]} onChange={(e) => handleEndDateChange(new Date(e.target.value))} />
        </Flex>

        {dropdown3Value == "Month" ? <Flex padding={"1rem"} border={"1px solid grey"} m={7} textAlign={"center"} justifyContent={"start"} alignItems={"center"}>
          <FormLabel fontSize={"1.5rem"} display={"inline-block"} mx={"1rem"}>Occurances :</FormLabel>
          <Select value={dropdown1Value} width={"0"} mt={"5px"} fontSize={"1rem"} onChange={handleDropdown1Change}>
            <option value="All">All</option>
            <option value={"1"}>1st</option>
            <option value={"2"}>2nd</option>
            <option value={"3"}>3rd</option>
            <option value={"4"}>4th</option>
            <option value={"5"}>5th</option>
          </Select>
        </Flex> : null}


        <Flex padding={"1rem"} border={"1px solid grey"} m={7} textAlign={"center"} justifyContent={"start"} alignItems={"center"}>
          <FormLabel fontSize={"1.5rem"} display={"inline-block"} mx={"1rem"}>Weekdays :</FormLabel>
          <Select value={dropdown2Value} width={"0"} mt={"5px"} fontSize={"1rem"} onChange={handleDropdown2Change}>
            <option value="Sunday">Sunday</option>
            <option value={"Monday"}>Monday</option>
            <option value={"Tuesday"}>Tuesday</option>
            <option value={"Wednesday"}>Wednesday</option>
            <option value={"Thursday"}>Thursday</option>
            <option value={"Friday"}>Friday</option>
            <option value={"Saturday"}>Saturday</option>
          </Select>
        </Flex>

        <Flex padding={"1rem"} border={"1px solid grey"} m={7} textAlign={"center"} justifyContent={"start"} alignItems={"center"}>
          <FormLabel fontSize={"1.5rem"} display={"inline-block"} mx={"1rem"}>Specification :</FormLabel>
          <Select value={dropdown3Value} width={"0"} mt={"5px"} fontSize={"1rem"} onChange={handleDropdown3Change}>
            <option value="Week">Week</option>
            <option value={"Month"}>Month</option>
          </Select>
        </Flex>

        <Button colorScheme='blue' margin={7} fontSize={"1rem"} width={"100%"} padding={"0.8rem"} bg={"teal"} color={"white"} fontWeight={"bold"} letterSpacing={"0.2rem"} cursor={"pointer"} onClick={handleSubmit}>Submit</Button>


        {/* Display results here */}
        <Container border={"1px solid grey"} h={"600px"} overflowY={"scroll"}>
          <Heading ml={"2rem"}>Results:</Heading>
          {results.map((item, index) => (
            <Container border={"1px solid grey"} borderLeft={"none"} p={"1.5rem"} key={index}>{item}</Container>
          ))}
        </Container>
      </Container>
    </Flex >
  );
}

export default App;
