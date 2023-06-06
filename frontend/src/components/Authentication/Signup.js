import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Signup = () => {
    const [ name, setName ] = useState();
    const [ email, setEmail ] = useState();
    const [ password, setPassword ] = useState();
    const [ confirmpassword, setConfirmpassword ] = useState();
    const [ pic, setPic ] = useState();
    const [ show, setShow ] = useState( false );
    const [ loading, setLoading ] = useState( false );
    const toast = useToast();
    const history = useHistory();

    const handleClick = () => setShow( !show );
    const postDetails = ( pics ) => {
        setLoading( true );
        if ( pics === undefined ) {
            toast( {
                title: 'Please Select an Image!',
                position: 'bottom',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            } );
            setLoading( false );
            return;
        }
        if ( pics.type === "image/jpeg" || pics.type === "image/png" ) {
            const data = new FormData();
            data.append( "file", pics );
            data.append( "upload_preset", "chat-app" );
            data.append( "cloud_name", "vijayaragavan" );
            fetch( "https://api.cloudinary.com/v1_1/vijayaragavan/image/upload", {
                method: "post",
                body: data,
            } ).then( ( res ) => res.json() )
                .then( data => {
                    setPic( data.url.toString() );
                    console.log( data )
                    setLoading( false );
                } ).catch( ( err ) => {
                    console.log( err );
                    setLoading( false )
                } );
        } else {
            toast( {
                title: "Please Select an Image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            } )
        }
    };
    const submitHandler = async () => {
        setLoading( true );
        if ( !name || !email || !password || !confirmpassword ) {
            toast( {
                title: "Please Fill all the fields",
                status: "warning",
                duration: 2500,
                isClosable: true,
                position: "bottom"
            } );
            setLoading( false );
            return;
        }
        if ( password !== confirmpassword ) {
            toast( {
                title: 'Passwords Do Not Match',
                status: 'warning',
                duration: 2500,
                isClosable: true,
                position: 'bottom',
            } )
            setLoading( false );
            return;
        }
        try {
            setLoading( false );
            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            };
            const { data } = await axios.post( '/api/user', { name, email, password, pic }, config );
            toast( {
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            } );
            localStorage.setItem( 'userInfo', JSON.stringify( data ) );

            history.push( '/chats' )
        } catch ( error ) {
            setLoading( false )
            toast( {
                title: "Error Occured",
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',

            } );

        }
    };

    return ( <
        VStack spacing="5px" >
        <
        FormControl id="name"
            isRequired >
            <
        FormLabel > Name < /FormLabel> <
        Input placeholder='Enter Your Name'
                    onChange={
                        ( e ) => { setName( e.target.value ) } }

                >
                    < /Input>

                    <
        /FormControl> <
        FormControl id="email"
                        isRequired >
                        <
        FormLabel > Email < /FormLabel> <
        Input placeholder='Enter Your Email'
                                onChange={
                                    ( e ) => { setEmail( e.target.value ) } } >
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
                                                    ( e ) => { setPassword( e.target.value ) } } >
                                                < /Input> <
        InputRightElement width="4.5rem" >
                                                    <
        Button h="1.75rem"
                                                        size="sm"
                                                        onClick={ handleClick } > { show ? "Hide" : "show" } < /Button> <
        /InputRightElement> <
        /InputGroup>


                                                        <
        /FormControl> <
        FormControl id="confirmpassword"
                                                            isRequired >
                                                            <
        FormLabel > Confirm Password < /FormLabel> <
        InputGroup size="md" >
                                                                    <
        Input type={ show ? "text" : "password" }
                                                                        placeholder="Confirm Password"
                                                                        onChange={
                                                                            ( e ) => setConfirmpassword( e.target.value ) } >
                                                                        < /Input> <
        InputRightElement width="4.5rem" >
                                                                            <
        Button h="1.75rem"
                                                                                size="sm"
                                                                                onClick={ handleClick } > { show ? "Hide" : "show" } < /Button> <
        /InputRightElement> <
        /InputGroup>

                                                                                <
        /FormControl> <
        FormControl id="pic" >
                                                                                    <
        FormLabel > Upload your Picture < /FormLabel> <
        Input type='file'
                                                                                            p={ 1.5 }
                                                                                            accept="image/*"
                                                                                            onChange={
                                                                                                ( e ) => postDetails( e.target.files[ 0 ] ) } >
                                                                                            < /Input> <
        /FormControl> <
        Button colorScheme='blue'
                                                                                                width="100%"
                                                                                                style={
                                                                                                    { marginTop: 15 } }
                                                                                                onClick={ submitHandler }
                                                                                                isLoading={ loading } >
                                                                                                Sign Up < /Button> <
        /VStack>

                                                                                                )
}

                                                                                                export default Signup