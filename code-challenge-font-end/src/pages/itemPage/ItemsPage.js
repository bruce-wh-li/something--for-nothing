import React, { useEffect, useState } from 'react';
import ItemList from '../../components/itemComponent/ItemList';
import useHttpClient from '../../shared/utils/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const ItemsPage = () => {
  const [loadedItems, setLoadedItems] = useState();
  const {
    isLoading, error, sendRequest, clearError,
  } = useHttpClient();
  useEffect(() => {
    const fetchPlaces = async () => {
      console.log(process.env.REACT_APP_BACKEND_URL+'/item');
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL+'/item',
        );

        setLoadedItems(responseData.items);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest]);

  const itemDeletedHandler = (deletedItemId) => {
    setLoadedItems((prevItems) => prevItems.filter((item) => item.id !== deletedItemId));
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedItems && (
      <ItemList items={loadedItems} onDeleteItem={itemDeletedHandler} />
      )}
    </>
  );
};

export default ItemsPage;
