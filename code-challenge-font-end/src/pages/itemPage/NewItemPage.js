import React, { useContext } from 'react';
import styled from 'styled-components';
import { useHistory, Redirect } from 'react-router-dom';
import {
  Formik, Field, Form, useField,
} from 'formik';
import * as Yup from 'yup';
import { TextField, TextareaAutosize } from '@material-ui/core';

import ImageUpload from '../../shared/components/formElements/ImageUpload';
import Button from '../../shared/components/UIElements/Button';
import AuthContext from '../../shared/utils/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import useHttpClient from '../../shared/utils/hooks/http-hook';

export const TextFieldWrapper = styled.div`
    margin: 1rem;
    max-width: 500px; 
    padding: 20px
`;

export const StyledHeader = styled.div`
  font-size:20px;
  text-align:center;
  font-weight: bold;
`;
const ImageFieldWrapper = styled.div`
    margin: 1rem;
    max-width: 500px; 
    padding: 50px;
`;
export const StyledInput = styled(TextField)`
  width:100%
`;
export const StyledTextarea = styled(Field)`
  width:100%
`;
export const Label = styled.label`
  margin-top: 1rem;
  width: 100%;
`;

export const StyledInlineErrorMessage = styled.div`
  background-color: rgb(255, 245, 245);
  color: rgb(120, 27, 0);
  display: block;

  padding: 0.5rem 0.75rem;
  margin-top: 0.5rem;
  white-space: pre-line;
`;

export const StyledForm = styled(Form)`
  font-family:Lato;
  position: relative;
  list-style: none;
  margin: 0 auto;
  padding: 1rem;
  width: 90%;
  max-width: 40rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 6px;
  // background: var(--primaryColor);
}
`;

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Get a longer title')
    .required('Please enter your full name'),
  description: Yup.string()
    .min(10, 'Too short! I am not taking it!')
    .required('Please enter a description'),
  price: Yup.string()
    .required('Please enter a price'),
  image: Yup
    .mixed()
    .required('A file is required'),
});

export const MyTextField = (props) => {
  const [field, meta] = useField(props);
  const {
    name, type, label, placeholder, disabled,
  } = props;
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <StyledInput
      {...field}
      name={name}
      type={type}
      label={label}
      placeholder={placeholder}
      helperText={errorText}
      error={!!errorText}
      disabled={disabled}
    />
  );
};

const NewItemPage = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const {
    isLoading, error, sendRequest, clearError,
  } = useHttpClient();
  return (

    <div>
      {!auth.isLoggedIn && <Redirect to="/signin" />}
      <ErrorModal error={error} onClear={clearError} />
      <Formik
        initialValues={{
          title: '',
          price: '',
          description: '',
          image: null,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('price', values.price);
            formData.append('image', values.image);
            formData.append('author', auth.userId);

            await sendRequest(process.env.REACT_APP_BACKEND_URL+'/item/newitem', 'POST', formData, {
              Authorization: `Bearer ${auth.token}`,
            });
            history.push('/items');
          } catch (err) {}
          // setSubmitting(false); // not sure if I am goon use this or not, read doc for future reference
        }}
      >
        {({
          values, isSubmitting, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue,
        }) => (

          <StyledForm onSubmit={handleSubmit}>
            {isLoading && <LoadingSpinner asOverlay />}
            <StyledHeader>Add new Item</StyledHeader>
            <TextFieldWrapper>

              <MyTextField
                variant="outlined"
                name="title"
                type="input"
                label="Title"
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
                  variant="outlined"
                  name="description"
                  type="textarea"
                  label="Description"
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
            <ImageFieldWrapper>

              <Field
                id="image"
                name="image"
                type="file"
                onChange={(file:props) => {
                  setFieldValue('image', file);
                }}
                as={ImageUpload}
              />
              {errors.image && touched.image && (
              <StyledInlineErrorMessage>
                {errors.image}
              </StyledInlineErrorMessage>
              )}

            </ImageFieldWrapper>
            <pre>
              {JSON.stringify(values, null, 2)}
            </pre>
            <pre>
              {JSON.stringify(errors, null, 2)}
            </pre>
            <div>

              <Button inverse disabled={isSubmitting} type="submit">
                ADD ITEM
              </Button>
            </div>
          </StyledForm>
        )}
      </Formik>
    </div>
  );
};
export default NewItemPage;
