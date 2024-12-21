// C:\Users\marcu\education_app\EducationApp\src\screens\teacherSignup\TeacherStep2.js
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const categories = [
  { id: 'cleaning', label: '이사/청소', icon: 'truck' },
  { id: 'repair', label: '설치/수리', icon: 'wrench' },
  { id: 'interior', label: '인테리어', icon: 'sofa' },
  { id: 'beauty', label: '이벤트/뷰티', icon: 'account-heart' },
  { id: 'job', label: '취업/직무', icon: 'pencil' },
  // ...etc
];

const TeacherStep2 = () => {
  const navigation = useNavigation();
  const [selectedCat, setSelectedCat] = useState('');

  const onSelect = (catId) => {
    setSelectedCat(catId);
  };

  const onNext = () => {
    // if (!selectedCat) ...
    navigation.navigate('TeacherStep3');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>고수 가입 (2단계)</Text>
      <Text style={{ marginBottom: 10 }}>어떤 고수로 활동하실 건가요?</Text>

      <ScrollView contentContainerStyle={styles.categoryList}>
        {categories.map((cat) => {
          const isSelected = selectedCat === cat.id;
          return (
            <TouchableOpacity 
              key={cat.id} 
              style={[
                styles.categoryItem, 
                isSelected && styles.selectedItem
              ]}
              onPress={() => onSelect(cat.id)}
            >
              <MaterialCommunityIcons 
                name={cat.icon} 
                size={24} 
                color="#666" 
              />
              <Text style={{ marginTop: 5 }}>{cat.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Button mode="contained" onPress={onNext} style={styles.btn}>
        다음
      </Button>
    </View>
  );
};

export default TeacherStep2;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, marginBottom: 10 },
  categoryList: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-around' 
  },
  categoryItem: {
    width: 80, 
    height: 80, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedItem: {
    borderColor: '#00B894', 
    borderWidth: 2,
  },
  btn: { marginTop: 20 },
});
