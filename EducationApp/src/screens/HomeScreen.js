// HomeScreen.js
import React from 'react';
import { View, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Avatar, Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

// 브랜드 컬러 및 스타일 관련 상수
const BRAND_COLOR = '#00B894';
const LIGHT_BG = '#F9F9F9';

const categories = [
  {name:'All', icon:'apps'},
  {name:'Moving/Cleaning', icon:'truck'},
  {name:'Install/Repair', icon:'wrench'},
  {name:'Interior', icon:'sofa'},
  {name:'Business', icon:'briefcase-outline'},
  {name:'Tutoring', icon:'school-outline'},
  {name:'Hobby', icon:'palette-outline'},
  {name:'Automotive', icon:'car-outline'},
  {name:'Legal/Finance', icon:'balance-scale'},
];

const mainMenus = [
  {name:'Find Pros', icon:'account-search-outline'},
  {name:'Community', icon:'forum-outline'},
  {name:'Market', icon:'cart-outline'},
  {name:'Portfolio', icon:'folder-image'},
];

const popularServices = [
  {title:'Piano Lessons', image:'https://via.placeholder.com/150x100.png?text=Piano'},
  {title:'Guitar Lessons', image:'https://via.placeholder.com/150x100.png?text=Guitar'},
  {title:'Math Tutoring', image:'https://via.placeholder.com/150x100.png?text=Math'},
  {title:'English Speaking', image:'https://via.placeholder.com/150x100.png?text=English'},
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <View style={styles.container}>
      {/* 상단 헤더 영역 (그라데이션 배경) */}
      <LinearGradient colors={[BRAND_COLOR, '#00C4A9']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={{flex:1}}>
            <Text style={styles.logoText}>bzla</Text>
            <Text style={styles.tagline}>Find the best experts for your needs</Text>
          </View>
          <View style={styles.headerRight}>
            <MaterialCommunityIcons name="account-circle-outline" size={28} color="#fff" style={{marginRight:10}}/>
            <Button mode="contained" onPress={()=>{}} style={styles.proBtn} labelStyle={{fontSize:14,color:'#00B894'}} buttonColor="#fff">Become a Pro</Button>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            mode="outlined"
            placeholder="What service are you looking for?"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            outlineColor="#fff"
            activeOutlineColor="#fff"
            textColor="#333"
            placeholderTextColor="#999"
            right={<TextInput.Icon name="magnify" color="#333"/>}
          />
        </View>
      </LinearGradient>

      <ScrollView style={{flex:1, backgroundColor:LIGHT_BG}} contentContainerStyle={{paddingBottom:80}}>
        
        {/* 카테고리 리스트 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((c,i)=>(
            <TouchableOpacity key={i} style={styles.catItem}>
              <View style={styles.catIconWrapper}>
                <MaterialCommunityIcons name={c.icon} size={22} color={BRAND_COLOR}/>
              </View>
              <Text style={styles.catLabel}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 메인 배너 */}
        <Card style={styles.bannerCard}>
          <Image source={{uri:'https://via.placeholder.com/600x200.png?text=Featured+Service'}} style={styles.bannerImage}/>
        </Card>

        {/* 주요 기능 메뉴 */}
        <View style={styles.mainMenuContainer}>
          {mainMenus.map((m,i)=>(
            <TouchableOpacity key={i} style={styles.mainMenuItem}>
              <Avatar.Icon icon={m.icon} size={48} color={BRAND_COLOR} style={styles.mainMenuIcon}/>
              <Text style={styles.mainMenuText}>{m.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 인기 서비스 */}
        <Text style={styles.sectionTitle}>Popular Services</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:10, paddingLeft:10}}>
          {popularServices.map((s,i)=>(
            <Card key={i} style={styles.serviceCard}>
              <Image source={{uri:s.image}} style={styles.serviceImage}/>
              <Card.Content>
                <Text style={styles.serviceTitle}>{s.title}</Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        {/* 로그인 유도 영역 */}
        <View style={styles.loginPrompt}>
          <Text style={{flex:1,fontSize:14,color:'#333'}}>Login to access more features and personalized recommendations</Text>
          <Button mode="text" onPress={()=>{}} textColor={BRAND_COLOR}>Login</Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1, backgroundColor:LIGHT_BG
  },
  header:{
    paddingTop:50,
    paddingBottom:20,
    paddingHorizontal:10,
  },
  headerContent:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  logoText:{
    fontSize:28,
    fontWeight:'bold',
    color:'#fff',
    letterSpacing:-1
  },
  tagline:{
    fontSize:12,
    color:'#e0f7f3',
    marginTop:2
  },
  headerRight:{
    flexDirection:'row',
    alignItems:'center'
  },
  proBtn:{
    height:36,
    justifyContent:'center',
    borderRadius:18,
    paddingHorizontal:15
  },
  searchContainer:{
    marginTop:10
  },
  searchInput:{
    height:40,
    fontSize:14,
    backgroundColor:'#fff',
    borderRadius:5
  },
  categoryScroll:{
    marginVertical:15,
    paddingLeft:10
  },
  catItem:{
    alignItems:'center',
    marginRight:15
  },
  catIconWrapper:{
    width:50,
    height:50,
    borderRadius:25,
    backgroundColor:'#EFFAF7',
    justifyContent:'center',
    alignItems:'center',
    marginBottom:5
  },
  catLabel:{
    fontSize:12,
    color:'#333'
  },
  bannerCard:{
    marginHorizontal:10,
    borderRadius:10,
    overflow:'hidden',
    marginBottom:20
  },
  bannerImage:{
    width:'100%',
    height:150,
    resizeMode:'cover'
  },
  mainMenuContainer:{
    flexDirection:'row',
    justifyContent:'space-around',
    marginVertical:20
  },
  mainMenuItem:{
    alignItems:'center',
    width:70
  },
  mainMenuIcon:{
    backgroundColor:'#DFF6F2'
  },
  mainMenuText:{
    marginTop:5,
    fontSize:12,
    color:'#333',
    textAlign:'center'
  },
  sectionTitle:{
    margin:10,
    fontWeight:'bold',
    fontSize:16,
    color:'#333'
  },
  serviceCard:{
    width:150,
    marginRight:10,
    borderRadius:10,
    overflow:'hidden',
    backgroundColor:'#fff',
    elevation:2
  },
  serviceImage:{
    width:'100%',
    height:100,
    resizeMode:'cover'
  },
  serviceTitle:{
    fontSize:14,
    color:'#333'
  },
  loginPrompt:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#FFF',
    padding:10,
    margin:10,
    borderRadius:10,
    elevation:1
  }
});
