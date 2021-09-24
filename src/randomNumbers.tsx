import React, {FC} from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';

interface Props{
    id:number;
    title: number;
    isDisabled: boolean;
    onPress: (index)=>void;
};

const RandomNumber:FC<Props> = ({
    id,
    title,
    isDisabled,
    onPress,
})=>{
    
    const handlePress = ()=>{
        if(isDisabled) return;
        onPress(id);
    };

    return(
      <TouchableOpacity onPress={handlePress}>
          <Text style={[styles.input, isDisabled && styles.disabled]}>{title}</Text>
      </TouchableOpacity>
    );
  }
  
  const styles = StyleSheet.create({
      input:{
          backgroundColor: '#999',
          width: 100,
          marginHorizontal: 15,
          marginVertical: 25,
          fontSize: 35,
          textAlign: 'center',
      },
      disabled:{
          opacity: 0.3,
      },
  });
  
  export default RandomNumber;