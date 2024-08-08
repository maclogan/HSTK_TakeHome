import { ActivityIndicator, Button, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import hstkFetch from "../../hstkFetch";
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
    postText: {
        display: "flex",
        flexDirection: "column",
        padding: 12,
        margin: 10,
        backgroundColor: "#fff",
        borderRadius: 15,
    },
    comment: {
        padding: 5,
        margin: 5
    }
})


export default function() {
    const route = useRoute()
    const { postId } = route.params
    const [ post, setPost ] = useState()
    const [ comments, setComments ] = useState()
    const [ filteredComments, setFilteredComments ] = useState()
    const [ isLoading, setIsLoading ] = useState(true)
    const [ isLoadingComments, setIsLoadingComments ] = useState(false)

    const getPost = async () => {
        hstkFetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
            .then(response => response.json())
            .then(json => setPost(json))
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false))
    }

    const getComments = async () => {
        try {
            const storedComments = await AsyncStorage.getItem('comments')
            if (storedComments) {
                    setComments(JSON.parse(storedComments));
            } else {
                hstkFetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
                .then(response => response.json())
                .then(json => {
                    json.map((comment) => comment.show = true)
                    console.log(json)
                    setComments(json)
                })
                .catch(error => console.error(error))
                .finally(() => setIsLoadingComments(false))
            }
        } catch (error) {
            console.error(error)
        }
    
        
    }

    const hideComment = (commentId) => {
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === commentId ? { ...comment, show: false } : comment
          )
        );
      };

    useEffect(() => {
        getPost()
        getComments()
    }, [postId])

    useEffect(() => {
        const saveComments = async () => {
            try {
                await AsyncStorage.setItem('comments', JSON.stringify(comments))
            } catch (error) {
                console.error('Saving failed: ', error)
            }
        }

        if (comments) saveComments()
    }, [comments])

    const getFilteredComments = () => {
        if (!comments) return
        return comments.filter(comment => {
            return comment.show
        })
    }
    return (
        isLoading || isLoadingComments ? (
            <ActivityIndicator />
        ) : (
            <>
                <SafeAreaView style={styles.postText}>
                    <Text style={{fontWeight: 'bold', fontSize: 20}}>{post.title}</Text>
                    <Text>{post.body}</Text>
                    <View style={{height: 1, backgroundColor: '#000', marginVertical: 10}} />
                    <FlatList 
                        data={getFilteredComments()} 
                        renderItem={({item}) => (
                            <View style={styles.comment}>
                                <Text style={{fontWeight: 'bold'}}>{item.email}</Text>
                                <Text>{item.body}</Text>
                                <Button onPress={() => hideComment(item.id)} title = {'Hide Comment'} color='rebeccapurple' />
                            </View> 
                        )
                        }
                        keyExtractor={item => item.id} 
                    />
                </SafeAreaView>
            </>
        )
  
    )
}