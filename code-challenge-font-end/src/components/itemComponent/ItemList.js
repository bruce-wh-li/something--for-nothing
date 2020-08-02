import React from 'react';
import Styled from 'styled-components';
import Card from './Card';
import Button from '../../shared/components/UIElements/Button';

import Item from './Item';

const StyledItemList = Styled.ul`
    list-style: none;
    margin: 1rem auto;
    padding: 0;
    width: 90%;
    min-width: 60vw;
`;

const ItemList = ({ items, onDeleteItem }) => {
  if (items.length === 0) {
    return (
      <StyledItemList className="center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </StyledItemList>
    );
  }

  return (
    <StyledItemList>
      {items.map((item) => (
        <Item
          key={item.id}
          id={item.id}
          image={item.image}
          title={item.title}
          description={item.description}
          price={item.price}
          author={item.author}
          onDelete={onDeleteItem}
        />
      ))}
    </StyledItemList>
  );
};

export default ItemList;
