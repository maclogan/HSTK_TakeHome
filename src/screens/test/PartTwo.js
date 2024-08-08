import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AntDesign } from "@expo/vector-icons";
import hstkFetch from "../../hstkFetch";
import {useState, useEffect} from 'react'

const styles = StyleSheet.create({
    post: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",    
        backgroundColor: "#fff",
        padding: 12,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 15
    },
    postText: {
        display: "flex",
        flexDirection: "column",
        width: '50%'
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 15,
        padding: 10,
        margin: 12
    }
})

const Post = ({post}) => {
    const { title, body } = post
    return (
        <SafeAreaView style={styles.post}>
            <MaterialCommunityIcons name="post-outline" size={24} color="black" />
            <View style={styles.postText}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>{title}</Text>
                <Text>{body}</Text>
            </View>
            <AntDesign name="right" size={24} color="black" />
        </SafeAreaView>
    )
}

export default function () {

    const [isLoading, setisLoading] = useState(true)
    const [data, setData] = useState()
    const [filteredPosts, setFilteredPosts] = useState()

    const getPosts = async () => {
        try {
            const response = await hstkFetch('https://jsonplaceholder.typicode.com/posts')
            const json = await response.json()
            setData(json)
            setFilteredPosts(json)
        } catch (error) {
            console.error(error)
        } finally {
            setisLoading(false)
        }
    }

    const filterResults = (inputText) => {
        if (!data) return
        setFilteredPosts(data.filter(post => post.body.toLowerCase().includes(inputText.toLowerCase())))
    }

    useEffect(() => {
        getPosts()
    }, [])

    return (
        <SafeAreaView>
            <Text>
                Part Two
            </Text>
            {isLoading ? (
                <ActivityIndicator size="large" />
            ) : ( 
                filteredPosts ?     
                    (       
                        <FlatList
                            ListHeaderComponent={
                                <TextInput 
                                    onChangeText={filterResults} 
                                    style={styles.textInput } 
                                    placeholder="Type to filter posts"
                                /> 
                            }
                            data = {filteredPosts}
                            renderItem={({item}) => <Post post={item} />}
                            keyExtractor={item => item.id}
                            ListEmptyComponent={<Text style={{padding: 10, margin: 12}}>No results</Text>}
                        />
                    ) : (
                        <Text>Something went wrong, check the console for more information</Text>
                    )
                )
            }
        </SafeAreaView>
    )
}

