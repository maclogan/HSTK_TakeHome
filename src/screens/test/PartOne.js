import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import localPlaceholderData from "../../localPlaceholderData";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AntDesign } from "@expo/vector-icons";

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
    return (
        <SafeAreaView>
            <Text>
                Part One
            </Text>
            <FlatList
                data = {localPlaceholderData}
                renderItem={({item}) => <Post post={item} />}
                keyExtractor={item => item.id}
             />
        </SafeAreaView>
    )
}

