import React,{useContext} from "react";
import "./NewPlace.css";
import Input from "../../shared/componets/Formelement/Input";
import Button from "../../shared/componets/ui elements/Button";
import ImageUpload from "../../shared/componets/Formelement/imageElement";
import { VALIDATOR_REQUIRE , VALIDATOR_MINLENGTH } from "../../shared/Utils/validators";
import { useForm } from "../../shared/componets/hooks/form-hook";
import { useHttpClient } from "../../shared/componets/hooks/http-hook";
import {AuthContext} from '../../shared/componets/hooks/context/auth-context';
import { useHistory } from "react-router-dom"


const NewPlace = () => {
    const auth=useContext(AuthContext);

  const{sendRequest}=useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      },
      image: {
        value: null,
        isValid: false
      }
    },
    false
  );

  const history=useHistory();

  const placeSubmitHandler = async event => {
    event.preventDefault();

    try{
      const formData= new FormData();
      formData.append('title',formState.inputs.title.value);
      formData.append('description',formState.inputs.description.value)
      formData.append('address',formState.inputs.address.value)
      formData.append('creator',auth.userId);
      formData.append('image',formState.inputs.image.value)

      console.log(formState.inputs.image.value)
      
      const responseData= await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places`, 'POST', formData, {
        headers: {
          ...formData.getHeaders(), // Include existing headers from formData
          'Authorization': 'Bearer ' + auth.token, // Add or modify Authorization header
          'Content-Type': 'multipart/form-data' // Add additional custom header
        }
      });
      console.log(responseData)
      //redirect to a new page on adding a new pllace 
      history.push('/')

    }catch(err){

    }
  };
    return(
    <form className="place-form" onSubmit={placeSubmitHandler}>
    <Input
      id="title"
      element="input"
      type="text"
      label="Title"
      validators={[VALIDATOR_REQUIRE()]}
      errorText="Please enter a valid title."
      onInput={inputHandler}
    />
    <Input
      id="description"
      element="textarea"
      label="Description"
      validators={[VALIDATOR_MINLENGTH(5)]}
      errorText="Please enter a valid description (at least 5 characters)."
      onInput={inputHandler}
    />
    <Input
      id="address"
      element="input"
      label="Address"
      validators={[VALIDATOR_REQUIRE()]}
      errorText="Please enter a valid address."
      onInput={inputHandler}
    />
    <ImageUpload center id='image' onInput={inputHandler} errorText="please provide an image."/>
    <Button type="submit" disabled={!formState.isValid}>
      ADD PLACE
    </Button>
  </form>)
 }
 export default NewPlace;