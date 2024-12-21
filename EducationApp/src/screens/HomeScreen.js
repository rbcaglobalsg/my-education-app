import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Avatar, Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';

const BRAND_COLOR = '#00B894';
const GRADIENT_COLORS = ['#FFFFFF', '#F0F4F8'];

const TopBar = ({ t }) => {
    return (
        <View style={styles.topBarContainer}>
            <Text style={styles.appName}>{t('appName')}</Text>
            <TouchableOpacity style={styles.avatarWrapper}>
                <Avatar.Image size={40} source={{ uri: 'https://via.placeholder.com/40' }} />
            </TouchableOpacity>
        </View>
    );
};

const SearchBar = ({ t }) => {
    return (
        <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={24} color="#666" style={{ marginHorizontal: 5 }} />
            <TextInput
                placeholder={t('searchPlaceholder')}
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

const CategoryItem = ({ iconName, title, onPress }) => {
    return (
        <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
            <View style={styles.categoryIconWrapper}>
                <MaterialCommunityIcons name={iconName} size={24} color={BRAND_COLOR} />
            </View>
            <Text style={styles.categoryText}>{title}</Text>
        </TouchableOpacity>
    );
};

const CategoryList = ({ t, navigation }) => {
    const categories = [
        { iconName: 'home-outline', title: t('categories.home'), route: 'Home' },
        { iconName: 'account-search-outline', title: t('categories.findTeacher'), route: 'Search' },
        { iconName: 'book-outline', title: t('categories.study'), route: 'Dashboard' }, // 예: 과외->Dashboard로 가정
        { iconName: 'guitar-acoustic', title: t('categories.music'), route: 'Search' }, // 예: 악기레슨->Search 재사용
        { iconName: 'car-outline', title: t('categories.driving'), route: 'Reservations' }, 
        { iconName: 'heart-outline', title: t('categories.health'), route: 'Schedule' },
        { iconName: 'brush', title: t('categories.art'), route: 'TeacherDashboard' },
    ];

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
            {categories.map((cat, idx) => (
                <CategoryItem 
                    key={idx} 
                    iconName={cat.iconName} 
                    title={cat.title}
                    onPress={() => navigation.navigate(cat.route)} 
                />
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

const PopularServices = ({ t }) => {
    const services = [
        { title: '피아노 레슨', imageUri: 'https://via.placeholder.com/150' },
        { title: '특허 상담', imageUri: 'https://via.placeholder.com/150' },
        { title: 'DIY 목공', imageUri: 'https://via.placeholder.com/150' },
    ];

    return (
        <View style={styles.popularContainer}>
            <Text style={styles.sectionTitle}>{t('popularServices')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {services.map((srv, idx) => (
                    <ServiceCard key={idx} title={srv.title} imageUri={srv.imageUri} />
                ))}
            </ScrollView>
        </View>
    );
};

const LoginPrompt = ({ navigation, t }) => {
    return (
        <View style={styles.loginPromptContainer}>
            <Text style={styles.loginPromptText}>{t('loginPrompt')}</Text>
            <Button
                mode="outlined"
                onPress={() => navigation.navigate('Login')}
                style={styles.loginButton}
                textColor={BRAND_COLOR}
            >
                {t('login')}
            </Button>
        </View>
    );
};

const HomeScreen = ({ navigation }) => {
    const { t } = useTranslation();

    // AI 스크립트 분석 시스템 개념 주석:
    // 세션 종료 후 서버에서 녹화된 영상/스크립트를 AI 분석 API에 전달
    // AI가 분쟁의 잘잘못을 판단 후 환불 또는 대금 지급 결정
    // 여기서는 UI/UX만 구현하고 실제 로직은 백엔드/AI서버 연동 필요

    return (
        <LinearGradient colors={GRADIENT_COLORS} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TopBar t={t} />
                <SearchBar t={t} />
                <CategoryList t={t} navigation={navigation} />
                <PopularServices t={t} />
                <LoginPrompt navigation={navigation} t={t} />
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
