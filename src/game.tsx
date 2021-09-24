import {
    Button,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React, {FC, useEffect, useState} from "react";

import RandomNumber from './randomNumbers';
import { shuffle } from "lodash";

interface Props{
    randomNumberCount: number;
    initialSeconds: number;
    onPlayAgain: ()=> void;
}

enum GameStatusEnum{
    playing = 'PLAYING',
    won = 'WON',
    lost = 'LOST',
}

const Game:FC<Props> = ({
    randomNumberCount,
    initialSeconds,
    onPlayAgain,
})=>{
    
    const [target, setTarget] = useState<number>(0);
    const [shuffledRandomNumbers, setShuffledRandomNumbers] = useState<number[]>([]);
    const [selectedIds, setSelectedIds] = useState<any>([]);
    const [gameStatus, setGameStatus] = useState(GameStatusEnum.playing);
    const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
    const [intervalId, setIntervalId] = useState<any>(null);

    const [randomNumbers, setRandomNumbers] = useState<number[]>([]);
    const [sumSelect, setSumSelect] = useState<number>(0);

    useEffect(()=>{
        generateRandomNumbers();
        startTimer();
    }, []);

    useEffect(()=>{
        setGameStatus(calculateGameStatus());
    }, [selectedIds]);

    useEffect(()=>{
        if(remainingSeconds <= 0 || gameStatus !== GameStatusEnum.playing){
            stopTimer();
            setGameStatus(calculateGameStatus);
        }
    }, [remainingSeconds]);

    const startTimer = ()=>{
        const timer = setInterval(()=>{
            setRemainingSeconds(prevCount => prevCount - 1);
        }, 1000);
        setIntervalId(timer);
    }

    const stopTimer=()=>{
        clearInterval(intervalId);
        setIntervalId(null);
    }

    const generateRandomNumbers = ()=>{
        let randomNumbers: number[] = Array.from({length: randomNumberCount})
            .map(()=> 1 + Math.floor(10 * Math.random()));

        const randomTarget: number = randomNumbers
            .slice(0, randomNumberCount - 2)
            .reduce((acc, curr) => acc+curr, 0);

            setRandomNumbers(randomNumbers);
            setGameStatus(calculateGameStatus());
            setTarget(randomTarget);
            setShuffledRandomNumbers(shuffle(randomNumbers));
            resetValues();
    };

    const resetValues = () => {
        setSelectedIds([]);
        setGameStatus(GameStatusEnum.playing);
        setRemainingSeconds(initialSeconds);
        setIntervalId(null);
    };

    const isNumberSelected = (numberIndex: number): boolean=>{
        return selectedIds.indexOf(numberIndex) >= 0;
    }
    
    const selectNumber = (numberIndex: number)=>{
        setSelectedIds([...selectedIds, numberIndex]);
    };

    const calculateGameStatus = ()=>{
        const sumSelected = selectedIds.reduce((acc:number, curr:number) => 
            (acc + shuffledRandomNumbers[curr]),0);
            //return acc + shuffledRandomNumbers[curr];
       // },0);

        setSumSelect(sumSelected);

        if(remainingSeconds === 0) return GameStatusEnum.lost;
        if(sumSelected < target) return GameStatusEnum.playing;
        if(sumSelected === target) return GameStatusEnum.won;
        if(sumSelected > target) return GameStatusEnum.lost;        

        return GameStatusEnum.playing;
    };

    return(
      <View style={styles.container}>          
          
          <Text>Selected Ids: {selectedIds}</Text>
          <Text>Sum Selected: {sumSelect}</Text>
          <Text>Game Status: {gameStatus}</Text>          
          <Text>Interval Id: {intervalId}</Text>
          <Text>Random Numbers: {randomNumbers}</Text>
          <Text>Shuffled Numbers: {shuffledRandomNumbers}</Text>
          
          <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>Target = {target}</Text>

          <View style={styles.randomContainer}>
            {
                shuffledRandomNumbers &&
                shuffledRandomNumbers.map((value, index)=>(
                    <RandomNumber 
                        key={index}
                        id = {index}
                        title = {value}
                        isDisabled = {isNumberSelected(index) || gameStatus!== GameStatusEnum.playing}
                        onPress = {selectNumber}
                    />
                ))
            }
          </View>
          {
              gameStatus !== GameStatusEnum.playing &&
              <Button title="Play Again" onPress={onPlayAgain} />
          }
          <Text>Remaining Seconds: {remainingSeconds}</Text>

          
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container:{
      backgroundColor: '#ddd',
      flex:1,
    },
    target:{
      fontSize: 50,
      margin: 50,
      textAlign: 'center',
    },
    randomContainer:{
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
    STATUS_PLAYING:{
      backgroundColor: '#bbb',
    },
    STATUS_WON:{
      backgroundColor: 'green',
    },
    STATUS_LOST:{
      backgroundColor: 'red',
    },
  
  });
  
  export default Game;