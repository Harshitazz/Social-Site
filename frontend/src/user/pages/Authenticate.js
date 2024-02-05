import React  from "react";
import Input from "../../shared/componets/Formelement/Input";
import Button from "../../shared/componets/ui elements/Button";
import LoadingSpinner from '../../shared/componets/ui elements/LoadingSpinner';
import ImageUpload from "../../shared/componets/Formelement/imageElement";
import { useForm } from "../../shared/componets/hooks/form-hook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from "../../shared/Utils/validators";
import { useState ,useContext} from "react";
import Card from "../../shared/componets/ui elements/Card";
import ErrorModal from '../../shared/componets/ui elements/ErrorModal'
import { useHttpClient } from "../../shared/componets/hooks/http-hook";
import { AuthContext } from "../../shared/componets/hooks/context/auth-context";


const Authenticate = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const {isLoading,isError, sendRequest,clearError}=useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
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
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();

    if(isLoginMode){
      try{
        const responseData=await sendRequest('http://localhost:5000/api/users/login',
        'POST',
        JSON.stringify({
          email:formState.inputs.email.value,
          password:formState.inputs.password.value
        }),
            {'Content-Type':'application/json'}
          
        );
        auth.login(responseData.userId ,responseData.token);
       


      }catch(err){

      }
    }else{
      try{
        const formData =new FormData();
        formData.append('email',formState.inputs.email.value)
        formData.append('name',formState.inputs.name.value)
        formData.append('password',formState.inputs.password.value)
        formData.append('image',formState.inputs.image.value)

        const responseData=await sendRequest('http://localhost:5000/api/users/signup',
        'POST',
        formData
        );
        auth.login(responseData.userId , responseData.token);

      }catch(err){
        
      }
    }
  };

  return (
    <React.Fragment>
      <ErrorModal onClear={clearError} error={isError}/>
    <Card className="authentication">
      {isLoading && <LoadingSpinner asOverlay/>}
      <h2>Login Required</h2>
      <hr />
      <form onSubmit={authSubmitHandler}>
        {!isLoginMode && (
          <Input
            element="input"
            id="name"
            type="text"
            label="Your Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a name."
            onInput={inputHandler}
          />
        )}
        {!isLoginMode && (
          <ImageUpload center id='image' onInput={inputHandler} errorText="please provide an image."/>
        )}
        <Input
          element="input"
          id="email"
          type="email"
          label="E-Mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
        <Input
          element="input"
          id="password"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(10)]}
          errorText="Please enter a valid password, at least 10 characters."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode ? 'LOGIN' : 'SIGNUP'}
        </Button>
      </form>
      <Button inverse onClick={switchModeHandler}>
        SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
      </Button>
    </Card>
    </React.Fragment>
  );
};

export default Authenticate;
