import React, { useState, useContext } from 'react';

import Card from './Card';
import Button from '../../shared/components/UIElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
// import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import AuthContext from '../../shared/utils/context/auth-context';
import useHttpClient from '../../shared/utils/hooks/http-hook';
import './Item.css';

const PlaceItem = ({
  id, image, title, price, author, description, onDelete,
}) => {
  const {
    isLoading, error, sendRequest, clearError,
  } = useHttpClient();
  const auth = useContext(AuthContext);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);

    try {
      await sendRequest(
        `http://localhost:5000/api/item/${id}`,
        'DELETE',
        null,
        {
          Authorization: `Bearer ${auth.token}`,
        },
      );
      onDelete(id);
      console.log('deleted');
    } catch (err) {}
  };
  const openDetailHandler = () => {
    setShowDetail(true);
  };

  const closeMapHandler = () => {
    setShowDetail(false);
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showDetail}
        onCancel={closeMapHandler}
        header={title}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <div>
            {description}
          </div>
          <div>
            Created by
            {' '}
            {author}
          </div>
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={(
          <>
            <Button onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        )}
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter!!
        </p>
      </Modal>
      <li className="place-item center">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${image}`}
              alt={title}
            />
          </div>
          <div className="place-item__info">
            <h2>{title}</h2>
            <h3>
              {price}
              $
            </h3>
          </div>
          <div className="place-item__actions">
            <Button onClick={openDetailHandler}>
              View Detail
            </Button>
            { auth.userId === author && (
            <Button inverse to={`/items/edit/${id}`}>EDIT</Button>
            )}
            {/* auth.userId === props.creatorId */}
            { auth.userId === author && (
            <Button danger onClick={showDeleteWarningHandler}>
              DELETE
            </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
