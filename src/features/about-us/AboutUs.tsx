import React from 'react';
import { Layout, Box, Text, Image } from '../../components';
import { aboutUsHeader, aboutUsHexagon } from '../../assets/images';
import styled from '../../styled-components';

const List = styled.ul`
  padding-left: 20px;
  margin: 0;
  line-height: 2;
`;

const banner = {
  image: `url(${aboutUsHeader})`,
  text: 'About Us'
};

function AboutUs() {
  return (
    <Layout variant='centeredColumn' banner={banner} hideSubscriptionAlert>
      <Box mt={90} mb={140}>
        <Box mb={100} paddingX={[40, 60, 120, 216]}>
          <Text variant='sectionTitle'>Mission Statement</Text>
          <Text fontSize={32} fontWeight={700} textTransform='uppercase'>
            To us, a problem is a situation asking for a solution. We imagine, and then create those solutions.
          </Text>
        </Box>

        <Box variant='centeredRow' alignItems='flex-start' flexDirection={['column', 'column', 'row']}>
          <Box width={['100%', '100%', '50%']} paddingLeft={[40, 60, 120, 216]} paddingRight={[40, 60, 0]} zIndex={5}>
            <Box mb={100}>
              <Text variant='sectionTitle'>About Us</Text>
              <Text mb={16} lineHeight='27px'>
                BidVita is a revolutionary new solution for the construction industry. Most contractors and property owners spend hours
                estimating the cost of a remodel, or new construction. BidVita is the world’s fastest bidding software that gives you back
                your time by providing estimates in minutes.
              </Text>
              <Text mb={16} lineHeight='27px'>
                BidVita was created to be user friendly, accurate, fast and provides the contractor or business owner significantly more
                bids in less time. Bid Vita delivers full takeoffs and estimates with a proprietary new technology.
              </Text>
              <Text mb={16} lineHeight='27px'>
                Our main objective in creating BidVita is to allow contractors to create bids in the field in real time, or quickly in the
                office, thus allowing the contractor to focus on field operations and generating more revenue in less time.
              </Text>
            </Box>

            <Box mb={100}>
              <Text variant='sectionTitle'>Our Core Values</Text>
              <List>
                <li>
                  <Text>We believe time is most valuable commodity</Text>
                </li>
                <li>
                  <Text>Solutions through innovation</Text>
                </li>
                <li>
                  <Text>We value ideas over hierarchy</Text>
                </li>
                <li>
                  <Text>We bet on people over process</Text>
                </li>
                <li>
                  <Text>We believe disruption is a necessity</Text>
                </li>
              </List>
            </Box>
          </Box>
          <Box variant='centeredColumn' width={['100%', '100%', '50%']} mb={100}>
            <Image src={aboutUsHexagon} objectFit='cover' maxWidth='100%' />
          </Box>
        </Box>

        <Box mb={100} paddingX={[40, 60, 120, 216]}>
          <Text variant='sectionTitle'>Vision Statement</Text>
          <Text fontSize={32} fontWeight={700} textTransform='uppercase' width='90%'>
            At BidVita we believe that technology is a necessity in the construction industry for a better future for generations to come.
          </Text>
        </Box>
      </Box>
    </Layout>
  );
}

export default AboutUs;
