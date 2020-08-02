import React from 'react';
import styled from 'styled-components';

const StyledBanner = styled.div`
    z-index: 2;
    text-align: center;
    color: black;
`;
const StyledTitle = styled.h1`
  font-size: 1.8rem;
  text-transform: uppercase;
  margin-bottom: 3rem;
  letter-spacing: 6px;
  color: lavenderblush;
  @media screen and (min-width: 768px) {
    font-size: 2.8rem;
  }
`;

export const StyledInfo = styled.p`
  font-family:'Patrick Hand';
  width: 85%;
  text-transform: capitalize;
  margin: 0 auto;
  margin-bottom: 3rem;
  color: lavenderblush;
  letter-spacing: var(--mainSpacing);
`;

const HomepageBanner = ({ title, info, children }) => (
  <StyledBanner>
    <StyledTitle>{title}</StyledTitle>
    <StyledInfo>{info}</StyledInfo>
    {children}
  </StyledBanner>
);

export default HomepageBanner;
