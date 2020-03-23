import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
// action
import getReview from '../../state/actions/index';
import getCompanyReview from '../../state/actions/index';
// component
import NavBar from './NavBar';
import ReviewCard from './ReviewCard';
// styles
import {
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/core';
import CustomSpinner from '../CustomSpinner.js';

const DashboardHome = ({
  data,
  getReview,
  getCompanyReview,
  history,
  isLoading
}) => {
  // search state
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [trackFilters, setTrackFilters] = useState([]);
  const [typeFilters, setTypeFilters] = useState([]);

  // pull review data
  useEffect(() => {
    getReview();
  }, [getReview]);

  // filter searchbar by company name
  useEffect(() => {
    const results = data.filter(review =>
      review.company_name.toLowerCase().includes(searchResults)
    );
    // data = results;
    setFilteredReviews(results);
  }, [searchResults]);

  // filter by track and review type
  useEffect(() => {
    const filteredResults = data.filter(review =>
      trackFilters.length > 0 && typeFilters.length > 0
        ? trackFilters.includes(review.track_name) &&
          typeFilters.includes(review.review_type)
        : trackFilters.length > 0
        ? trackFilters.includes(review.track_name)
        : typeFilters.includes(review.review_type)
    );
    setFilteredReviews(filteredResults);
  }, [trackFilters, typeFilters]);

  console.log('ignacio', data);
  console.log('filteredReviews', filteredReviews);

  return (
    <>
      <Flex w='100%' minH='100vh' justify='center'>
        <Flex
          maxW='1440px'
          w='100%'
          direction='column'
          wrap='wrap'
          mb='3%'
          mt='220px'
        >
          <NavBar
            history={history}
            isLoading={isLoading}
            setSearchResults={setSearchResults}
            trackFilters={trackFilters}
            setTrackFilters={setTrackFilters}
            typeFilters={typeFilters}
            setTypeFilters={setTypeFilters}
          />

          <Flex height='70%' wrap='wrap'>
            {isLoading ? (
              <Flex w='100%' h='100%' justify='center' align='center'>
                <CustomSpinner />
              </Flex>
            ) : filteredReviews.length >= 1 ? (
              filteredReviews.map(review => (
                <ReviewCard key={review.id} review={review} history={history} />
              ))
            ) : searchResults.length > 0 ||
              trackFilters.length > 0 ||
              typeFilters.length > 0 ? (
              <Flex as='h3' w='100%' ml='6%' mt='5%' overflow='visible'>
                <Alert
                  status='info'
                  variant='subtle'
                  flexDirection='column'
                  justifyContent='center'
                  textAlign='center'
                  height='312px'
                  width='625px'
                  background='#F2F6FE'
                  borderRadius='12px'
                  mt='2%'
                  wrap='nowrap'
                >
                  {/* <AlertIcon size='40px' mr={0} /> */}
                  <AlertDescription w='100%'>
                    Sorry, no job reviews found.
                  </AlertDescription>
                </Alert>
              </Flex>
            ) : (
              data.map(review => (
                <ReviewCard key={review.id} review={review} history={history} />
              ))
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

const mapStateToProps = state => {
  return {
    isLoading: state.review.fetchingData,
    data: state.review.data
  };
};
export default connect(
  mapStateToProps,
  (getReview, getCompanyReview)
)(DashboardHome);
