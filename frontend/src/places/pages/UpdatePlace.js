import React, { useContext, useEffect, useState } from "react";
import { useParams ,useHistory} from "react-router-dom/cjs/react-router-dom.min";
import Input from "../../shared/componets/Formelement/Input";
import Button from "../../shared/componets/ui elements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/Utils/validators";
import { useForm } from "../../shared/componets/hooks/form-hook";
import { useHttpClient } from "../../shared/componets/hooks/http-hook";
import LoadingSpinner from "../../shared/componets/ui elements/LoadingSpinner";
import { AuthContext } from '../../shared/componets/hooks/context/auth-context';

const UpdatePlace = () => {
  const auth =useContext(AuthContext);
  const {isLoading,isError, sendRequest}=useHttpClient();
  const [loadedplace,setisloadedplace]=useState(null)
  const placeId = useParams().placeId;
  const history = useHistory();

  const [formState, inputHandler,setFormData] = useForm(
    {
      title:{
        value:'',
        isValid:false
      },
      description:{
        value: '',
        isValid: false
      }
    },false
  );
useEffect(()=>{
  const fetchplace = async()=>{
    try{
      const responseData =await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`)
      setisloadedplace(responseData.place);

      setFormData(
        {
          title: {
            value: responseData.place.title,
            isValid: true
          },
          description: {
            value: responseData.place.description,
            isValid: true
          }
        },
        true
      );
    }catch(err){}
  }
  fetchplace()
},[sendRequest,placeId,setFormData]);
  
  const placeSubmitHandler =async (event) => {
  

    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token

        }
      );
      history.push('/' + auth.userId + '/places');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner/>
      </div>
    );
  }
 
  if (!loadedplace && !isError) {
    return (
      <div className="center">
        <h2>could not find places...</h2>
      </div>
    )
  }

  return (<React.Fragment>
          {isLoading && <LoadingSpinner asOverlay/>}

    {!isLoading && loadedplace &&(
      <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input
        id="title"
        type="text"
        label="Title"
        element="input"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValid={formState.inputs.title.isValid}
        initialValue={formState.inputs.title.value}
        
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
    )}
    </React.Fragment>
  );
};

export default UpdatePlace;
