import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Login = () => {

    const [ email, setEmail ] = useState();
    const [ password, setPassword ] = useState();

    const [ show, setShow ] = useState( false );
    const [ loading, setLoading ] = useState( false );

    const toast = useToast();
    const history = useHistory();
    const handleClick = () => setShow( !show );

    const submitHandler = async () => {
        setLoading( true );
        if ( !email || !password ) {
            toast( {
                title: 'Please Fill all the Fields',
                duration: 4000,
                status: 'warning',
                isClosable: true,
                position: 'bottom'
            } );
            setLoading( false );
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post( "api/user/login", { email, password }, config );
            toast( {
                title: "Login Successful",
                status: 'success',
                duration: 4000,
                isClosable: true,
                position: 'bottom'
            } );
            localStorage.setItem( "userInfo", JSON.stringify( data ) );
            setLoading( false );
            history.push( '/chats' );

        } catch ( error ) {
            toast( {
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            } );
            setLoading( false );
        }
    };

    return ( <
        VStack spacing="5px" >

        <
        FormControl id="email"
            isRequired >
            <
        FormLabel > Email < /FormLabel> <
        Input placeholder='Enter Your Email'
                    onChange={
                        ( e ) => { setEmail( e.target.value ) } }
                    value={ email } >
                    < /Input>

                    <
        /FormControl> <
        FormControl id="password"
                        isRequired >
                        <
        FormLabel > Password < /FormLabel> <
        InputGroup >
                                <
        Input type={ show ? "text" : "password" }
                                    placeholder='Enter Your password'
                                    onChange={
                                        ( e ) => { setPassword( e.target.value ) } }
                                    value={ password } >
                                    < /Input> <
        InputRightElement width="4.5rem" >
                                        <
        Button h="1.75rem"
                                            size="sm"
                                            onClick={ handleClick } > { show ? "Hide" : "show" } < /Button> <
        /InputRightElement> <
        /InputGroup>


                                            <
        /FormControl>

                                            <
        Button colorScheme='blue'
                                                width="100%"
                                                style={
                                                    { marginTop: 15 } }
                                                onClick={ submitHandler }
                                                isLoading={ loading } >
                                                Login < /Button> <
        Button colorScheme='red'
                                                    width="100%"
                                                    variant="solid"
                                                    onClick={
                                                        () => {
                                                            setEmail( "guest@example.com" );
                                                            setPassword( "123456" );
                                                        }
                                                    } >
                                                    Get Guest User Credentials < /Button> <
        /VStack>

                                                    )
}

                                                    export default Login