import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Formik,
} from 'formik';
import * as Yup from 'yup';
import { TextareaAutosize } from '@material-ui/core';
import Button from '../../shared/components/UIElements/Button';
import {
  Label, StyledForm, TextFieldWrapper, StyledInlineErrorMessage, MyTextField, StyledTextarea,
} from './NewItemPage';
import useHttpClient from '../../shared/utils/hooks/http-hook';
import AuthContext from '../../shared/utils/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

const validationSchema = Yup.object().shape({

  description: Yup.string()
    .min(10, 'Too short! I am not taking it!')
    .required('Please enter a description'),
  price: Yup.string()
    .required('Please enter a price'),

});

const UpdateItemPage = () => {
  const auth = useContext(AuthContext);
  const { itemId } = useParams();
  const history = useHistory();
  const [loadedItem, setLoadedItem] = useState();
  const {
    isLoading, error, sendRequest, clearError,
  } = useHttpClient();

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/item/${itemId}`,
        );
        console.log('responseData', responseData);
        setLoadedItem(responseData.item);
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, itemId]);

  // const identifiedItem = DUMMY_ITEM.filter((item) => item.id === itemId)[0];
  if (!loadedItem && !error) {
    return (
      <div className="center">
        <h2>Could not find this item</h2>
      </div>
    );
  }

  return (
    <div>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      <Formik
        initialValues={{
          title: loadedItem.title,
          price: loadedItem.price,
          description: '',
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/item/${itemId}`,
              'PATCH',
              JSON.stringify({
                price: values.price,
                description: values.description,
              }),
              {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`,
              },
            );
            history.push('/items');
          } catch (err){}
        }}
      >
        {({
          values, isSubmitting, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue,
        }) => (
          <StyledForm onSubmit={handleSubmit}>
            {/* <StyledHeader>Add new Item</StyledHeader> */}
            <TextFieldWrapper>
              <MyTextField
                variant="outlined"
                name="title"
                type="input"
                label="Title"
                disabled
              />
            </TextFieldWrapper>

            <TextFieldWrapper>
              <MyTextField
                variant="outlined"
                name="price"
                type="input"
                label="Price"
              />
            </TextFieldWrapper>
            <TextFieldWrapper>
              <Label htmlFor="fullname">
                Description
                <StyledTextarea
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="description"
                  // type="textarea"
                  label="Description"
                  defaultValue={loadedItem.description}
                  rowsMin={5}
                  as={TextareaAutosize}
                />

              </Label>
              {errors.description && touched.description && (
              <StyledInlineErrorMessage>
                {errors.description}
              </StyledInlineErrorMessage>
              )}
            </TextFieldWrapper>

            <pre>
              {JSON.stringify(values, null, 2)}
            </pre>
            <pre>
              {JSON.stringify(errors, null, 2)}
            </pre>
            <div>

              <Button inverse disable={isSubmitting} type="submit">
                Edit Item
              </Button>
            </div>
          </StyledForm>
        )}
      </Formik>
    </div>

  );
};
export default UpdateItemPage;
