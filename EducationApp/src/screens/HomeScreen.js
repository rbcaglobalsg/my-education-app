// C:\Users\marcu\education_app\EducationApp\src\screens\HomeScreen.js
import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Avatar, Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const BRAND_COLOR = '#00B894';
const GRADIENT_COLORS = ['#FFFFFF', '#F0F4F8'];

const TopBar = () => {
    return (
        <View style={styles.topBarContainer}>
            <Text style={styles.appName}>bzla</Text>
            <TouchableOpacity style={styles.avatarWrapper}>
                <Avatar.Image size={40} source={{ uri: 'https://via.placeholder.com/40' }} />
            </TouchableOpacity>
        </View>
    );
};

const SearchBar = () => {
    return (
        <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={24} color="#666" style={{ marginHorizontal: 5 }} />
            <TextInput
                placeholder="어떤 서비스를 찾으시나요?"
                style={styles.searchInput}
                underlineColorAndroid="transparent"
                mode="flat"
            />
            <TouchableOpacity>
                <MaterialCommunityIcons name="microphone" size={24} color="#666" style={{ marginHorizontal: 5 }} />
            </TouchableOpacity>
        </View>
    );
};

const CategoryItem = ({ iconName, title }) => {
    return (
        <TouchableOpacity style={styles.categoryItem}>
            <View style={styles.categoryIconWrapper}>
                <MaterialCommunityIcons name={iconName} size={24} color={BRAND_COLOR} />
            </View>
            <Text style={styles.categoryText}>{title}</Text>
        </TouchableOpacity>
    );
};

const CategoryList = () => {
    const categories = [
        { iconName: 'home-outline', title: '홈' },
        { iconName: 'account-search-outline', title: '강사찾기' },
        { iconName: 'book-outline', title: '과외' },
        { iconName: 'guitar-acoustic', title: '악기레슨' },
        { iconName: 'car-outline', title: '운전' },
        { iconName: 'heart-outline', title: '헬스/요가' },
        { iconName: 'brush', title: '미술/디자인' },
    ];

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
            {categories.map((cat, idx) => (
                <CategoryItem key={idx} iconName={cat.iconName} title={cat.title} />
            ))}
        </ScrollView>
    );
};

const ServiceCard = ({ title, imageUri }) => {
    return (
        <Card style={styles.serviceCard}>
            <Card.Cover source={{ uri: imageUri }} style={styles.serviceCardImage} />
            <Card.Title title={title} titleStyle={styles.serviceCardTitle} />
        </Card>
    );
};

const PopularServices = () => {
    const services = [
        { title: '피아노 레슨', imageUri: 'https://via.placeholder.com/150' },
        { title: '특허 상담', imageUri: 'https://via.placeholder.com/150' },
        { title: 'DIY 목공', imageUri: 'https://via.placeholder.com/150' },
    ];

    return (
        <View style={styles.popularContainer}>
            <Text style={styles.sectionTitle}>인기 서비스</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {services.map((srv, idx) => (
                    <ServiceCard key={idx} title={srv.title} imageUri={srv.imageUri} />
                ))}
            </ScrollView>
        </View>
    );
};

const LoginPrompt = ({ navigation }) => {
    return (
        <View style={styles.loginPromptContainer}>
            <Text style={styles.loginPromptText}>로그인하고 더 많은 기능을 이용해보세요</Text>
            <Button
                mode="outlined"
                onPress={() => navigation.navigate('Login')}
                style={styles.loginButton}
                textColor={BRAND_COLOR}
            >
                로그인
            </Button>
        </View>
    );
};

const HomeScreen = ({ navigation }) => {
    return (
        <LinearGradient colors={GRADIENT_COLORS} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TopBar />
                <SearchBar />
                <CategoryList />
                <PopularServices />
                <LoginPrompt navigation={navigation} />
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 50,
        paddingBottom: 60,
    },
    topBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    avatarWrapper: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: BRAND_COLOR,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginHorizontal: 10,
        paddingVertical: 0,
        fontSize: 16,
        backgroundColor: 'transparent',
    },
    categoryList: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    categoryItem: {
        alignItems: 'center',
        marginRight: 15,
    },
    categoryIconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e6f7f2',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    categoryText: {
        fontSize: 12,
        color: '#333',
    },
    popularContainer: {
        marginHorizontal: 20,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    serviceCard: {
        width: 120,
        marginRight: 10,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    serviceCardImage: {
        height: 100,
        backgroundColor: '#f0f0f0',
    },
    serviceCardTitle: {
        fontSize: 14,
        color: '#333',
    },
    loginPromptContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    loginPromptText: {
        fontSize: 14,
        marginBottom: 10,
        color: '#333',
    },
    loginButton: {
        borderColor: BRAND_COLOR,
        borderRadius: 20,
        paddingHorizontal: 20,
    },
});

export default HomeScreen;
