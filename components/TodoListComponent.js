import React, { useEffect, useRef, useState } from 'react'
import { Center, Box, Heading, HStack, VStack, IconButton, useToast, Input, Icon, Feather, Checkbox, Entypo, NativeBaseProvider, Text, Switch } from 'native-base';
import { FlatList, SectionList } from 'react-native';
import db from '../database';
import { FontAwesome5 } from '@expo/vector-icons';
import { DBCoreRangeType } from 'dexie';
import { ActivityIndicator } from 'react-native-web';

const TodoListComponent = ({ navigation }) => {
    const inputCadastrarRef = useRef(null);
    const [tasks, setTasks] = React.useState([]);
    const [inputValue, setInputValue] = React.useState("");
    const [title, setTitle] = useState('')
    const [isCompleted, setIs_completed] = useState(false)
    const [modoEdit, setModo_edit] = useState(false)
    const [modoEditId, setModo_edit_id] = useState('')
    const [showCompleted, setShow_completed] = useState(true)
    const [showLoading, setShow_loading] = useState(false)

    useEffect(() => {
        loadTasks();
    }, [])

    useEffect(() => {
        loadTasks();
    }, [showCompleted])

    const loadTasks = async () => {
        try {
            setShow_loading(true)
            let tasks = []

            if (showCompleted == true) {
                tasks = await db.tasks.toArray();
            } else {
                tasks = await db.tasks.filter(task => task.isCompleted == false).toArray();
            }


            // preparar dados
            const dados_pendentes = tasks.filter(task => !task.isCompleted);
            const dados_concluidas = tasks.filter(task => task.isCompleted);
            let formattedTasks = [
            ];
            if (dados_pendentes.length > 0) {
                formattedTasks.push({ title: 'Tarefas Pendente(s)', data: dados_pendentes });
            }
            if (dados_concluidas.length > 0) {
              //  const sortedTasks = dados_concluidas.sort((a, b) => b.id - a.id);//ordenar descrescente
                formattedTasks.push({ title: 'Tarefas Concluída(s)', data: dados_concluidas });
            }


            setTasks(formattedTasks)
            setShow_loading(false)
            focusInputTitleCadastro()
        } catch (error) {
            alert(error)
        }
    }

    const addItem = async () => {

        try {
            if (title === "") {
                throw new Error("Digite uma tarefa");
            }

            //TODO Implementar salvar tarefa
            db.tasks.add({
                title: title,
                isCompleted: isCompleted
            })
            setTitle('')
            loadTasks()
        } catch (error) {
            alert(error)
        }

    };

    const handleDelete = async (index) => {
        //TODO Implementar alert adequado
        try {
            await db.tasks.delete(index)
            loadTasks()
        } catch (error) {
            alert('Não foi possível excluir tarefa. ' + error)
        }

    };

    const handleStatusChange = async (index) => {
        try {
            const task = await db.tasks.get(index)
            const isCompletedAtual = task.isCompleted
            db.tasks.update(index, {
                isCompleted: !isCompletedAtual
            })
            loadTasks()
        } catch (error) {
            alert(error)
        }
    };

    const handleUpdate = async (index) => {
        try {
            await db.tasks.update(index, {
                title: inputValue
            })
            //TODO Alert mais agradavel 
            setModo_edit(false)
            setModo_edit_id('')
            setInputValue('')
            loadTasks()
            alert('Alterado')

        } catch (error) {
            alert(error)
        }
    }

    // colcoar foco no input de texto novamente após cadastrar uma tarefa e ao carregar página
    const focusInputTitleCadastro = () => {
        if (inputCadastrarRef.current) {
            inputCadastrarRef.current.focus();
        }
    };

    return (
        <NativeBaseProvider><Center w="100%">
            <Box maxW="300" w="100%">
                <Heading mb="2" size="md">
                    Cadastrar Tarefa
                </Heading>
                <VStack space={4}>
                    <HStack space={2}>
                        <Input flex={1} onSubmitEditing={() => addItem()} onChangeText={input => setTitle(input)} value={title} placeholder="Descreva sua tarefa" ref={inputCadastrarRef} />
                        <IconButton borderRadius="sm" variant="solid" icon={<Icon as={FontAwesome5} name="plus-circle" size="sm" color="warmGray.50" />} onPress={() => {
                            addItem()
                        }} />
                    </HStack>

                    {/* <HStack alignItems="center" space={4}>
                        <Text>Mostrar concluídas</Text>
                        <Switch size="sm" colorScheme="primary" isChecked={showCompleted} onToggle={(setShow_completed)} />
                    </HStack> */}

                    <VStack space={2}>

                        {
                            showLoading && (
                                <ActivityIndicator></ActivityIndicator>
                            )
                        }

                        <SectionList
                            sections={tasks}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                                if (modoEdit && modoEditId == item.id) {
                                    return (<HStack w="100%" justifyContent="space-between" alignItems="center" key={item.title + item.id.toString()} >
                                        <Input value={inputValue} placeholder="Descreva sua tarefa" onChangeText={setInputValue} onSubmitEditing={() => {
                                            handleUpdate(item.id)
                                        }} />
                                        < IconButton size="sm" colorScheme="trueGray" icon={<Icon as={FontAwesome5} name="check" size="sm" color="green.500" />} onPress={() => handleUpdate(item.id)} />
                                    </HStack>);

                                } else {
                                    return (
                                        <HStack w="100%" justifyContent="space-between" alignItems="center" key={item.title + item.id.toString()} >

                                            <Checkbox isChecked={item.isCompleted} onChange={() => handleStatusChange(item.id)} value={item.id}></Checkbox>
                                            <Text width="100%" flexShrink={1} textAlign="left" mx="2" strikeThrough={item.isCompleted} _light={{
                                                color: item.isCompleted ? "gray.400" : "coolGray.800"
                                            }} _dark={{
                                                color: item.isCompleted ? "gray.400" : "coolGray.50"
                                            }}>
                                                {item.title}
                                            </Text>

                                            < IconButton size="sm" colorScheme="trueGray" icon={<Icon as={FontAwesome5} name="edit" size="sm" color="blue.500" />} onPress={() => {

                                                setInputValue(item.title)
                                                setModo_edit(true)
                                                setModo_edit_id(item.id)
                                            }} />
                                            < IconButton size="sm" colorScheme="trueGray" icon={<Icon as={FontAwesome5} name="trash" size="sm" color="red.500" />} onPress={() => handleDelete(item.id)} />
                                        </HStack>
                                    );
                                }
                            }
                            }
                            renderSectionHeader={({ section: { title, data } }) => (
                                <HStack w="100%" justifyContent="space-between" alignItems="center" marginTop="10px" >
                                    <Heading fontSize="20px">{data.length} {title}</Heading>
                                </HStack>
                            )}
                        />
                    </VStack>
                </VStack>
            </Box>
        </Center>
        </NativeBaseProvider >);
};

export default TodoListComponent;