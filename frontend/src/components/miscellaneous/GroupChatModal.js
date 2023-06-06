import { Box, Button, FormControl, Input, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ( { children } ) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ groupChatName, setGroupChatName ] = useState();
    const [ selectedUsers, setSelectedUsers ] = useState( [] );
    const [ search, setSearch ] = useState( '' );
    const [ searchResult, setSearchResult ] = useState( [] );
    const [ loading, setLoading ] = useState( false );

    const toast = useToast();

    const { user, chats, setChats } = ChatState();

    const handleSearch = async ( query ) => {
        setSearch( query );
        if ( !query ) {
            return;
        }
        try {
            setLoading( true );
            const config = {
                headers: {
                    Authorization: `Bearer ${ user.token }`,
                },
            };
            const { data } = await axios.get( `/api/user?search=${ search }`, config );
            console.log( data );
            setLoading( false );
            setSearchResult( data );
        }
        catch ( error ) {
            toast( {
                title: 'Error Occured',
                description: 'Failed to Load the Search Results',
                status: 'error',
                duration: 4000,
                position: 'bottom-left',
                isClosable: true,

            } )
        }
    }
    const handleGroup = ( userToAdd ) => {
        if ( selectedUsers.includes( userToAdd ) ) {
            toast( {
                title: 'User already added',
                status: "warning",
                duration: 4000,
                isClosable: true,
                position: 'top',
            } );
            return;
        }
        setSelectedUsers( [ ...selectedUsers, userToAdd ] );
    };
    const handleDelete = ( delUser ) => {
        setSelectedUsers(
            selectedUsers.filter( ( sel ) => sel._id !== delUser._id )
        );
    };

    const handleSubmit = async () => {
        if ( !groupChatName || !selectedUsers ) {
            toast( {
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 4000,
                position: 'top',
                isClosable: true
            } );
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${ user.token }`,
                },
            };
            const { data } = await axios.post( '/api/chat/group', {
                name: groupChatName,
                users: JSON.stringify( selectedUsers.map( ( u ) => u._id ) ),
            }, config );

            setChats( [ data, ...chats ] );
            onClose();
            toast( {
                title: 'New Group Chat Created!',
                status: 'warning',
                duration: 4000,
                isClosable: true,
                position: 'bottom',
            } );
        } catch ( error ) {
            toast( {
                title: 'Failed to Create the Chat!',
                description: error.response.data,
                duration: 4000,
                isClosable: true,
                position: 'bottom',
                status: 'error'
            } )
        }
    };
    return (
        <>
            <span onClick={ onOpen }>{ children }</span>

            <Modal isOpen={ isOpen } onClose={ onClose }>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='35px'
                        fontFamily='Work sans'
                        d='flex'
                        justifyContent='center'
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display='flex' alignItems='center' flexDir='column' >
                        <FormControl>
                            <Input
                                placeholder='Chat Name'
                                mb={ 3 }
                                onChange={ ( ( e ) => setGroupChatName( e.target.value ) ) }
                            ></Input>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add Users eg: John, Vijay, Varun '
                                mb={ 3 }
                                onChange={ ( ( e ) => handleSearch( e.target.value ) ) }
                            ></Input>
                        </FormControl>
                        <Box w='100%' display='flex' flexWrap='wrap'>
                            {
                                selectedUsers.map( ( u ) => (
                                    <UserBadgeItem
                                        key={ user._id }
                                        user={ u }
                                        handleFunction={ () => handleDelete( u ) }
                                    />
                                ) )
                            }
                        </Box>


                        {
                            loading ? <div>loading</div> : (
                                searchResult?.slice( 0, 4 ).map( user => (
                                    <UserListItem key={ user._id } user={ user } handleFunction={ () => handleGroup( user ) } />
                                ) )
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={ handleSubmit }>
                            Create Chat
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal
