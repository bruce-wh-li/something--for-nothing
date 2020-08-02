import React from 'react';
import styled from 'styled-components';

import HomepageBanner from './homepageBanner';
import BgImg from '../../asset/background/bgimg.jpg';
import StyledHero from '../../components/HeroComponent/StyledHero';
import Button from '../../shared/components/UIElements/Button';

const HomePgHero = styled(StyledHero)`
    opacity:0.8!important;
    display:flex;
    justify-content:center;
    align-items:center;
`;

const StyledButton = styled(Button)`
  margin: 10px;
  width: 30%;
  @media screen and (max-width: 567px) {
    font-size: 0.7rem;
    font-weight:bolder;
    }
`;

const StyledLinkContainer = styled.div`
  display:flex;
  justify-content: space-around;
  @media screen and (max-width: 567px) {
    display:flex;
    justify-content: space-between;
    }
  
`;

const HomePage = () => (
  <div>
    <HomePgHero
      home="true"
      src={BgImg}
      height="80vh"
      id="FirstHomepage"
    >
      <HomepageBanner title="This is a .... something " info="Let me show you what we have">
        <StyledLinkContainer>
          <StyledButton inverse to='/items'>
            Go
          </StyledButton>
        </StyledLinkContainer>
      </HomepageBanner>
    </HomePgHero>
  </div>

);

export default HomePage;
